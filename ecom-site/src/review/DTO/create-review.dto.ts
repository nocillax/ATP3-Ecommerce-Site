import { IsInt, IsOptional, Min, Max, IsString, IsNumber } from 'class-validator';

export class CreateReviewDto {

    @IsInt()
    productId: number;

    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    @IsOptional()
    @IsString()
    comment?: string;

}
