/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, NotFoundException, Post, RawBodyRequest, Req, Res, Headers, UseGuards, HttpException, HttpStatus, Get } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { AuthGuard } from '@nestjs/passport';
import { OrderService } from 'src/order/order.service';
import Stripe from 'stripe';
import { Request, Response } from 'express';

@Controller('payment')
export class StripeController {
    constructor(
        private readonly stripeService: StripeService,
        private readonly orderService: OrderService
    ) {}

    @Post('checkout')
    @UseGuards(AuthGuard('jwt'))
    async checkout(@Req() req: any) {
    const userId = req.user.userId;
    const total = await this.orderService.calculateCartTotal(userId);
    const amountInCents = Math.round(total * 100);

    const session = await this.stripeService.createCheckoutSession(amountInCents, userId);
    return { url: session.url };
    }

@Post('webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ): Promise<{ received: boolean }> {
    if (!signature) {
      throw new HttpException('Missing Stripe signature header', HttpStatus.BAD_REQUEST);
    }

    let event: Stripe.Event;

    try {
      // `req.body` is raw buffer thanks to express.raw() middleware
      try {
  event = await this.stripeService.constructEvent(signature, req.body);
  console.log('🔔 Stripe event received:', event.type);
} catch (err) {
  console.error('❌ Webhook verification failed:', err.message);
  throw new HttpException(`Webhook Error: ${err.message}`, HttpStatus.BAD_REQUEST);
}

      console.log('🔔 Stripe event received:', event.type);
    } catch (err) {
      console.error('❌ Webhook verification failed:', err.message);
      throw new HttpException(`Webhook Error: ${err.message}`, HttpStatus.BAD_REQUEST);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = Number(session.metadata?.userId);

      console.log(`✅ Finalizing order for userId: ${userId}`);
      await this.orderService.finalizePaidOrder(userId);
    }

    return { received: true }; // ✅ Let Nest handle the response serialization
  }

  @Get('/success')
getSuccessPage(@Res() res: Response) {
  res.send('<h1>✅ Payment Successful!</h1><p>Your order has been placed.</p>');
}

@Get('/cancel')
getCancelPage(@Res() res: Response) {
  res.send('<h1>❌ Payment Cancelled</h1><p>Your order was not processed.</p>');
}




}

