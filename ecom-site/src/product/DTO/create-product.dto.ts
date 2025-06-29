import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsBoolean,
  ValidateNested,
  IsInt,
  Min,
  IsNotEmpty,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  // ✅ FIX: Added the description field to match the form.
  @IsOptional()
  @IsString()
  description?: string;

  @IsInt() // ✅ FIX: Made this required as the form sends it.
  brandId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds: number[];

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  cost?: number;

  @IsOptional()
  @IsNumber()
  discountPercent?: number;

  @IsOptional()
  @IsBoolean()
  isOnSale?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  // These are for existing URLs, which a new product won't have. So they are optional.
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  // ✅ THIS DECORATOR IS CRITICAL
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  variants: CreateVariantDto[];
}

/* helper DTO */
class CreateVariantDto {
  @IsString()
  color: string;

  // ✅ FIX: Made optional, as a new variant won't have existing URLs.
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @IsInt()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsNumber()
  priceOverride?: number;
}
