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
import { ProductVariant } from 'src/product/product-variant.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,

    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,

    @InjectRepository(ProductVariant) // NEW
    private readonly variantRepo: Repository<ProductVariant>,

    private readonly usersService: UsersService,
  ) {}

  /* ───────────────────────────────────────────────────────── Internal ───── */

  async createCartForUser(userId: number): Promise<Cart> {
    const user = await this.usersService.findExistingUserById(userId);
    return this.cartRepo.save(
      this.cartRepo.create({ user, cartItems: [], totalPrice: 0 }),
    );
  }

  async findCartByUserId(userId: number): Promise<Cart | null> {
    return this.cartRepo.findOne({
      where: { user: { id: userId } },
      relations: [
        'user',
        'cartItems',
        'cartItems.productVariant',
        'cartItems.productVariant.product',
      ],
    });
  }

  async findExistingCartByUserId(userId: number): Promise<Cart> {
    const cart = await this.findCartByUserId(userId);
    if (!cart) throw new NotFoundException('Cart not found');
    return cart;
  }

  async findExistingCartItemOfUser(userId: number, cartItemId: number) {
    const cartItem = await this.cartItemRepo.findOne({
      where: { id: cartItemId },
      relations: [
        'cart',
        'cart.user',
        'productVariant',
        'productVariant.product',
      ],
    });
    if (!cartItem || cartItem.cart.user.id !== userId)
      throw new NotFoundException('Cart item not found or unauthorized');
    return cartItem;
  }

  /* helper: locate item by variant */
  findCartItem(cart: Cart, variantId: number) {
    return cart.cartItems.find((ci) => ci.productVariant.id === variantId);
  }

  calcCartTotal(cart: Cart) {
    return cart.cartItems.reduce((sum, i) => sum + Number(i.price), 0);
  }

  private mapCartItem(item: CartItem) {
    const unitPrice = item.price / item.quantity;
    const originalUnitPrice =
      item.productVariant.priceOverride ?? item.productVariant.product.price;

    return {
      id: item.id,
      quantity: item.quantity,
      price: item.price, // This is the total line price (unitPrice * quantity)
      unitPrice: unitPrice,
      originalUnitPrice: parseFloat(String(originalUnitPrice)),
      productVariant: item.productVariant,
    };
  }

  /* ───────────────────────────────────────────────────────── Public API ─── */

  async getCart(userId: number) {
    const cart =
      (await this.findCartByUserId(userId)) ??
      (await this.createCartForUser(userId));

    const detailedCartItems = cart.cartItems.map(this.mapCartItem);

    return {
      ...cart,
      cartItems: detailedCartItems,
    };
  }

  async addToCart(userId: number, dto: AddToCartDto) {
    let cart = await this.findCartByUserId(userId);
    if (!cart) cart = await this.createCartForUser(userId);

    const variant = await this.variantRepo.findOne({
      where: { id: dto.productVariantId },
      relations: ['product'],
    });
    if (!variant) throw new NotFoundException('Variant not found');

    /* pick effective unit price */
    const base = variant.priceOverride ?? variant.product.price;
    const discounted = variant.product.isOnSale
      ? base * (1 - variant.product.discountPercent / 100)
      : base;
    const unitPrice = Math.round(discounted * 100) / 100;

    /* try merge */
    let item = this.findCartItem(cart, variant.id);
    if (item) {
      item.quantity += dto.quantity;
      item.price = unitPrice * item.quantity; // line price
      await this.cartItemRepo.save(item);
    } else {
      item = this.cartItemRepo.create({
        cart,
        productVariant: variant,
        quantity: dto.quantity,
        price: unitPrice * dto.quantity,
      });
      await this.cartItemRepo.save(item);
    }

    /* refresh + recalc */
    cart.cartItems = await this.cartItemRepo.find({
      where: { cart: { id: cart.id } },
      relations: ['productVariant', 'productVariant.product'],
    });
    cart.totalPrice = this.calcCartTotal(cart);
    await this.cartRepo.save(cart);

    return { message: 'Product added to cart' };
  }

  async updateCartItem(userId: number, dto: UpdateCartItemDto) {
    const cart = await this.findExistingCartByUserId(userId);
    const item = await this.findExistingCartItemOfUser(userId, dto.cartItemId);

    const base =
      item.productVariant.priceOverride ?? item.productVariant.product.price;
    const disc = item.productVariant.product.isOnSale
      ? base * (1 - item.productVariant.product.discountPercent / 100)
      : base;
    const unit = Math.round(disc * 100) / 100;

    item.quantity = dto.quantity;
    item.price = unit * dto.quantity;
    await this.cartItemRepo.save(item);

    cart.cartItems = await this.cartItemRepo.find({
      where: { cart: { id: cart.id } },
      relations: ['productVariant', 'productVariant.product'],
    });
    cart.totalPrice = this.calcCartTotal(cart);
    await this.cartRepo.save(cart);

    return { message: 'Cart item updated' };
  }

  async removeCartItem(userId: number, cartItemId: number) {
    const cart = await this.findExistingCartByUserId(userId);
    const item = await this.findExistingCartItemOfUser(userId, cartItemId);

    await this.cartItemRepo.remove(item);

    cart.cartItems = await this.cartItemRepo.find({
      where: { cart: { id: cart.id } },
      relations: ['productVariant', 'productVariant.product'],
    });
    cart.totalPrice = this.calcCartTotal(cart);
    await this.cartRepo.save(cart);

    return { message: 'Cart item removed' };
  }

  async clearCart(userId: number) {
    const cart = await this.findExistingCartByUserId(userId);
    await this.cartItemRepo.delete({ cart: { id: cart.id } });

    cart.cartItems = [];
    cart.totalPrice = 0;
    await this.cartRepo.save(cart);

    return { message: 'Cart cleared' };
  }
}
