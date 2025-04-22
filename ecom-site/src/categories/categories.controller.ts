/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Delete, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Body, Post } from '@nestjs/common';
import { CreateCategoryDto } from './DTO/create-category.dto';
import { Category } from './category.entity';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Post()
    addCategory(@Body() dto: CreateCategoryDto): Promise<Category> {
        return this.categoriesService.addCategory(dto);
    }

    @Get()
    getCategories(): Promise<Category[]> {
        return this.categoriesService.getCategories();
    }

    @Get(':id')
    getCategoryById(@Param('id', ParseIntPipe) id: number): Promise<Category | null> {
        return this.categoriesService.getCategoryById(id);
    }

    @Delete(':id')
    deleteCategory(@Param('id', ParseIntPipe) id: number): Promise<{message: string}> {
        return this.categoriesService.deleteCategory(id);
    }

    @Patch(':id')
    updateCategory(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: CreateCategoryDto
    ): Promise<{message: string}> {
        return this.categoriesService.updateCategory(id, dto);
    }

}

