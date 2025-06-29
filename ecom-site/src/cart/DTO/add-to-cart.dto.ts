import { IsInt, Min } from 'class-validator';

export class AddToCartDto {
  @IsInt()
  productVariantId: number; // ✅ important: you're working with variants now

  @IsInt()
  @Min(1)
  quantity: number;
}
