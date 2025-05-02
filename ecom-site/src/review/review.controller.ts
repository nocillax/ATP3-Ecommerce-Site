/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { ReviewsService } from './review.service';
import { CreateReviewDto } from './DTO/create-review.dto';
import { Review } from './review.entity';
import { UpdateReviewDto } from './DTO/update-review.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { GetReviewsQueryDto } from './DTO/get-reviews-query.dto';

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

    
    @Get(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    getReviewById(@Param('id', ParseIntPipe) id: number): Promise<Review> {
        return this.reviewsService.getReviewById(id);
    }


    @Get()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    async getReviews(
    @Query(new ValidationPipe({ transform: true })) query: GetReviewsQueryDto,
    ): Promise<any> {

        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const sort = query.sort ?? 'createdAt';
        const order = query.order ?? 'DESC';
        const skip = (page - 1) * limit;

        const [data, total] = await this.reviewsService.getFilteredReviews({
            skip,
            take: limit,
            sort,
            order,
            userId: query.userId,
            productId: query.productId,
            minRating: query.minRating,
        });

        return {
            data,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        };
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