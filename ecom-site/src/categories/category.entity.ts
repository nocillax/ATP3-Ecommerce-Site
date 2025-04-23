import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { Product } from '../products/product.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  @Exclude({ toPlainOnly: true }) // Exclude id ONLY from the response
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];
}
