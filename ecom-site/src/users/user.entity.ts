import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


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
    password: string;

    @Column({ nullable: true })
    phone?: string;

    @Column({ 
        type: 'enum',
        enum: UserRole,
        default: UserRole.CUSTOMER,
    })
    role: UserRole;


/*     @OneToMany(() => Review, (review) => review.user)
    reviews: Review[]; // Assuming you have a Review entity defined elsewhere

    @OneToMany(() => Cart, (cart) => cart.user)
    cart: Cart[];

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[]; */
    
}