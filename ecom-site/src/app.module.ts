import { StripeModule } from './stripe/stripe.module';
import { MailModule } from './mail/mail.module';
import { MailService } from './mail/mail.service';
import { OrderModule } from './order/order.module';
import { CartModule } from './cart/cart.module';
import { CartController } from './cart/cart.controller';
import { AuthModule } from './auth/auth.module';
import { ReviewsModule } from './review/review.module';
import { UsersModule } from './user/user.module';
import { CategoriesModule } from './category/category.module';
import { ProductsModule } from './product/product.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { BrandModule } from 'src/brand/brand.module';
import { HeroImagesModule } from 'src/hero-images/hero-image.module';

@Module({
  imports: [
    StripeModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST') || 'localhost',
        port: parseInt(configService.get('DB_PORT') || '5432', 10),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    CategoriesModule,
    ProductsModule,
    AuthModule,
    ReviewsModule,
    UsersModule,
    CartModule,
    OrderModule,
    MailModule,
    BrandModule,
    HeroImagesModule, // Ensure this is imported
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
