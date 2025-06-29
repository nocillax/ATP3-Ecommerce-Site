import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './brand.entity';
import { BrandService } from './brand.service';
import { BrandController } from 'src/brand/brand.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Brand])],
  providers: [BrandService],
  controllers: [BrandController],
  exports: [BrandService], // so ProductModule can inject it
})
export class BrandModule {}
