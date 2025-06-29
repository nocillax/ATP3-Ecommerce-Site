import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { ProductsModule } from 'src/product/product.module';
import { UsersModule } from 'src/user/user.module';
import { CartController } from './cart.controller';
import { ProductVariant } from 'src/product/product-variant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem, ProductVariant]),
    ProductsModule,
    UsersModule,
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
