// src/category/dto/get-categories-query.dto.ts
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class GetCategoriesQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isFeatured?: boolean;
}
