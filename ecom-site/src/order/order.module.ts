import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CartModule } from 'src/cart/cart.module';
import { MailModule } from 'src/mail/mail.module';
import Stripe from 'stripe';
import { StripeModule } from 'src/stripe/stripe.module';
import { ProductsModule } from 'src/product/product.module';
import { Product } from 'src/product/product.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, OrderItem, Product]),
        CartModule,
        MailModule,
        forwardRef(() => StripeModule),
        ProductsModule
    ],
    controllers: [
        OrderController],
    providers: [
        OrderService],
    exports: [
        OrderService,
    ]
})
export class OrderModule { }
