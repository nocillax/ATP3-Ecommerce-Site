import { IsString, IsNumber, IsArray } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;

  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds: number[];
}
