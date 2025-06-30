/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './product.service';
import { CreateProductDto } from './DTO/create-product.dto';
import { UpdateProductDto } from './DTO/update-product.dto';
import { Product } from './product.entity';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';
import { GetProductsQueryDto } from './DTO/get-products-query.dto';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ParseJsonPipe } from 'src/pipes/parse-json.pipe';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'newImages', maxCount: 10 },
        { name: 'variantImages', maxCount: 20 }, // Allow many variant images
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            return cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
      },
    ),
  )
  addProduct(
    // ✅ The @UploadedFiles() decorator now receives an object with keys matching the fields
    @UploadedFiles()
    files: {
      newImages?: Express.Multer.File[];
      variantImages?: Express.Multer.File[];
    },
    @Body(
      'data',
      new ParseJsonPipe(),
      new ValidationPipe({
        /*...*/
      }),
    )
    dto: CreateProductDto,
  ) {
    // 1. Process main product images
    const productImages = files.newImages
      ? files.newImages.map((f) => `/uploads/${f.filename}`)
      : [];

    // 2. Process variant images
    const variantImages = files.variantImages
      ? files.variantImages.map((f) => `/uploads/${f.filename}`)
      : [];

    // 3. Add these URLs to the DTO before sending it to the service
    dto.imageUrls = productImages;
    dto.variants.forEach((variant, index) => {
      // This assumes the order of variants and variant images is the same
      if (variantImages[index]) {
        variant.imageUrls = [variantImages[index]]; // Assign one image URL to each variant
      }
    });

    return this.productsService.addProduct(dto);
  }

  @Get('bestsellers')
  findBestSellers() {
    return this.productsService.findBestSellers();
  }

  @Get()
  async getProducts(
    @Query(new ValidationPipe({ transform: true })) query: GetProductsQueryDto,
  ) {
    const SORT_FIELDS = {
      createdat: 'createdAt',
      price: 'price',
      name: 'name',
      rating: 'rating',
    };

    const page = query.page ?? 1;
    const limit = query.limit ?? 1000;
    const sort =
      SORT_FIELDS[query.sort?.toLowerCase() as keyof typeof SORT_FIELDS] ??
      'createdAt';
    const order = query.order ?? 'DESC';

    const [data, total] = await this.productsService.getPaginatedProducts({
      skip: (page - 1) * limit,
      take: limit,
      sort,
      order,
      ...query, // ✅ color / brand filters pass-thru
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
  deleteProduct(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.productsService.deleteProduct(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'newImages', maxCount: 10 },
        { name: 'variantImages', maxCount: 20 }, // Allow many variant images
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            return cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
      },
    ),
  )
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles()
    files: {
      newImages?: Express.Multer.File[];
      variantImages?: Express.Multer.File[];
    },
    @Body(
      'data',
      new ParseJsonPipe(),
      new ValidationPipe({
        /*...*/
      }),
    )
    dto: UpdateProductDto,
  ): Promise<Product> {
    // Get URLs of any newly uploaded main images
    const newProductImages =
      files.newImages?.map((f) => `/uploads/${f.filename}`) ?? [];

    // Combine existing images to keep with the new ones
    dto.imageUrls = [...(dto.imageUrls ?? []), ...newProductImages];

    // Get URLs of any newly uploaded variant images
    const newVariantImages =
      files.variantImages?.map((f) => `/uploads/${f.filename}`) ?? [];
    let imageCounter = 0;

    // Add the new image URLs to the correct variants in the DTO
    if (dto.variants) {
      for (const variant of dto.variants) {
        if (variant.newImageWasUploaded) {
          if (newVariantImages[imageCounter]) {
            // Replace old URL with the new one
            variant.imageUrls = [newVariantImages[imageCounter]];
            imageCounter++;
          }
        }
      }
    }

    return this.productsService.updateProduct(id, dto);
  }
}
