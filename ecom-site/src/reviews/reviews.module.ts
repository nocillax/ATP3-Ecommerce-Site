import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './reviews.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { Review } from './review.entity';
import { ReviewsController } from './reviews.controller';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/user.entity';
import { Product } from 'src/products/product.entity';
import { ProductsModule } from 'src/products/products.module';

@Module({
    imports: [
    TypeOrmModule.forFeature([Review, User, Product]),
    UsersModule,
    ProductsModule
],
    controllers: [ReviewsController],
    providers: [ReviewsService,],
})
export class ReviewsModule { }
