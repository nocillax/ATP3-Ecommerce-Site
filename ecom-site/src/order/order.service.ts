import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CartService } from 'src/cart/cart.service';
import { Cart } from 'src/cart/cart.entity';
import { MailService } from 'src/mail/mail.service';

import { StripeService } from 'src/stripe/stripe.service';
import { Product } from 'src/product/product.entity';
import { ProductVariant } from 'src/product/product-variant.entity';
import {
  buildAdminOrderAlert,
  buildOrderCancelledEmail,
  buildOrderReceivedEmail,
  buildOrderStatusUpdatedEmail,
} from 'src/mail/templates/order-templates';

// Helper function

function unitPrice(variant: ProductVariant): number {
  const base = variant.priceOverride ?? variant.product.price;
  const discounted = variant.product.isOnSale
    ? base * (1 - variant.product.discountPercent / 100)
    : base;
  return Math.round(discounted * 100) / 100;
}

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,

    @InjectRepository(ProductVariant) // NEW
    private readonly variantRepo: Repository<ProductVariant>, // NEW

    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly cartService: CartService,
    private readonly mailService: MailService,
    private readonly stripeService: StripeService,
  ) {}

  // ===========================================================================
  // Internal Functions
  // ===========================================================================

  async getOrderById(orderId: number): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['orderItems', 'user'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async findOrderWithUser(orderId: number): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['user'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  ensureOrderIsCancelable(order: Order): void {
    if (
      order.status !== OrderStatus.PENDING &&
      order.status !== OrderStatus.CANCELLED
    ) {
      throw new ForbiddenException(
        'Order has already been processed and cannot be cancelled',
      );
    }
  }

  async calculateCartTotal(userId: number): Promise<number> {
    const cart = await this.cartService.findExistingCartByUserId(userId);

    if (!cart || cart.cartItems.length === 0) {
      throw new NotFoundException('Your cart is empty');
    }

    const total = cart.cartItems.reduce(
      (sum, item) => sum + Number(item.price),
      0,
    );

    return total;
  }

  private async processOrder(userId: number, shippingAddress?: string) {
    const cart = await this.cartService.findExistingCartByUserId(userId);
    if (!cart || cart.cartItems.length === 0) {
      throw new NotFoundException('Your cart is empty');
    }

    const user = cart.user;
    const shipTo = shippingAddress || user.defaultShippingAddress;
    if (!shipTo) throw new BadRequestException('No shipping address provided');

    const orderItems = cart.cartItems.map((ci) => {
      const price = unitPrice(ci.productVariant);
      return this.orderItemRepo.create({
        productVariant: ci.productVariant,
        productName: ci.productVariant.product.name,
        productColor: ci.productVariant.color,
        productImageUrl: ci.productVariant.imageUrls?.[0],
        productPrice: price,
        quantity: ci.quantity,
        totalPrice: Math.round(price * ci.quantity * 100) / 100,
      });
    });

    const orderTotal = orderItems.reduce(
      (sum, item) => sum + Number(item.totalPrice),
      0,
    );

    const order = this.orderRepo.create({
      user,
      orderItems,
      shippingAddress: shipTo,
      totalPrice: orderTotal,
    });

    return { cart, user, order };
  }

  async validateCheckout(
    userId: number,
    shippingAddress?: string,
  ): Promise<void> {
    const cart = await this.cartService.findExistingCartByUserId(userId);
    if (!cart || cart.cartItems.length === 0) {
      throw new BadRequestException('Your cart is empty');
    }

    const user = cart.user;
    const finalAddress = shippingAddress || user.defaultShippingAddress;
    if (!finalAddress) {
      throw new BadRequestException(
        'No shipping address provided and no default address found',
      );
    }

    /* stock check on VARIANTS */
    for (const ci of cart.cartItems) {
      const variant = await this.variantRepo.findOne({
        where: { id: ci.productVariant.id },
      });
      if (!variant) {
        throw new NotFoundException(
          `Variant ${ci.productVariant.id} not found`,
        );
      }
      if (variant.stock < ci.quantity) {
        throw new BadRequestException(
          `Not enough stock for ${variant.product.name} (${variant.color}). ` +
            `Available: ${variant.stock}, requested: ${ci.quantity}`,
        );
      }
    }
  }

  async finalizePaidOrder(
    userId: number,
    shippingAddress?: string,
  ): Promise<void> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const { cart, user, order } = await this.processOrder(
        userId,
        shippingAddress,
      );

      /* deduct stock PER VARIANT */
      for (const ci of cart.cartItems) {
        const variant = await qr.manager.findOne(ProductVariant, {
          where: { id: ci.productVariant.id },
        });
        if (!variant || variant.stock < ci.quantity) {
          throw new BadRequestException(
            `Not enough stock for ${ci.productVariant.product.name} (${ci.productVariant.color}).`,
          );
        }
        variant.stock -= ci.quantity;
        await qr.manager.save(variant);
      }

      order.status = OrderStatus.PENDING;
      order.paymentStatus = 'PAID';
      await qr.manager.save(order);

      /* clear cart */
      cart.cartItems = [];
      cart.totalPrice = 0;
      await qr.manager.save(cart);

      await qr.commitTransaction();

      /* send emails (same as before) */
      try {
        await this.mailService.sendMail(
          user.email,
          'Your Order Has Been Received',
          buildOrderReceivedEmail(user, order),
        );
      } catch (err) {
        console.error('Email err', err);
      }

      try {
        await this.mailService.sendMail(
          'admin01@gmail.com',
          'New Order Received',
          buildAdminOrderAlert(user, order),
        );
      } catch (err) {
        console.error('Admin email err', err);
      }
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }

  async getMyOrders(userId: number): Promise<Order[]> {
    return this.orderRepo.find({
      where: { user: { id: userId } },
      relations: ['orderItems'],
    });
  }

  async getFilteredOrders(params: {
    skip: number;
    take: number;
    sort: string;
    order: 'ASC' | 'DESC';
    userId?: number;
    status?: string;
  }): Promise<[any[], number]> {
    // Note: I've changed the return type to any[] for the transformed data
    const qb = this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.orderItems', 'item')
      // Because your OrderItem -> ProductVariant relation is "eager",
      // TypeORM automatically joins and selects the variant data for us.
      // We also need the product data for the original price.
      .leftJoinAndSelect('item.productVariant', 'variant')
      .leftJoinAndSelect('variant.product', 'product')
      .skip(params.skip)
      .take(params.take)
      .orderBy(`order.${params.sort}`, params.order);

    if (params.userId) {
      qb.andWhere('order.userId = :userId', { userId: params.userId });
    }

    if (params.status) {
      qb.andWhere('order.status = :status', { status: params.status });
    }

    const [orders, total] = await qb.getManyAndCount();

    if (orders.length === 0) {
      return [[], 0];
    }

    // ✅ START: New, richer data transformation block
    const transformedOrders = orders.map((order) => {
      const newItems = order.orderItems.map((item) => {
        // Calculate the price breakdown for each item
        const originalPrice = parseFloat(
          String(item.productVariant.product.price),
        );
        const pricePaid = parseFloat(String(item.productPrice));
        const discount =
          originalPrice > pricePaid ? originalPrice - pricePaid : 0;

        return {
          // --- All the new data for the detailed view ---
          name: item.productName,
          variantInfo: `Color: ${item.productVariant.color}`, // Variant info
          imageUrl:
            item.productVariant.imageUrls?.[0] ||
            item.productVariant.product.imageUrls?.[0] ||
            '/placeholder.png', // Variant or Product Image
          quantity: item.quantity,
          originalPrice: originalPrice,
          discount: discount,
          price: pricePaid, // Final price per item
          subtotal: pricePaid * item.quantity,
        };
      });

      return {
        id: `ORD${String(order.id).padStart(3, '0')}`,
        databaseId: order.id,
        customer: order.user.name,
        date: order.createdAt, // Send the full date object for formatting on the frontend
        total: parseFloat(String(order.totalPrice)),
        status: (order.status.charAt(0).toUpperCase() +
          order.status.slice(1)) as Order['status'],
        items: newItems,
        shippingAddress: order.shippingAddress,
        paymentStatus: order.paymentStatus,
      };
    });
    // ✅ END: New, richer data transformation block

    // Return the newly shaped data
    return [transformedOrders, total];
  }

  async cancelOrder(
    userId: number,
    orderId: number,
  ): Promise<{ message: string }> {
    const order = await this.findOrderWithUser(orderId);

    if (order.user.id !== userId) {
      throw new ForbiddenException('You cannot cancel this order');
    }

    this.ensureOrderIsCancelable(order);

    order.status = OrderStatus.CANCELLED;
    await this.orderRepo.save(order);

    const user = order.user;
    try {
      await this.mailService.sendMail(
        user.email,
        'Your Order Has Been Cancelled',
        buildOrderCancelledEmail(user, order),
      );
    } catch (err) {
      console.error(
        `Failed to send cancellation email for order #${order.id}:`,
        err,
      );
    }

    return { message: 'Order cancelled successfully' };
  }

  async updateOrderStatus(
    orderId: number,
    status: OrderStatus,
  ): Promise<{ message: string }> {
    const order = await this.findOrderWithUser(orderId);

    order.status = status;
    await this.orderRepo.save(order);

    const user = order.user;
    if (user?.email) {
      try {
        await this.mailService.sendMail(
          user.email,
          'Your Order Status Has Been Updated',
          buildOrderStatusUpdatedEmail(user, order),
        );
      } catch (err) {
        console.error(
          `Failed to send status update email for order ${orderId}:`,
          err,
        );
      }
    }

    return { message: `Order status updated to ${status}` };
  }

  async deleteOrder(orderId: number): Promise<{ message: string }> {
    const order = await this.getOrderById(orderId);

    await this.orderRepo.remove(order);
    return { message: 'Order deleted successfully' };
  }
}
