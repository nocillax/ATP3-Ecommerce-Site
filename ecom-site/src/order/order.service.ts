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
        if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.CANCELLED) {
            throw new ForbiddenException('Order has already been processed and cannot be cancelled');
        }
    }


    // ===========================================================================
    // API Functions
    // ===========================================================================


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

            await queryRunner.manager.save(order);
            await queryRunner.manager.delete('CartItem', { cart: { id: cart.id } });

            cart.cartItems = [];
            cart.totalPrice = 0;
            await queryRunner.manager.save(cart);

            await queryRunner.commitTransaction();
            return { message: 'Order placed successfully' };
        } 
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } 
        finally {
            await queryRunner.release();
        }
    }


    async getMyOrders(userId: number): Promise<Order[]> {
        return this.orderRepo.find({
            where: { user: { id: userId } },
            relations: ['orderItems'],
        });
    }

    async getAllOrders(): Promise<Order[]> {
        return this.orderRepo.find({
            relations: ['orderItems', 'user'],
        });
    }


    async cancelOrder(userId: number, orderId: number): Promise<{ message: string }> {
        const order = await this.findOrderWithUser(orderId);

        if (order.user.id !== userId) {
            throw new ForbiddenException('You cannot cancel this order');
        }

        this.ensureOrderIsCancelable(order);

        order.status = OrderStatus.CANCELLED;
        await this.orderRepo.save(order);

        return { message: 'Order cancelled successfully' };
    }


    async updateOrderStatus(orderId: number, status: OrderStatus): Promise<{ message: string }> {
        const order = await this.findOrderWithUser(orderId);

        order.status = status;
        await this.orderRepo.save(order);

        return { message: `Order status updated to ${status}` };
    }


    async deleteOrder(orderId: number): Promise<{ message: string }> {
        const order = await this.getOrderById(orderId);

        await this.orderRepo.remove(order);
        return { message: 'Order deleted successfully' };
    }


}
