/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './DTO/create-review.dto';
import { Review } from './review.entity';
import { UpdateReviewDto } from './DTO/update-review.dto';

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {} 

    @Post()
    addReview(@Body() dto: CreateReviewDto): Promise<Review> {
        return this.reviewsService.addReview(dto);
    }

    @Get()
    getReviews(): Promise<Review[]> {
        return this.reviewsService.getReviews();
    }

    @Get('product/:productId')
    getReviewsByProductId(@Param('productId', ParseIntPipe) productId: number): Promise<Review[]> {
        return this.reviewsService.getReviewsByProductId(productId);
    }

    @Get('user/:userId')
    getReviewsByUserId(@Param('userId', ParseIntPipe) userId: number): Promise<Review[]> {
        return this.reviewsService.getReviewsByUserId(userId);
    }
    
    @Get(':id')
    getReviewById(@Param('id', ParseIntPipe) id: number): Promise<Review> {
        return this.reviewsService.getReviewById(id);
    }

    @Delete(':id')
    deleteReview(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
        return this.reviewsService.deleteReview(id);
    }

    @Patch(':id')
    updateReview(
        @Param('id', ParseIntPipe) id: number, 
        @Body() dto: UpdateReviewDto
    ): Promise<{ message: string }> {
        return this.reviewsService.updateReview(id, dto);
    }



    




}