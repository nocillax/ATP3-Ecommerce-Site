import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { ProductVariant } from 'src/product/product-variant.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  // 🆕 Connect to ProductVariant
  @ManyToOne(() => ProductVariant, { eager: true, nullable: true })
  productVariant: ProductVariant;

  // 🔽 Denormalized snapshot fields (stored for order history)
  @Column()
  productName: string;

  @Column({ nullable: true })
  productColor?: string; // optional but useful

  @Column({ nullable: true })
  productImageUrl?: string; // optional – first image of variant

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  productPrice: number; // price at time of purchase

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalPrice: number;

  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  order: Order;
}
