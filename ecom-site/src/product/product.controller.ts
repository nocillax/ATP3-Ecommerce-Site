/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './product.service';
import { CreateProductDto } from './DTO/create-product.dto';
import { UpdateProductDto } from './DTO/update-product.dto';
import { Product } from './product.entity';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';
import { GetProductsQueryDto } from './DTO/get-products-query.dto';

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
        @Query(new ValidationPipe({ transform: true })) query: GetProductsQueryDto,
    ){  
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const sort = query.sort ?? 'createdAt';
        const order = query.order ?? 'DESC';

        const skip = (page - 1) * limit;

        const [data, total] = await this.productsService.getPaginatedProducts({
            skip, 
            take: limit, 
            sort, 
            order,
            search: query.search,
            category: query.category,
            minPrice: query.minPrice,
            maxPrice: query.maxPrice,
            minRating: query.minRating,    
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
