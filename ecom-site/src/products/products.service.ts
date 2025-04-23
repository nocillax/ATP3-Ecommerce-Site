/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './DTO/create-product.dto';
import { UpdateProductDto } from './DTO/update-product.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/category.entity';


@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
        private readonly categoriesService: CategoriesService,

    ) {}

    async addProduct(dto: CreateProductDto): Promise<Product> {
        const categories = await this.categoriesService.getCategoriesByIds(dto.categoryIds);

        if(!categories.length){ // if categories is empty
            
            throw new NotFoundException('No categories found for the provided IDs');    
        }

        const product = this.productRepo.create({
            name: dto.name,
            price: dto.price,
            quantity: dto.quantity,
            rating: dto.rating,
            categories: categories,
        });

        return await this.productRepo.save(product);
    }

    async getProducts(): Promise<Product[]> {

        const products = await this.productRepo.find();

        if (products.length === 0) {
            throw new NotFoundException('No products found');
        }
        
        return products;
    }

    async getProductById(id: number): Promise<Product | null> {
        const product = await this.productRepo.findOne({ where: { id } });
        
        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }

        return product;
    }

    async deleteProduct(id: number): Promise<{ message: string }> {
        const product = await this.productRepo.findOne({ 
            where: { id },
            relations: ['categories'] 
        });

        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }

        product.categories = []; // Clear relations
        await this.productRepo.save(product); // Save the product with cleared relations
        
        await this.productRepo.delete(id); // Delete the product    

        return { message: `Product with id ${id} deleted successfully` };

    }


    async updateProduct(id: number, updateData: UpdateProductDto): Promise<{ message: string }> {
        const product = await this.productRepo.findOne({ 
            where: { id },
            relations: ['categories'] 
        });

        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }

        // Update Product data if data is provided
        if(updateData.name !== undefined) {
            product.name = updateData.name;
        }
        if(updateData.price !== undefined) {
            product.price = updateData.price;
        }
        if(updateData.quantity !== undefined) {
            product.quantity = updateData.quantity;
        }
        if(updateData.rating !== undefined) {
            product.rating = updateData.rating;
        }
        if(updateData.categoryIds !== undefined) {
            const categories = await this.categoriesService.getCategoriesByIds(updateData.categoryIds);
            
            if (!categories.length) {
                throw new NotFoundException('No categories found for the provided IDs');
            }
            
            product.categories = categories;
        }

        await this.productRepo.save(product);
        return { message: `Product with id ${id} updated successfully` };

    }




}
