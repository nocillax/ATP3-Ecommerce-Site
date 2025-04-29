import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CartService } from 'src/cart/cart.service';
import { Cart } from 'src/cart/cart.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepo: Repository<Order>,

        @InjectRepository(OrderItem)
        private readonly orderItemRepo: Repository<OrderItem>,

        @InjectDataSource() 
        private readonly dataSource: DataSource,

        private readonly cartService: CartService,
    ) {}


async createOrder(userId: number): Promise<{ message: string }> {
    const cart = await this.cartService.findExistingCartByUserId(userId);

    if (!cart || cart.cartItems.length === 0) {
        throw new NotFoundException('Your cart is empty');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const orderItems = cart.cartItems.map(cartItem => {
            return this.orderItemRepo.create({
                productName: cartItem.product.name,
                productPrice: Number(cartItem.product.price),
                quantity: cartItem.quantity,
                totalPrice: Number(cartItem.price),
            });
        });

        const totalOrderPrice = orderItems.reduce((sum, item) => sum + Number(item.totalPrice), 0);

        const order = this.orderRepo.create({
            user: cart.user,
            orderItems,
            status: OrderStatus.PENDING,
            totalPrice: totalOrderPrice,
        });

        // Save order
        await queryRunner.manager.save(order);

        // Clear cart
        await queryRunner.manager.delete('CartItem', { cart: { id: cart.id } }); // Clear cart items from DB
        cart.cartItems = [];
        cart.totalPrice = 0;
        await queryRunner.manager.save(cart);

        // Commit transaction
        await queryRunner.commitTransaction();

        return { message: 'Order placed successfully' };
    } catch (error) {
        // Rollback transaction if anything fails
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
}






    /* async createOrder(userId: number): Promise<{ message: string }> {
    const cart = await this.cartService.findExistingCartByUserId(userId);

    if (!cart || cart.cartItems.length === 0) {
        throw new NotFoundException('Your cart is empty');
    }

    const orderItems = cart.cartItems.map(cartItem => {
        const itemTotalPrice = Number(cartItem.price) * cartItem.quantity;
        return this.orderItemRepo.create({
            productName: cartItem.product.name,
            productPrice: Number(cartItem.product.price),
            quantity: cartItem.quantity,
            totalPrice: itemTotalPrice,
        });
    });

    const totalPrice = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);

    const order = this.orderRepo.create({
        user: cart.user,
        orderItems,
        status: OrderStatus.PENDING,
        totalPrice,
    });

    await this.orderRepo.save(order);

    // Optionally: Clear the cart after ordering
    //await this.cartService.clearCart(userId);

    return { message: 'Order created successfully' };
} */




    async getMyOrders(userId: number): Promise<Order[]> {
        return this.orderRepo.find({
            where: { user: { id: userId } },
            relations: ['orderItems'],
        });
    }

    async getOrderById(userId: number, orderId: number): Promise<Order> {
        const order = await this.orderRepo.findOne({
            where: { id: orderId },
            relations: ['orderItems', 'user'],
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (order.user.id !== userId) {
            throw new ForbiddenException('You are not allowed to view this order');
        }

        return order;
    }

    async cancelOrder(userId: number, orderId: number): Promise<{ message: string }> {
        const order = await this.orderRepo.findOne({
            where: { id: orderId },
            relations: ['user'],
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (order.user.id !== userId) {
            throw new ForbiddenException('You cannot cancel this order');
        }

        if (order.status !== OrderStatus.PENDING) {
            throw new ForbiddenException('Only pending orders can be cancelled');
        }

        order.status = OrderStatus.CANCELLED;
        await this.orderRepo.save(order);

        return { message: 'Order cancelled successfully' };
    }

    async getAllOrders(): Promise<Order[]> {
        return this.orderRepo.find({
            relations: ['orderItems', 'user'],
        });
    }

    async updateOrderStatus(orderId: number, status: OrderStatus): Promise<{ message: string }> {
        const order = await this.orderRepo.findOne({
            where: { id: orderId },
            relations: ['user'],
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        order.status = status;
        await this.orderRepo.save(order);

        return { message: `Order status updated to ${status}` };
    }
}
