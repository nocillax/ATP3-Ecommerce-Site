import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateHeroImageDto } from 'src/hero-images/DTO/create-hero-image.dto';
import { UpdateHeroImageDto } from 'src/hero-images/DTO/update-hero-image.dto';
import { HeroImage } from 'src/hero-images/hero-images.entity';
import { Repository } from 'typeorm';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class HeroImagesService {
  constructor(
    @InjectRepository(HeroImage) private readonly repo: Repository<HeroImage>,
  ) {}

  // Creates a new hero image record
  create(dto: CreateHeroImageDto & { imageUrl: string }) {
    const heroImage = this.repo.create(dto);
    return this.repo.save(heroImage);
  }

  // Gets only ACTIVE images for the public homepage
  findAllActive() {
    return this.repo.find({
      where: { isActive: true },
      order: { displayOrder: 'ASC' },
    });
  }

  // ✅ Gets ALL images for the admin panel
  findAllForAdmin() {
    // This will correctly return an empty array [] if the table is empty.
    return this.repo.find({ order: { displayOrder: 'ASC' } });
  }

  // ✅ Updates a hero image
  async update(id: number, dto: UpdateHeroImageDto): Promise<HeroImage> {
    const heroImage = await this.repo.findOneBy({ id });
    if (!heroImage) throw new NotFoundException();

    const oldImageUrl = heroImage.imageUrl;

    // If a new imageUrl is being provided and it's different from the old one
    if (dto.imageUrl && dto.imageUrl !== oldImageUrl) {
      try {
        // Create the full, absolute path to the old file
        const imagePath = join(process.cwd(), oldImageUrl.substring(1));
        await fs.unlink(imagePath);
      } catch (error) {
        console.error(`Failed to delete old image file: ${oldImageUrl}`, error);
      }
    }

    Object.assign(heroImage, dto);
    return this.repo.save(heroImage);
  }

  // ✅ Deletes a hero image
  async remove(id: number): Promise<{ message: string }> {
    const heroImage = await this.repo.findOneBy({ id });
    if (!heroImage) throw new NotFoundException();

    const imageUrlToDelete = heroImage.imageUrl;

    // First, delete the database record
    await this.repo.delete(id);

    // If there was an image URL, now delete the physical file
    if (imageUrlToDelete) {
      try {
        // Create the full, absolute path to the file
        const imagePath = join(process.cwd(), imageUrlToDelete.substring(1));
        await fs.unlink(imagePath);
      } catch (error) {
        console.error(
          `Failed to delete image file: ${imageUrlToDelete}`,
          error,
        );
      }
    }

    return { message: `Hero image #${id} deleted` };
  }
}
