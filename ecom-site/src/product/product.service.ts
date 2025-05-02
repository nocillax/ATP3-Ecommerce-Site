/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './DTO/create-product.dto';
import { UpdateProductDto } from './DTO/update-product.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { CategoriesService } from 'src/category/category.service';
import { Category } from 'src/category/category.entity';


@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
        private readonly categoriesService: CategoriesService,

    ) {}

    
    // ===========================================================================
    //  Internal Functions 
    // ===========================================================================

    async findProductById(id: number): Promise<Product | null> {
        return await this.productRepo.findOne({
            where: { id },
            relations: ['categories', 'reviews', 'reviews.user'],   // load relations
        });
    }

    async findExistingProductById(id: number): Promise<Product> {
        const product = await this.productRepo.findOne({
            where: { id },
            relations: ['categories', 'reviews', 'reviews.user'],
        });

        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }

        return product;
    }   


    // ===========================================================================
    //  Public API Functions 
    // ===========================================================================


    async addProduct(dto: CreateProductDto): Promise<Product> {
        const categories = await this.categoriesService.getCategoriesByIds(dto.categoryIds);
        if(!categories || categories.length === 0){ // if categories is empty
            
            throw new NotFoundException('No categories found for the provided IDs');    
        }

        const product = this.productRepo.create({
            ...dto,
            categories: categories,
        });

        return await this.productRepo.save(product);
    }

    async getPaginatedProducts(params: {
        skip: number,
        take: number,
        sort: string,
        order: 'ASC' | 'DESC',
        search?: string,
        category?: string,
        minPrice?: number,
        maxPrice?: number,
        minRating?: number,
    }): Promise<[Product[], number]> {

        const qb = this.productRepo.createQueryBuilder('product')
        .leftJoinAndSelect('product.categories', 'category')
        .leftJoinAndSelect('product.reviews', 'review')
        .leftJoinAndSelect('review.user', 'user')
        .skip(params.skip)
        .take(params.take)
        .orderBy(`product.${params.sort}`, params.order);

        if (params.search) {
            qb.andWhere('product.name ILIKE :search', { search: `%${params.search}%` });
        }

        if (params.category) {
            qb.andWhere('LOWER(category.name) = LOWER(:categoryName)', {
                categoryName: params.category,
            });
        }

        if (params.minPrice) {
            qb.andWhere('product.price >= :minPrice', { minPrice: params.minPrice });
        }

        if (params.maxPrice) {
            qb.andWhere('product.price <= :maxPrice', { maxPrice: params.maxPrice });
        }

        if (params.minRating) {
            qb.andWhere('product.rating >= :minRating', { minRating: params.minRating });
        }

        const [products, total] = await qb.getManyAndCount();

        if (products.length === 0) {
            throw new NotFoundException('No products found');
        }

        return [products, total];

    }


/* 
        const [products, total] = await this.productRepo.findAndCount({
            skip,
            take,
            order: { [sort]: order },
            relations: ['categories', 'reviews', 'reviews.user'],
        });

        if (products.length === 0) {
            throw new NotFoundException('No products found');
        }
        
        return [products, total];
    } */

    async getProductById(id: number): Promise<Product> {
        const product = await this.findExistingProductById(id);

        return product;
    }

    async deleteProduct(id: number): Promise<{ message: string }> {
        const product = await this.findExistingProductById(id);

        await this.productRepo.remove(product); // Does remove the relation as well

        return { message: `Product with id ${id} deleted successfully` };

    }

    async updateProduct(id: number, dto: UpdateProductDto): Promise<{ message: string }> {
        const product = await this.getProductById(id);

        const { categoryIds, ...updateData } = dto; // Destructure to exclude categoryIds

        Object.assign(product, updateData);

        if (Array.isArray(categoryIds)) {   // Check if categoryIds is an array before checking length
            if (categoryIds.length === 0) { 

                product.categories = [];    // If empty, clear categories
            } 
            else {
                const categories = await this.categoriesService.getCategoriesByIds(categoryIds);  
                if (!categories.length) {
                    throw new NotFoundException('No categories found for the provided IDs');
                }

                product.categories = categories;
            }
        }

        await this.productRepo.save(product as Product);

        return { message: `Product with id ${id} updated successfully` };

    }

}
