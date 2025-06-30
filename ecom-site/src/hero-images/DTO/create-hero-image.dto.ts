// FILE: src/hero-images/dto/create-hero-image.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsBoolean,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateHeroImageDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  linkUrl: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}
