import {
  IsOptional,
  IsInt,
  IsPositive,
  IsIn,
  IsString,
  IsNumber,
  Min,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GetProductsQueryDto {
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
  sort?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minRating?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isOnSale?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isFeatured?: boolean;
}
