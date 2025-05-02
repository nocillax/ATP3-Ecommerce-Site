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

    // ===========================================================================
    //  Internal Functions
    // ===========================================================================

    async findCategoryById(id: number): Promise<Category | null> {
        return await this.categoryRepo.findOneBy({ id });
    }

    async findExistingCategoryById(id: number): Promise<Category> {
        const category = await this.categoryRepo.findOneBy({ id });
        if (!category) {
            throw new NotFoundException(`Category with id ${id} not found`);
        }

        return category;
    }

    async getCategoriesByIds(ids: number[]): Promise<Category[]> {
        return await this.categoryRepo.find({
            where: { id: In(ids) },
        });
    }


    // ===========================================================================
    //  Public API Functions
    // ===========================================================================


    async addCategory(dto: CreateCategoryDto): Promise<Category> {
        const category = this.categoryRepo.create(dto);
        return await this.categoryRepo.save(category);
    }

    async getCategories(search?: string): Promise<Category[]> {
        const qb = this.categoryRepo.createQueryBuilder('category');

        if (search) {
            qb.where('LOWER(category.name) LIKE :search', {
            search: `%${search.toLowerCase()}%`,
            });
        }

        const categories = await qb.getMany();

        if (categories.length === 0) {
            throw new NotFoundException('No categories found');
        }

        return categories;
    }


    async getCategoryById(id: number): Promise<Category> {
        const category = await this.findExistingCategoryById(id);

        return category;
    }


    async deleteCategory(id: number): Promise<{ message: string }> {
        await this.findExistingCategoryById(id);
        await this.categoryRepo.delete(id);

        return { message: `Category with id ${id} deleted successfully` };
    }

    async updateCategory(id: number, dto: UpdateCategoryDto): Promise<{message: string}> {
        const category = await this.findExistingCategoryById(id);

        Object.assign(category, dto);
        await this.categoryRepo.save(category as Category);

        return { message: `Category with id ${id} updated successfully` };   
    }


}
