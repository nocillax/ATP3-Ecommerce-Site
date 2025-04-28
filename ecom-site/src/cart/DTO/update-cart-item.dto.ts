import { IsInt, Min } from 'class-validator';

export class UpdateCartItemDto {
  @IsInt()
  cartItemId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}
