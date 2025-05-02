import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { Product } from '../product/product.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
