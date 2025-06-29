import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// 1. We define a DTO specifically for variants being sent during an update.
//    It's almost identical to CreateVariantDto but includes an optional `id`.
class UpdateVariantDto {
  @IsOptional()
  @IsInt()
  id?: number; // ✅ This is the missing piece

  @IsString()
  color: string;

  @IsInt()
  stock: number;

  @IsOptional()
  @IsNumber()
  priceOverride?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @IsOptional()
  @IsBoolean()
  newImageWasUploaded?: boolean;
}

// 2. We create the main UpdateProductDto.
//    It inherits most optional fields from CreateProductDto...
export class UpdateProductDto extends PartialType(CreateProductDto) {
  // ...but we explicitly OVERRIDE the 'variants' property to use our new UpdateVariantDto.
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateVariantDto)
  variants?: UpdateVariantDto[];
}
