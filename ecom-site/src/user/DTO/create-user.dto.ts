import { UserRole } from '../user.entity';
import { IsEmail, IsEnum, IsOptional, IsString, Max, MaxLength, MinLength } from 'class-validator';


export class CreateUserDto {
    @IsString()
    name: string;
  
    @IsEmail()
    email: string;
  
    @IsString()
    @MinLength(6)
    password: string;
  
    @IsOptional()
    @IsString()
    @MinLength(6)
    @MaxLength(15)
    phone?: string;
  
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @IsOptional()
    @IsString()
    defaultShippingAddress: string;
  }