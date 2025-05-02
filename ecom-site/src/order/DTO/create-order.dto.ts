// src/order/dto/create-order.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  shippingAddress?: string;
}
