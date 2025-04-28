import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './review.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { Review } from './review.entity';
import { ReviewsController } from './review.controller';
import { UsersModule } from 'src/user/user.module';
import { User } from 'src/user/user.entity';
import { Product } from 'src/product/product.entity';
import { ProductsModule } from 'src/product/product.module';

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
