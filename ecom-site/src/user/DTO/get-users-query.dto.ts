// src/user/dto/get-users-query.dto.ts
import { IsOptional, IsInt, IsPositive, IsIn, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../user.entity';

export class GetUsersQueryDto {
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
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(UserRole, {
    message: `Role must be one of the following: ${Object.values(UserRole).join(', ')}`,
  })
  role?: UserRole;
}
