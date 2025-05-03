/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './DTO/create-user.dto';
import { UpdateUserDto } from './DTO/update-user.dto';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { GetUsersQueryDto } from './DTO/get-users-query.dto';


@Controller('users')
export class UsersController { 
    constructor(private readonly usersService: UsersService) {}

    @Post('signup')
    async publicSignUp(@Body() dto: CreateUserDto): Promise<User> {
        return this.usersService.publicSignUp(dto);
    }
    
    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    async createUserByAdmin(@Body() dto: CreateUserDto): Promise<User> {
        return this.usersService.createUserByAdmin(dto);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    async getAllUsers(
        @Query(new ValidationPipe({ transform: true })) query: GetUsersQueryDto,
    ) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;

        const skip = (page - 1) * limit;

        const [data, total] = await this.usersService.getFilteredUsers({
        skip,
        take: limit,
        search: query.search,
        role: query.role,
        });

        return {
        data,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        };
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin', 'customer')
    getUserById(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: any 
    ): Promise<User> {
        return this.usersService.getUserById(req.user, id);
    }


    //Add Delete for customer seperately without id parameter
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin', 'customer')
    deleteUser(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: any
    ): Promise<{ message: string }> {
        return this.usersService.deleteUser(req.user, id);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    updateUser(
        @Param('id', ParseIntPipe) id: number, 
        @Body() dto: UpdateUserDto
    ): Promise<{ message: string }> {

        return this.usersService.updateUserById(id, dto);
    }

    @Patch()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('customer')
    updateUserProfile(
        @Request() req: any,
        @Body() dto: UpdateUserDto,
    ): Promise<{ message: string }> {
        return this.usersService.updateUserProfile(req.user, dto);  
    }


}
