/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './DTO/create-review.dto';
import { Review } from './review.entity';

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


}