import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from '../category/category.entity'; // Adjust the import path as necessary
import { Exclude } from 'class-transformer';
import { Review } from 'src/review/review.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  rating: number;

  @ManyToMany(() => Category, (category) => category.products, { onDelete: 'SET NULL' , nullable: true })
  @JoinTable()
  categories: Category[];

  @OneToMany(() => Review, (review) => review.product, { nullable: true })
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}

