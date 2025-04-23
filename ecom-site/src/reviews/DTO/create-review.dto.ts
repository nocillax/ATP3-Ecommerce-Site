import { IsInt, IsOptional, Min, Max, IsString } from 'class-validator';

export class CreateReviewDto {

    @IsInt()
    userId: number;

    @IsInt()
    productId: number;

    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @IsOptional()
    @IsString()
    comment?: string;

}
