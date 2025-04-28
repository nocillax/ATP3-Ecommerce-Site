import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    productName: string;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    productPrice: number;

    @Column()
    quantity: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    totalPrice: number;

    @ManyToOne(() => Order, (order) => order.orderItems)
    order: Order;
}
