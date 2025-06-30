import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeroImagesController } from 'src/hero-images/hero-image.controller';
import { HeroImagesService } from 'src/hero-images/hero-image.service';
import { HeroImage } from 'src/hero-images/hero-images.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HeroImage])],
  controllers: [HeroImagesController],
  providers: [HeroImagesService],
})
export class HeroImagesModule {}
