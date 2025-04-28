import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { Cart } from "src/carts/cart.entity";
import { Review } from "src/reviews/review.entity";
import { Order } from "src/orders/order.entity";


export enum UserRole {
    ADMIN = 'admin',
    CUSTOMER = 'customer'
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    @Exclude({ toPlainOnly: true }) // Exclude id ONLY from the response
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    @Exclude({ toPlainOnly: true }) // Exclude password ONLY from the response 
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
    carts: Cart[];

}