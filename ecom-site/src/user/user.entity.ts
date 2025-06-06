import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { Cart } from "src/cart/cart.entity";
import { Review } from "src/review/review.entity";
import { Order } from "src/order/order.entity";


export enum UserRole {
    ADMIN = 'admin',
    CUSTOMER = 'customer'
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    @Exclude({ toPlainOnly: true })
    password: string;

    @Column({ nullable: true })
    phone?: string;

    @Column({ 
        type: 'enum',
        enum: UserRole,
        default: UserRole.CUSTOMER,
    })
    role: UserRole;

    @OneToMany(() => Review, review => review.user)
    reviews: Review[];

    @OneToMany(() => Order, order => order.user)
    orders: Order[];

    @OneToMany(() => Cart, (cart) => cart.user)
    cart: Cart[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'text', nullable: true })
    defaultShippingAddress: string;


}