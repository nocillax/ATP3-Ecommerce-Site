// src/order/dto/get-orders-query.dto.ts
import { IsOptional, IsIn, IsInt, IsPositive, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../order.entity';

export class GetOrdersQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit?: number = 10;

  @IsOptional()
  @IsIn(['createdAt', 'totalPrice', 'id', 'status'], {
    message: 'sort must be one of: createdAt, totalPrice, id, or status',
  })
  sort?: string = 'createdAt';


  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'DESC';

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
