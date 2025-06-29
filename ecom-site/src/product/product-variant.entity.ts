import { Product } from 'src/product/product.entity';
import { Column, CreateDateColumn, ManyToOne, UpdateDateColumn } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn';
import { Entity } from 'typeorm/decorator/entity/Entity';

@Entity()
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (p) => p.variants, { onDelete: 'CASCADE' })
  product: Product;

  @Column()
  color: string; // "Mocha Dusk"

  @Column('simple-array', { nullable: true })
  imageUrls?: string[]; // colour-specific images

  @Column()
  stock: number; // quantity for this colour

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  priceOverride?: number; // NULL → use base price

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
