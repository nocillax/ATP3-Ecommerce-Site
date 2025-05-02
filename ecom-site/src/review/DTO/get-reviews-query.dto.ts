import { IsOptional, IsInt, IsPositive, IsIn, Min, Max, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class GetReviewsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit?: number;

  @IsOptional()
  @IsIn(['createdAt', 'rating'])
  sort?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  userId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  productId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'minRating must be a number between 0 and 5' })
  @Min(0)
  @Max(5)
  minRating?: number;
}
