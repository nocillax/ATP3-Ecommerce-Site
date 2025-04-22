/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
    imports: [TypeOrmModule.forFeature([Category])], // Add your entities here
    controllers: [CategoriesController],
    providers: [CategoriesService],
    exports: [CategoriesService], 
})
export class CategoriesModule { }
