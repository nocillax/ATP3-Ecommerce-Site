import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateHeroImageDto } from 'src/hero-images/DTO/create-hero-image.dto';
import { UpdateHeroImageDto } from 'src/hero-images/DTO/update-hero-image.dto';
import { HeroImagesService } from 'src/hero-images/hero-image.service';
import { ParseJsonPipe } from 'src/pipes/parse-json.pipe';

const storageOptions = {
  storage: diskStorage({
    destination: './uploads/hero',
    filename: (req, file, cb) => {
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      return cb(null, `${randomName}${extname(file.originalname)}`);
    },
  }),
};

// FILE: src/hero-images/hero-images.controller.ts
@Controller('hero-images')
export class HeroImagesController {
  constructor(private readonly heroImagesService: HeroImagesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('image', storageOptions))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body('data', new ParseJsonPipe(), new ValidationPipe())
    dto: CreateHeroImageDto,
  ) {
    if (!file) throw new BadRequestException('Image file is required.');
    const imageUrl = `/uploads/hero/${file.filename}`;
    return this.heroImagesService.create({ ...dto, imageUrl });
  }

  @Get()
  findAll() {
    // The public endpoint will get all *active* hero images
    return this.heroImagesService.findAllActive();
  }

  @Get('all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  findAllForAdmin() {
    return this.heroImagesService.findAllForAdmin();
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('image', storageOptions))
  update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body('data', new ParseJsonPipe(), new ValidationPipe())
    dto: UpdateHeroImageDto, // It now uses the corrected DTO
  ) {
    // If a new file is uploaded, use its path.
    // Otherwise, use the existing imageUrl sent from the form.
    const imageUrl = file ? `/uploads/hero/${file.filename}` : dto.imageUrl;

    return this.heroImagesService.update(id, { ...dto, imageUrl });
  }

  // ✅ NEW: Endpoint to delete an image
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.heroImagesService.remove(id);
  }
}
