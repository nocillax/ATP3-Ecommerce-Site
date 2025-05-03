import { Order } from 'src/order/order.entity';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { OrderModule } from 'src/order/order.module';

@Module({
    imports: [OrderModule],
    controllers: [
        StripeController,],
    providers: [
        StripeService,],
    exports: [
        StripeService,],
})
export class StripeModule { }
