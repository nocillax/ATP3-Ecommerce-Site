import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, Unique, JoinColumn, UpdateDateColumn, CreateDateColumn } from "typeorm";
import { User } from "src/user/user.entity";
import { Product } from "src/product/product.entity";

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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
