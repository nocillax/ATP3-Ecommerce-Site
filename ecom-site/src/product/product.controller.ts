/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './product.service';
import { CreateProductDto } from './DTO/create-product.dto';
import { UpdateProductDto } from './DTO/update-product.dto';
import { Product } from './product.entity';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}


    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    addProduct(@Body() dto: CreateProductDto): Promise<Product> {
        return this.productsService.addProduct(dto);
    }


    @Get()
    async getProducts(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('sort') sort = 'createdAt',
        @Query('order') order: 'ASC' | 'DESC' = 'DESC',
        @Query('search') search?: string,
        @Query('category') category?: string,
        @Query('minPrice') minPrice?: number,
        @Query('maxPrice') maxPrice?: number,
        @Query('minRating') minRating?: number,
    ){
        const skip = (page - 1) * limit;
        const [data, total] = await this.productsService.getPaginatedProducts({
            skip, 
            take: limit, 
            sort, 
            order,
            search,
            category,
            minPrice,
            maxPrice,
            minRating,    
        });

        return { 
            data, 
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        };
    }


    @Get(':id')
    getProductById(@Param('id', ParseIntPipe) id: number): Promise<Product> {
        return this.productsService.getProductById(id);
    }


    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    deleteProduct(@Param('id', ParseIntPipe) id: number): Promise<{message: string}> {
        return this.productsService.deleteProduct(id);
    }
    

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    updateProduct(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateProductDto
    ): Promise<{message: string}> {
        return this.productsService.updateProduct(id, dto);
    }








}
