// FILE: src/hero-images/entities/hero-image.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class HeroImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  title: string; // For admin reference, e.g., "Summer Sale Banner"

  @Column({ type: 'text' })
  imageUrl: string; // The path to the uploaded image, e.g., /uploads/banner1.jpg

  @Column({ type: 'text' })
  linkUrl: string; // The URL the "Shop Now" button will go to, e.g., /products?category=sale

  @Column({ default: true })
  isActive: boolean; // Toggle to easily show/hide banners

  @Column({ type: 'int', default: 0 })
  displayOrder: number; // To control the order in the slideshow
}
