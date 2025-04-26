import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, Unique, JoinColumn } from "typeorm";
import { User } from "src/users/user.entity";
import { Product } from "src/products/product.entity";

@Entity()
@Unique(['user', 'product'])
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    rating: number;

    @Column({ nullable: true })
    comment: string;

    @ManyToOne(() => User, user => user.reviews, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'userId' }) // Repo can find this column by this name
    user: User;
  
    @ManyToOne(() => Product, product => product.reviews, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'productId' })
    product: Product;
}
