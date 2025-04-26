/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './DTO/create-product.dto';
import { UpdateProductDto } from './DTO/update-product.dto';
import { Product } from './product.entity';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Post()
    addProduct(@Body() dto: CreateProductDto): Promise<Product> {
        return this.productsService.addProduct(dto);
    }

    @Get()
    getProducts(): Promise<Product[]> {
        return this.productsService.getProducts();
    }

    @Get(':id')
    getProductById(@Param('id', ParseIntPipe) id: number): Promise<Product> {
        return this.productsService.getProductById(id);
    }

    @Delete(':id')
    deleteProduct(@Param('id', ParseIntPipe) id: number): Promise<{message: string}> {
        return this.productsService.deleteProduct(id);
    }

    @Patch(':id')
    updateProduct(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateProductDto
    ): Promise<{message: string}> {
        return this.productsService.updateProduct(id, dto);
    }








}
