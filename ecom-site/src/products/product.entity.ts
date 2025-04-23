import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Category } from '../categories/category.entity'; // Adjust the import path as necessary
import { Exclude } from 'class-transformer';
import { Review } from 'src/reviews/review.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  //@Exclude({ toPlainOnly: true }) // Exclude id ONLY from the response
  id: number;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column()
  quantity: number;

  @Column('float')
  rating: number;

  @ManyToMany(() => Category, (category) => category.products, { onDelete: 'SET NULL' })
  @JoinTable()
  categories: Category[];

  @OneToMany(() => Review, (review) => review.product, { nullable: true })
  reviews: Review[];

}

