/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { In, Repository } from 'typeorm';
import { CreateCategoryDto } from './DTO/create-category.dto';
import { UpdateCategoryDto } from './DTO/update-category.dto';

@Injectable()
export class CategoriesService { 
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,
    ) {}

    addCategory(dto: CreateCategoryDto): Promise<Category> {
        const category = this.categoryRepo.create(dto);
        return this.categoryRepo.save(category);
    }

    async getCategories(): Promise<Category[]> {
        const categories = await this.categoryRepo.find();

        if (categories.length === 0) {
            throw new NotFoundException('No categories found');
        }
        
        return categories;
    }

    async getCategoryById(id: number): Promise<Category> {
        const category = await this.categoryRepo.findOneBy({ id });

        if (!category) {
            throw new NotFoundException(`Category with id ${id} not found`);
        }

        return category;
    }

    async getCategoriesByIds(ids: number[]): Promise<Category[]> {
        return this.categoryRepo.find({ 
            where: { id: In(ids) }
        });
    }

    async deleteCategory(id: number): Promise<{ message: string }> {
        await this.getCategoryById(id);
        await this.categoryRepo.delete(id);

        return { message: `Category with id ${id} deleted successfully` };
    }

    async updateCategory(id: number, dto: UpdateCategoryDto): Promise<{message: string}> {
        const category = await this.getCategoryById(id);

        Object.assign(category, dto);
        await this.categoryRepo.save(category as Category); // Save the updated category


        return { message: `Category with id ${id} updated successfully` };   
    }




}
