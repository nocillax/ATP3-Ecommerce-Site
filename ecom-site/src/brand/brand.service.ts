import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './brand.entity';
import { UpdateBrandDto } from 'src/brand/dto/update-brand.dto';
import { CreateBrandDto } from 'src/brand/dto/create-brand.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand) private readonly repo: Repository<Brand>,
  ) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '');
  }

  /* CREATE */
  async create(dto: CreateBrandDto): Promise<Brand> {
    const existing = await this.repo.findOne({ where: { name: dto.name } });
    if (existing) {
      throw new ConflictException(
        `A brand with the name "${dto.name}" already exists.`,
      );
    }
    const slug = this.slugify(dto.name);
    const brand = this.repo.create({ ...dto, slug });
    return this.repo.save(brand);
  }

  /* READ */
  findAll(): Promise<Brand[]> {
    return this.repo.find({ order: { name: 'ASC' } }); // optional alpha sort
  }

  async findOne(id: number): Promise<Brand> {
    const brand = await this.repo.findOne({ where: { id } });
    if (!brand) throw new NotFoundException(`Brand #${id} not found`);
    return brand;
  }

  /* UPDATE */
  async update(id: number, dto: UpdateBrandDto): Promise<Brand> {
    // Find the existing brand we want to update
    const brand = await this.findOne(id);

    // Separate the imageUrl from the rest of the DTO data
    const { imageUrl, ...restOfDto } = dto;

    // 1. Update the simple fields like name, description, etc.
    Object.assign(brand, restOfDto);

    // 2. ✅ THIS IS THE FIX: Explicitly handle the imageUrl.
    // This ensures that if no new URL is provided (i.e., it's undefined),
    // the database field will be set to null, effectively deleting the old image link.
    brand.imageUrl = imageUrl ?? null;

    // 3. Save the fully updated brand object
    return this.repo.save(brand);
  }

  /* DELETE */
  async remove(id: number): Promise<{ message: string }> {
    const result = await this.repo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Brand #${id} not found`);
    return { message: `Brand #${id} deleted` };
  }
}
