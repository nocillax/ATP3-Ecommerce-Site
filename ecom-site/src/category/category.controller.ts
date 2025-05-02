/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Delete, Get, Param, ParseIntPipe, Patch, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { CategoriesService } from './category.service';
import { Body, Post } from '@nestjs/common';
import { CreateCategoryDto } from './DTO/create-category.dto';
import { Category } from './category.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { GetCategoriesQueryDto } from './DTO/get-categories-query.dto';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}


    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    addCategory(@Body() dto: CreateCategoryDto): Promise<Category> {
        return this.categoriesService.addCategory(dto);
    }

    // Allow all
    @Get()
    async getCategories(
        @Query(new ValidationPipe({ transform: true })) query: GetCategoriesQueryDto,
    ): Promise<Category[]> {
        
        return this.categoriesService.getCategories(query.search);
    }


    // Allow all
    @Get(':id')
    getCategoryById(@Param('id', ParseIntPipe) id: number): Promise<Category> {
        return this.categoriesService.getCategoryById(id);
    }


    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    deleteCategory(@Param('id', ParseIntPipe) id: number): Promise<{message: string}> {
        return this.categoriesService.deleteCategory(id);
    }


    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    updateCategory(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: CreateCategoryDto
    ): Promise<{message: string}> {
        return this.categoriesService.updateCategory(id, dto);
    }

}

