import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;

  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds: number[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @IsOptional()
  @IsBoolean()
  isOnSale?: boolean;
  @IsOptional()
  @IsNumber()
  discountPercent?: number;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}
