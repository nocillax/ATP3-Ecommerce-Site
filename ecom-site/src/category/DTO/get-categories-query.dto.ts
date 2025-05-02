// src/category/dto/get-categories-query.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class GetCategoriesQueryDto {
  @IsOptional()
  @IsString()
  search?: string;
}
