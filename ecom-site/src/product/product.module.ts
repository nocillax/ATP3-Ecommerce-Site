/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './product.controller';
import { ProductsService } from './product.service';
import { Product } from './product.entity';
import { CategoriesModule } from 'src/category/category.module';

@Module({
    imports: [TypeOrmModule.forFeature([Product]), CategoriesModule],
    controllers: [ProductsController],
    providers: [ProductsService],
    exports: [ProductsService],
})
export class ProductsModule { }
