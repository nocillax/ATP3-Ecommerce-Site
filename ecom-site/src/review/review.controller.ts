/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ReviewsService } from './review.service';
import { CreateReviewDto } from './DTO/create-review.dto';
import { Review } from './review.entity';
import { UpdateReviewDto } from './DTO/update-review.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {} 

    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('customer')
    addReview(
        @Body() dto: CreateReviewDto,
        @Request() req: any
    ): Promise<Review> {
        return this.reviewsService.addReview(req.user, dto);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    getReviews(): Promise<Review[]> {
        return this.reviewsService.getReviews();
    }

    // Allow all
    @Get('product/:productId')
    getReviewsByProductId(@Param('productId', ParseIntPipe) productId: number): Promise<Review[]> {
        return this.reviewsService.getReviewsByProductId(productId);
    }

    
    @Get('user/:userId')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin', 'customer')
    getReviewsByUserId(
        @Param('userId', ParseIntPipe) userId: number,
        @Request() req: any
    ): Promise<Review[]> {
        return this.reviewsService.getReviewsByUserId(req.user, userId);
    }
    
    @Get(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    getReviewById(@Param('id', ParseIntPipe) id: number): Promise<Review> {
        return this.reviewsService.getReviewById(id);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin', 'customer')
    deleteReview(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: any
    ): Promise<{ message: string }> {
        return this.reviewsService.deleteReview(req.user, id);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin', 'customer')
    updateReview(
        @Param('id', ParseIntPipe) id: number, 
        @Body() dto: UpdateReviewDto,
        @Request() req: any
    ): Promise<{ message: string }> {
        return this.reviewsService.updateReview(req.user, id, dto);
    }



    




}