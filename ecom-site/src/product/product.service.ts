/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './DTO/create-product.dto';
import { UpdateProductDto } from './DTO/update-product.dto';
import { Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { CategoriesService } from 'src/category/category.service';
import { Category } from 'src/category/category.entity';
import { ProductVariant } from 'src/product/product-variant.entity';
import { BrandService } from 'src/brand/brand.service';
import { Brand } from 'src/brand/brand.entity';
import { join } from 'path';
import { promises as fs } from 'fs';
import { DataSource } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductVariant) // NEW
    private readonly variantRepo: Repository<ProductVariant>,
    @InjectRepository(Brand) // NEW
    private readonly brandRepo: Repository<Brand>, // NEW
    @InjectRepository(Category) // NEW
    private readonly categoryRepo: Repository<Category>, // NEW
    private readonly categoriesService: CategoriesService,
    private readonly brandService: BrandService, // NEW
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  // ===========================================================================
  //  Internal Functions
  // ===========================================================================

  async findProductById(id: number): Promise<Product | null> {
    return await this.productRepo.findOne({
      where: { id },
      relations: ['categories', 'reviews', 'reviews.user'], // load relations
    });
  }

  async findExistingProductById(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['categories', 'reviews', 'reviews.user', 'variants'], // CHANGED
    });
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: {
        brand: true,
        categories: true,
        variants: true,
        reviews: {
          user: true, // Also load the user for each review
        },
      },
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  // ===========================================================================
  //  Public API Functions
  // ===========================================================================

  async addProduct(dto: CreateProductDto): Promise<Product> {
    const { brandId, categoryIds, variants, ...productData } = dto;

    const brand = await this.brandRepo.findOneBy({ id: brandId });
    if (!brand)
      throw new NotFoundException(`Brand with ID ${brandId} not found`);

    const categories = await this.categoryRepo.findByIds(categoryIds);
    if (categories.length !== categoryIds.length) {
      throw new NotFoundException('One or more categories not found');
    }

    // The 'productData' and 'variants' in the DTO now contain the correct imageUrls
    // that were added in the controller.
    const productToCreate = {
      ...productData,
      brand,
      categories,
      variants: variants.map((v) => this.variantRepo.create(v)),
    };

    const newProduct = this.productRepo.create(productToCreate);
    return this.productRepo.save(newProduct);
  }

  async getPaginatedProducts(params: {
    skip: number;
    take: number;
    sort: string;
    order: 'ASC' | 'DESC';
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    isOnSale?: boolean;
    isFeatured?: boolean;
    color?: string; // ✅ new
  }): Promise<[Product[], number]> {
    /* 1️⃣ allow-list real columns */
    const ALLOWED_SORT: Record<string, string> = {
      name: 'product.name',
      price: 'product.price',
      rating: 'product.rating',
      createdat: 'product.createdAt',
      createdAt: 'product.createdAt',
      updatedat: 'product.updatedAt',
      updatedAt: 'product.updatedAt',
    };

    const sortKey = params.sort ?? 'createdAt';
    const sortField =
      ALLOWED_SORT[sortKey.toLowerCase()] ?? 'product.createdAt';

    /* 2️⃣ build query */
    const qb = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.categories', 'category')
      .leftJoinAndSelect('product.variants', 'variant') // ✅ join variants for color
      .leftJoinAndSelect('product.reviews', 'review')
      .leftJoinAndSelect('review.user', 'user')
      .skip(params.skip)
      .take(params.take)
      .orderBy(sortField, params.order);

    /* 3️⃣ filters */
    if (params.search) {
      qb.andWhere('product.name ILIKE :search', {
        search: `%${params.search}%`,
      });
    }
    if (params.category) {
      qb.andWhere('LOWER(category.name) = LOWER(:categoryName)', {
        categoryName: params.category,
      });
    }
    if (params.color) {
      qb.andWhere('LOWER(variant.color) = LOWER(:color)', {
        color: params.color,
      });
    }
    if (params.minPrice)
      qb.andWhere('product.price >= :minPrice', { minPrice: params.minPrice });
    if (params.maxPrice)
      qb.andWhere('product.price <= :maxPrice', { maxPrice: params.maxPrice });
    if (params.minRating)
      qb.andWhere('product.rating >= :minRating', {
        minRating: params.minRating,
      });
    if (typeof params.isOnSale === 'boolean')
      qb.andWhere('product.isOnSale = :isOnSale', {
        isOnSale: params.isOnSale,
      });
    if (typeof params.isFeatured === 'boolean')
      qb.andWhere('product.isFeatured = :isFeatured', {
        isFeatured: params.isFeatured,
      });

    /* 4️⃣ execute */
    const [products, total] = await qb.getManyAndCount();
    if (!products.length) throw new NotFoundException('No products found');

    // =================================================================
    // ✅ START: THE NEW CODE YOU ARE ADDING
    // =================================================================
    const transformedProducts = products.map((product) => {
      // 1. Fix numeric fields on the main product
      if (product.price) product.price = parseFloat(product.price as any);
      if (product.cost) product.cost = parseFloat(product.cost as any);
      if (product.rating) product.rating = parseFloat(product.rating as any);
      if (product.discountPercent)
        product.discountPercent = parseFloat(product.discountPercent as any);

      // 2. Fix the main imageUrls array
      if (product.imageUrls && product.imageUrls.length > 0) {
        // Takes the string "{url1,url2}", removes {}, and splits it into an array
        product.imageUrls = product.imageUrls[0]
          .replace(/[{}]/g, '')
          .split(',');
      }

      // 3. Fix the imageUrls within each variant
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach((variant) => {
          if (variant.imageUrls && variant.imageUrls.length > 0) {
            variant.imageUrls = variant.imageUrls[0]
              .replace(/[{}]/g, '')
              .split(',');
          }
        });
      }

      return product;
    });
    // =================================================================
    // ✅ END: THE NEW CODE YOU ARE ADDING
    // =================================================================

    // 5️⃣ return the FIXED data
    return [transformedProducts, total]; // <-- Make sure to return the new variable
  }

  async getProductById(id: number): Promise<Product> {
    const product = await this.findExistingProductById(id);

    return product;
  }

  async deleteProduct(id: number): Promise<{ message: string }> {
    const product = await this.findExistingProductById(id);

    await this.productRepo.remove(product); // Does remove the relation as well

    return { message: `Product with id ${id} deleted successfully` };
  }

  /* async updateProduct(
    id: number,
    dto: UpdateProductDto,
    newProductImages: string[],
    newVariantImages: string[],
  ): Promise<Product> {
    const { categoryIds, brandId, variants, imageUrls, ...rest } = dto;

    // 1. Find the product and its current relations
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['variants', 'categories'], // Load existing variants and categories
    });
    if (!product)
      throw new NotFoundException(`Product with ID ${id} not found`);

    // 2. IMAGE DELETION: Find which old images were removed in the UI
    const oldImageUrls = product.imageUrls ?? [];
    const keptImageUrls = imageUrls ?? [];
    const imagesToDelete = oldImageUrls.filter(
      (url) => !keptImageUrls.includes(url),
    );

    // Asynchronously delete the files from the server
    for (const url of imagesToDelete) {
      const path = join(__dirname, '..', '..', url); // Build path from project root
      try {
        await fs.unlink(path);
      } catch (err) {
        console.error(`Failed to delete old image file: ${path}`, err);
      }
    }

    // 3. VARIANT REPLACEMENT: Delete all old variants associated with this product
    await this.variantRepo.remove(product.variants);

    // 4. PREPARE NEW DATA
    // Combine kept old images with new uploaded images
    const finalImageUrls = [...keptImageUrls, ...newProductImages];

    // Create new variant entities from the DTO data.
    // We'll assign the new variant images to them.
    let variantImageCounter = 0;
    const newVariantEntities = (variants ?? []).map((v_dto) => {
      const newVariant = this.variantRepo.create(v_dto);
      // If there are new variant images, assign them in order
      if (newVariantImages[variantImageCounter]) {
        newVariant.imageUrls = [newVariantImages[variantImageCounter]];
        variantImageCounter++;
      }
      return newVariant;
    });

    // 5. UPDATE THE PRODUCT OBJECT
    // Merge the simple fields (name, price, etc.)
    Object.assign(product, rest);
    product.imageUrls = finalImageUrls; // Assign the final list of image URLs
    product.variants = newVariantEntities; // Assign the brand new set of variants

    // Update relations if they are provided
    if (brandId) {
      product.brand = await this.brandRepo.findOneBy({ id: brandId });
    }
    if (categoryIds) {
      product.categories = await this.categoryRepo.findByIds(categoryIds);
    }

    // 6. SAVE AND RETURN
    return this.productRepo.save(product);
  } */

  async updateProduct(id: number, dto: UpdateProductDto): Promise<Product> {
    // We use `preload` to get an entity with the new data merged in.
    // It finds the product by ID and loads the DTO data onto it.
    const productToUpdate = await this.productRepo.preload({
      id: id,
      ...dto,
    });

    if (!productToUpdate) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Handle relations separately
    if (dto.brandId) {
      const brand = await this.brandRepo.findOneBy({ id: dto.brandId });
      if (!brand) throw new NotFoundException('Brand not found');
      productToUpdate.brand = brand;
    }

    if (dto.categoryIds) {
      const categories = await this.categoryRepo.findByIds(dto.categoryIds);
      productToUpdate.categories = categories;
    }

    // For variants, we now use TypeORM's built-in cascade feature.
    // By creating entities with IDs, TypeORM knows to update them.
    // By creating entities without IDs, TypeORM knows to create them.
    if (dto.variants) {
      productToUpdate.variants = dto.variants.map((variantDto) =>
        this.variantRepo.create(variantDto),
      );
    }

    // Save the updated product with its variants.
    await this.productRepo.save(productToUpdate);

    // AFTER saving, call our new findOne method to get the complete, fresh data.
    return this.findOne(id);
  }
}
