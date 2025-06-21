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
import { buildOrderReceivedEmail } from 'src/mail/templates/order-recieved';
import { buildOrderStatusUpdatedEmail } from 'src/mail/templates/order-status-updated';
import { buildAdminOrderAlert } from 'src/mail/templates/admin-order-alert';
import { buildOrderCancelledEmail } from 'src/mail/templates/order-cancelled';
import { StripeService } from 'src/stripe/stripe.service';
import { Product } from 'src/product/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectDataSource()
    private readonly dataSource: DataSource,

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

  private async processOrder(
    userId: number,
    shippingAddress?: string,
  ): Promise<any> {
    const cart = await this.cartService.findExistingCartByUserId(userId);

    if (!cart || cart.cartItems.length === 0) {
      throw new NotFoundException('Your cart is empty');
    }

    const user = cart.user;
    const finalShippingAddress = shippingAddress || user.defaultShippingAddress;

    if (!finalShippingAddress) {
      throw new BadRequestException(
        'No shipping address provided and no default address found',
      );
    }

    const orderItems = cart.cartItems.map((cartItem) => {
      const basePrice = Number(cartItem.product.price);
      const salePrice = cartItem.product.isOnSale
        ? Math.round(
            basePrice * (1 - cartItem.product.discountPercent / 100) * 100,
          ) / 100
        : Math.round(basePrice * 100) / 100;

      return this.orderItemRepo.create({
        productName: cartItem.product.name,
        productPrice: salePrice,
        quantity: cartItem.quantity,
        totalPrice: Math.round(salePrice * cartItem.quantity * 100) / 100,
      });
    });

    const totalOrderPrice = orderItems.reduce(
      (sum, item) => sum + Number(item.totalPrice),
      0,
    );

    const order = this.orderRepo.create({
      user,
      orderItems,
      shippingAddress: finalShippingAddress,
      totalPrice: totalOrderPrice,
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
    const finalShippingAddress = shippingAddress || user.defaultShippingAddress;

    if (!finalShippingAddress) {
      throw new BadRequestException(
        'No shipping address provided and no default address found',
      );
    }

    for (const cartItem of cart.cartItems) {
      const product = await this.productRepo.findOne({
        where: { id: cartItem.product.id },
      });

      if (!product) {
        throw new NotFoundException(
          `Product with ID ${cartItem.product.id} not found`,
        );
      }

      if (product.quantity < cartItem.quantity) {
        throw new BadRequestException(
          `Not enough stock for ${product.name}. Available: ${product.quantity}, Requested: ${cartItem.quantity}`,
        );
      }
    }
  }

  // ===========================================================================
  // API Functions
  // ===========================================================================

  async finalizePaidOrder(
    userId: number,
    shippingAddress?: string,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { cart, user, order } = await this.processOrder(
        userId,
        shippingAddress,
      );

      for (const cartItem of cart.cartItems) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: cartItem.product.id },
        });

        if (!product) {
          throw new NotFoundException(
            `Product with ID ${cartItem.product.id} not found`,
          );
        }

        if (product.quantity < cartItem.quantity) {
          throw new BadRequestException(
            `Not enough stock for ${product.name}. Available: ${product.quantity}, Requested: ${cartItem.quantity}`,
          );
        }

        product.quantity -= cartItem.quantity;
        await queryRunner.manager.save(product);
      }

      order.status = OrderStatus.PENDING;
      order.paymentStatus = 'PAID';
      await queryRunner.manager.save(order);

      cart.cartItems = [];
      cart.totalPrice = 0;
      await queryRunner.manager.save(cart);

      await queryRunner.commitTransaction();

      try {
        await this.mailService.sendMail(
          user.email,
          'Your Order Has Been Received',
          buildOrderReceivedEmail(user, order),
        );
      } catch (error) {
        console.error(
          `Failed to send order confirmation email for Order #${order.id}:`,
          error,
        );
      }

      try {
        await this.mailService.sendMail(
          'admin01@gmail.com',
          'New Order Received',
          buildAdminOrderAlert(user, order),
        );
      } catch (err) {
        console.error(`Failed to notify admin about order #${order.id}:`, err);
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /* async initiateCheckout(userId: number, shippingAddress?: string): Promise<{ url: string }> {
        const order = await this.processOrder(userId, shippingAddress);

        const amountInCents = Math.round(Number(order.totalPrice) * 100);


        const session = await this.stripeService.createCheckoutSession(amountInCents, userId);

        return { url: session.url! };
    }

    async createOrder(userId: number, shippingAddress?: string): Promise<{ message: string }> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const { cart, user, order } = await this.processOrder(userId, shippingAddress);
            order.status = OrderStatus.PENDING;
            order.paymentStatus = 'UNPAID';

            await queryRunner.manager.save(order);
            await queryRunner.manager.delete('CartItem', { cart: { id: cart.id } });

            cart.cartItems = [];
            cart.totalPrice = 0;
            await queryRunner.manager.save(cart);
            await queryRunner.commitTransaction();

            try {
                await this.mailService.sendMail(
                    user.email,
                    'Your Order Has Been Received',
                    buildOrderReceivedEmail(user, order),
                );
            } 
            catch (error) {
                console.error(`Failed to send order confirmation email for Order #${order.id}:`, error);
            }

            try {
                await this.mailService.sendMail(
                    'admin@example.com',
                    'New Order Received',
                    buildAdminOrderAlert(user, order),
                );
            } 
            catch (err) {
                console.error(`Failed to notify admin about order #${order.id}:`, err);
            }

            return { message: 'Order placed successfully' };
        } 
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } 
        finally {
            await queryRunner.release();
        }
    } */

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
  }): Promise<[Order[], number]> {
    const qb = this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.orderItems', 'item')
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
      throw new NotFoundException('No orders found');
    }

    return [orders, total];
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
