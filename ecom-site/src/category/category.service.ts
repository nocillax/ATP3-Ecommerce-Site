/*
https://docs.nestjs.com/providers#services
*/

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { In, Repository } from 'typeorm';
import { CreateCategoryDto } from './DTO/create-category.dto';
import { UpdateCategoryDto } from './DTO/update-category.dto';
import { GetCategoriesQueryDto } from './DTO/get-categories-query.dto';

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

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^a-z0-9\-]/g, ''); // Remove all non-alphanumeric chars except -
  }

  // ===========================================================================
  //  Public API Functions
  // ===========================================================================

  async addCategory(dto: CreateCategoryDto): Promise<Category> {
    // ✅ 1. Check if a category with this name already exists
    const existingCategory = await this.categoryRepo.findOne({
      where: { name: dto.name },
    });

    // ✅ 2. If it exists, throw a specific error
    if (existingCategory) {
      throw new ConflictException(
        `A category with the name "${dto.name}" already exists.`,
      );
    }

    // 3. If it doesn't exist, proceed as normal
    const slug = this.slugify(dto.name);

    const newCategory = this.categoryRepo.create({
      ...dto,
      slug: slug,
    });

    return this.categoryRepo.save(newCategory);
  }

  async getCategories(query: GetCategoriesQueryDto): Promise<Category[]> {
    const qb = this.categoryRepo.createQueryBuilder('category');

    if (query.search) {
      qb.where('LOWER(category.name) LIKE :search', {
        search: `%${query.search.toLowerCase()}%`,
      });
    }

    if (typeof query.isFeatured === 'boolean') {
      qb.andWhere('category.isFeatured = :isFeatured', {
        isFeatured: query.isFeatured,
      });
    }

    if (query.page && query.limit) {
      const skip = (query.page - 1) * query.limit;
      qb.skip(skip).take(query.limit);
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

  async updateCategory(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findExistingCategoryById(id);

    Object.assign(category, dto);
    return this.categoryRepo.save(category);
  }
}
