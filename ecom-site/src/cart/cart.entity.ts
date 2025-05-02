import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, Column, UpdateDateColumn, CreateDateColumn } from "typeorm";
import { User } from "src/user/user.entity";
import { CartItem } from "src/cart/cart-item.entity";
import { Exclude } from "class-transformer";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.cart, { onDelete: 'CASCADE' })
  @JoinColumn()     // Foreign key column in Cart table
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
  cartItems: CartItem[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
