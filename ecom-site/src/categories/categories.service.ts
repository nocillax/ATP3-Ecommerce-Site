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
        return this.categoryRepo.save(dto);
    }

    getCategories(): Promise<Category[]> {
        return this.categoryRepo.find();
    }

    async getCategoryById(id: number): Promise<Category | null> {
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

    async updateCategory(id: number, data: UpdateCategoryDto): Promise<{message: string}> {
            await this.getCategoryById(id);
            await this.categoryRepo.update(id, data);
    
            return { message: `Category with id ${id} updated successfully` };   
        }




}
