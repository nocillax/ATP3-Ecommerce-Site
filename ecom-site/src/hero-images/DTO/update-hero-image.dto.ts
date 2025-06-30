import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateHeroImageDto } from 'src/hero-images/DTO/create-hero-image.dto';

export class UpdateHeroImageDto extends PartialType(CreateHeroImageDto) {
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
