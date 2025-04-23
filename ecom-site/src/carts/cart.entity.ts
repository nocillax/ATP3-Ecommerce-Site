import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "src/users/user.entity";
import { CartItem } from "src/carts/cart-item.entity";
import { Exclude } from "class-transformer";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    @Exclude({ toPlainOnly: true }) 
    id: number;

    @OneToOne(() => User, user => user.cart)
    @JoinColumn()
    user: User;

    @OneToMany(() => CartItem, cartItem => cartItem.cart, { cascade: true })
    items: CartItem[];
}
