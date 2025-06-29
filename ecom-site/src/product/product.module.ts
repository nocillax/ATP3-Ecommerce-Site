/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './product.controller';
import { ProductsService } from './product.service';
import { Product } from './product.entity';
import { CategoriesModule } from 'src/category/category.module';
import { ProductVariant } from 'src/product/product-variant.entity';
import { BrandModule } from 'src/brand/brand.module';
import { Brand } from 'src/brand/brand.entity';
import { Category } from 'src/category/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductVariant, Brand, Category]),
    CategoriesModule,
    BrandModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
