/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoriesController } from './category.controller';
import { CategoriesService } from './category.service';

@Module({
    imports: [TypeOrmModule.forFeature([Category])], // Add your entities here
    controllers: [CategoriesController],
    providers: [CategoriesService],
    exports: [CategoriesService], 
})
export class CategoriesModule { }
