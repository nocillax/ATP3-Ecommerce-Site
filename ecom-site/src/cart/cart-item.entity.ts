import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from 'src/product/product.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.cartItems, { onDelete: 'CASCADE' })
  cart: Cart;

  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
