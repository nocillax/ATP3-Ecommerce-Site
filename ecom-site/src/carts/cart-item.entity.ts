import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Cart } from "./cart.entity";
import { Product } from "src/products/product.entity";
import { Exclude } from "class-transformer";

@Entity()
export class CartItem {
    @PrimaryGeneratedColumn()
    @Exclude({ toPlainOnly: true })
    id: number;

    @ManyToOne(() => Cart, cart => cart.items)
    cart: Cart;

    @ManyToOne(() => Product)
    product: Product;

    @Column()
    quantity: number;
}
