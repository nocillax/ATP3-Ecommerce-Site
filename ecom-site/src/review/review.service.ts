/*
https://docs.nestjs.com/providers#services
*/

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './DTO/create-review.dto';
import { Review } from './review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/user/user.service';
import { ProductsService } from 'src/product/product.service';
import { UpdateReviewDto } from './DTO/update-review.dto';
import { Product } from 'src/product/product.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private readonly reviewRepo: Repository<Review>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>, // ✅ FIXED type
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

  async findReviewByUserAndProduct(
    userId: number,
    productId: number,
  ): Promise<Review | null> {
    return await this.reviewRepo.findOne({
      where: {
        user: { id: userId },
        product: { id: productId },
      },
      relations: ['user', 'product'],
    });
  }

  async updateProductAggregates(productId: number) {
    const reviews = await this.reviewRepo.find({
      where: { product: { id: productId } },
    });

    const avg = reviews.length
      ? reviews.reduce((s, r) => s + Number(r.rating), 0) / reviews.length
      : 0;

    await this.productRepo.update(productId, {
      rating: parseFloat(avg.toFixed(1)),
      reviewCount: reviews.length, // ✅ NEW aggregate
    });
  }

  // ===========================================================================
  //  Public API Functions
  // ===========================================================================

  /** ADD */
  async addReview(requestUser: any, dto: CreateReviewDto) {
    const user = await this.usersService.findUserById(requestUser.userId);
    const product = await this.productsService.getProductById(dto.productId);

    if (!user)
      throw new NotFoundException(`User #${requestUser.userId} not found`);
    if (!product)
      throw new NotFoundException(`Product #${dto.productId} not found`);

    /* one-review-per-user guard */
    if (await this.findReviewByUserAndProduct(user.id, product.id)) {
      throw new BadRequestException('You already reviewed this product');
    }

    const review = this.reviewRepo.create({
      rating: dto.rating,
      comment: dto.comment,
      user,
      product,
    });

    const result = await this.reviewRepo.save(review);
    await this.updateProductAggregates(product.id);
    return result;
  }

  async getFilteredReviews(params: {
    skip: number;
    take: number;
    sort: string;
    order: 'ASC' | 'DESC';
    userId?: number;
    productId?: number;
    minRating?: number;
  }): Promise<[Review[], number]> {
    const qb = this.reviewRepo
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.product', 'product')
      .skip(params.skip)
      .take(params.take)
      .orderBy(`review.${params.sort}`, params.order);

    if (params.userId) {
      qb.andWhere('review.userId = :userId', { userId: params.userId });
    }

    if (params.productId) {
      qb.andWhere('review.productId = :productId', {
        productId: params.productId,
      });
    }

    if (params.minRating) {
      qb.andWhere('review.rating >= :minRating', {
        minRating: params.minRating,
      });
    }

    const [reviews, total] = await qb.getManyAndCount();

    if (reviews.length === 0) {
      throw new NotFoundException('No reviews found matching the criteria');
    }

    return [reviews, total];
  }

  /** GET BY ID (admin only) */
  async getReviewById(id: number) {
    return this.findExistingReviewById(id);
  }

  /** UPDATE  */
  async updateReview(requestUser: any, id: number, dto: UpdateReviewDto) {
    const review = await this.findExistingReviewById(id);

    if (requestUser.role !== 'admin' && requestUser.userId !== review.user.id) {
      throw new ForbiddenException('Not allowed to update this review');
    }

    Object.assign(review, dto);
    await this.reviewRepo.save(review);
    await this.updateProductAggregates(review.product.id);
    return { message: `Review #${id} updated` };
  }

  /** DELETE */
  async deleteReview(requestUser: any, id: number) {
    const review = await this.findExistingReviewById(id);

    if (requestUser.role !== 'admin' && requestUser.userId !== review.user.id) {
      throw new ForbiddenException('Not allowed to delete this review');
    }

    await this.reviewRepo.remove(review);
    await this.updateProductAggregates(review.product.id);
    return { message: `Review #${id} deleted` };
  }
}
