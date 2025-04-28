/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { UsersService } from 'src/user/user.service';
import { ProductsService } from 'src/product/product.service';
import { AddToCartDto } from './DTO/add-to-cart.dto';
import { UpdateCartItemDto } from './DTO/update-cart-item.dto';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private readonly cartRepo: Repository<Cart>,

        @InjectRepository(CartItem)
        private readonly cartItemRepo: Repository<CartItem>,

        private readonly productsService: ProductsService,
        private readonly usersService: UsersService,
    ) {}


    // ===========================================================================
    // Internal Functions
    // ===========================================================================


    async createCartForUser(userId: number): Promise<Cart> {
        const user = await this.usersService.findExistingUserById(userId);
        const cart = this.cartRepo.create({ 
            user, 
            cartItems: [], 
            totalPrice: 0 
        });

        return await this.cartRepo.save(cart);
    }


    async findCartByUserId(userId: number): Promise<Cart | null> {

        return await this.cartRepo.findOne({
            where: { user: { id: userId } },
            relations: ['cartItems', 'cartItems.product'],
        });
    }


    async findExistingCartByUserId(userId: number): Promise<Cart> {
        const cart = await this.cartRepo.findOne({
            where: { user: { id: userId } },
            relations: ['cartItems', 'cartItems.product'],
        });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        return cart;
    }


    async findExistingCartItemOfUser(userId: number, cartItemId: number): Promise<CartItem> {
        const cartItem = await this.cartItemRepo.findOne({
            where: { id: cartItemId },
            relations: ['cart', 'cart.user'],
        });

        if (!cartItem || cartItem.cart.user.id !== userId) {
            throw new NotFoundException('Cart item not found or unauthorized');
        }

        return cartItem;
    }


    async findCartItem(cart: Cart, productId: number): Promise<CartItem | undefined> {

        return cart.cartItems.find(item => item.product.id === productId);  // Find cart item by product ID
    }


    async calculateTotalPrice(cart: Cart): Promise<number> {

        return cart.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }



    // ===========================================================================
    // Public API Functions
    // ===========================================================================


    async getCart(userId: number): Promise<Cart> {
        let cart = await this.findCartByUserId(userId);
        if (!cart) {
            cart = await this.createCartForUser(userId);
        }

        return cart;
    }    


    async addToCart(userId: number, dto: AddToCartDto): Promise<{ message: string }> {
        let cart = await this.findCartByUserId(userId);
        if (!cart) {
            cart = await this.createCartForUser(userId);
        }

        const product = await this.productsService.getProductById(dto.productId);

        let cartItem = await this.findCartItem(cart, product.id);

        if (cartItem) {
            cartItem.quantity += dto.quantity;
        } 
        else {
            cartItem = this.cartItemRepo.create({
                cart,
                product,
                quantity: dto.quantity,
                price: Number(product.price),
            });

            cart.cartItems.push(cartItem);
        }

        cart.totalPrice = await this.calculateTotalPrice(cart);
        await this.cartRepo.save(cart);

        return { message: 'Product added to cart successfully' };
    }


    async updateCartItem(userId: number, dto: UpdateCartItemDto): Promise<{ message: string }> {
        const cart = await this.findExistingCartByUserId(userId);

        const cartItem = await this.findExistingCartItemOfUser(userId, dto.cartItemId);

        cartItem.quantity = dto.quantity;
        await this.cartItemRepo.save(cartItem);

        cart.totalPrice = await this.calculateTotalPrice(cart);
        await this.cartRepo.save(cart);

        return { message: 'Cart item updated successfully' };
    }


    async removeCartItem(userId: number, cartItemId: number): Promise<{ message: string }> {
        const cart = await this.findExistingCartByUserId(userId);

        const cartItem = await this.findExistingCartItemOfUser(userId, cartItemId);

        await this.cartItemRepo.remove(cartItem);

        cart.cartItems = cart.cartItems.filter(item => item.id !== cartItemId);
        cart.totalPrice = await this.calculateTotalPrice(cart);
        await this.cartRepo.save(cart);

        return { message: 'Cart item removed successfully' };
    }


}
