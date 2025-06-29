import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../category/category.entity'; // Adjust the import path as necessary
import { Exclude } from 'class-transformer';
import { Review } from 'src/review/review.entity';
import { ProductVariant } from 'src/product/product-variant.entity';
import { Brand } from 'src/brand/brand.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  /* ────────────────────────────────── NEW / CHANGED ───────────────────────── */

  @Column()
  name: string;

  @Column({ nullable: true })
  subtitle?: string; // e.g. “– Mocha Dusk –”

  @ManyToOne(() => Brand, { nullable: true })
  brand?: Brand | null; // FK brandId

  @Column('decimal', { precision: 12, scale: 2 })
  price: number; // base list price

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  cost?: number;

  /* moved ↓ to variant */
  // quantity  ❌ remove – stock now lives on variants

  @Column('decimal', { precision: 2, scale: 1, default: 0 })
  rating: number;

  @Column({ default: 0 })
  reviewCount: number;

  @Column('simple-array', { nullable: true })
  imageUrls?: string[]; // generic/hero shots (optional)

  @Column({ default: false })
  isOnSale: boolean;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  discountPercent: number;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: true })
  isActive: boolean;

  /* Relations */
  @ManyToMany(() => Category, (c) => c.products, { nullable: true })
  @JoinTable()
  categories?: Category[];

  @OneToMany(() => ProductVariant, (v) => v.product, { cascade: true })
  variants: ProductVariant[];

  @OneToMany(() => Review, (r) => r.product)
  reviews: Review[];

  /* Meta */
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
