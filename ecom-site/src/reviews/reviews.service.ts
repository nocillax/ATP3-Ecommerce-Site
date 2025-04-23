/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './DTO/create-review.dto';
import { Review } from './review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class ReviewsService { 
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepo: Repository<Review>,
        private readonly usersService: UsersService,
        private readonly productsService: ProductsService,
    ) {}

    async addReview(dto: CreateReviewDto): Promise<Review> {

        const user = await this.usersService.getUserById(dto.userId);
        const product = await this.productsService.getProductById(dto.productId);
            

        if (!user) {
            throw new NotFoundException(`User with id ${dto.userId} not found`);
        }
        if (!product) {
            throw new NotFoundException(`Product with id ${dto.productId} not found`);
        }

        const review = this.reviewRepo.create({
            rating: dto.rating,
            comment: dto.comment,
            user: user,
            product: product,
        });

        return await this.reviewRepo.save(review);
    }

    async getReviews(): Promise<Review[]> {
        const reviews = await this.reviewRepo.find();

        if( reviews.length === 0) {
            throw new NotFoundException('No reviews found');
        }

        return reviews;
    }

}
