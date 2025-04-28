import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CartModule } from 'src/cart/cart.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, OrderItem]),
        CartModule,
    ],
    controllers: [
        OrderController],
    providers: [
        OrderService],
})
export class OrderModule { }
