/*
https://docs.nestjs.com/providers#services
*/

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './DTO/create-review.dto';
import { Review } from './review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/user/user.service';
import { ProductsService } from 'src/product/product.service';
import { UpdateReviewDto } from './DTO/update-review.dto';

@Injectable()
export class ReviewsService { 
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepo: Repository<Review>,
        private readonly usersService: UsersService,
        private readonly productsService: ProductsService,
    ) {}


    // ===========================================================================
    //  Internal Functions 
    // ===========================================================================


    async findReviewById(id: number): Promise<Review | null> {
        return await this.reviewRepo.findOne({
            where: { id },
            relations: ['user', 'product'],
        });
    }

    async findReviewsByProductId(productId: number): Promise<Review[]> {
        return await this.reviewRepo.find({
            where: { product: { id: productId } },
            relations: ['user', 'product'],
        });
    }

    async findReviewsByUserId(userId: number): Promise<Review[]> {
        return await this.reviewRepo.find({
            where: { user: { id: userId } },
            relations: ['user', 'product'],
        });
    }

    async findExistingReviewById(id: number): Promise<Review> {
        const review = await this.reviewRepo.findOne({
            where: { id },
            relations: ['user', 'product'],
        });

        if (!review) {
            throw new NotFoundException(`Review with ID ${id} not found`);
        }

        return review;
    }   


    // ===========================================================================
    //  Public API Functions 
    // ===========================================================================


    async addReview(requestUser: any, dto: CreateReviewDto): Promise<Review> {
        const user = await this.usersService.findUserById(requestUser.id);
        console.log(user);
        if (!user) {
            throw new NotFoundException(`User with id ${requestUser.id} not found`);
        }
        
        const product = await this.productsService.getProductById(dto.productId);

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

    async getReviewById(id: number): Promise<Review> {
        const review = await this.findExistingReviewById(id);

        return review;
    }

    async getReviewsByProductId(productId: number): Promise<Review[]> {
        const reviews = await this.findReviewsByProductId(productId);
        if (reviews.length === 0) {
            throw new NotFoundException(`No reviews found for product with id ${productId}`);
        }

        return reviews;
    }

    async getReviewsByUserId(requestUser: any, userId: number): Promise<Review[]> {
        if(requestUser.role !== 'admin' && requestUser.userId !== userId) {
            throw new ForbiddenException('You are not allowed to view this review');
        }
        
        const reviews = await this.findReviewsByUserId(userId);
        if (reviews.length === 0) {
            throw new NotFoundException(`No reviews found for user with id ${userId}`);
        }

        return reviews;
    }

    async updateReview(requestUser: any, id: number, dto: UpdateReviewDto): Promise<{ message: string }> {
        const review = await this.findExistingReviewById(id);

        if (requestUser.role !== 'admin' && requestUser.userId !== review.user.id) {
            throw new ForbiddenException('You are not allowed to update this review');
        }

        Object.assign(review, dto);

        await this.reviewRepo.save(review as Review);

        return { message: `Review with ID ${id} updated successfully` };
    }

    async deleteReview(requestUser: any, id: number): Promise<{ message: string }> {
        const review = await this.findExistingReviewById(id);

        if (requestUser.role !== 'admin' && requestUser.userId !== review.user.id) {
            throw new ForbiddenException('You are not allowed to delete this review');
        }

        await this.reviewRepo.remove(review);
        
        return { message: `Review with ID ${id} deleted successfully` };
    }

    







}
