/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  async createCheckoutSession(amountInPaisa: number, userId: number): Promise<{ url: string }> {

    const session = await this.stripe.checkout.sessions.create({

      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'bdt',
            unit_amount: amountInPaisa, 
            product_data: {
              name: 'NCX Order',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId.toString(),
      },
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    return { url: session.url! };
  }

  async constructEvent(signature: string, payload: Buffer): Promise<Stripe.Event> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
        throw new Error('Missing STRIPE_WEBHOOK_SECRET in environment variables');
    }

    return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }

}
