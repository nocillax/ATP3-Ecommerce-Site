import { UserRole } from '../user.entity';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';


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
    phone?: string;
  
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;
  }