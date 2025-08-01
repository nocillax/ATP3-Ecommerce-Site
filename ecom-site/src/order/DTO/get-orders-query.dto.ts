// src/order/dto/get-orders-query.dto.ts
import {
  IsOptional,
  IsIn,
  IsInt,
  IsPositive,
  IsString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../order.entity';

export class GetOrdersQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit?: number;

  @IsOptional()
  sort?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsEnum(OrderStatus, {
    message: `Status must be one of the following: ${Object.values(OrderStatus).join(', ')}`,
  })
  status?: OrderStatus;
}
