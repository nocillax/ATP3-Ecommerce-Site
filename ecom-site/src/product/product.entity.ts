import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Category } from '../category/category.entity'; // Adjust the import path as necessary
import { Exclude } from 'class-transformer';
import { Review } from 'src/review/review.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column()
  quantity: number;

  @Column('float')
  rating: number;

  @ManyToMany(() => Category, (category) => category.products, { onDelete: 'SET NULL' , nullable: true })
  @JoinTable()
  categories: Category[];

  @OneToMany(() => Review, (review) => review.product, { nullable: true })
  reviews: Review[];

}

