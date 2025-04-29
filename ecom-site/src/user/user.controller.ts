/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './DTO/create-user.dto';
import { UpdateUserDto } from './DTO/update-user.dto';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';


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
    getAllUsers(): Promise<User[]> {
        return this.usersService.getAllUsers();
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

    @Get(':email')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin', 'customer')
    getUserByEmail(
        @Param('email') email: string,
        @Request() req: any
    ): Promise<User> {
        return this.usersService.getUserByEmail(req.user, email);
    }
    

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
    @Roles('admin', 'customer')
    updateUser(
        @Param('id', ParseIntPipe) id: number, 
        @Body() dto: UpdateUserDto,
        @Request() req: any
    ): Promise<{ message: string }> {

        return this.usersService.updateUser(req.user, id, dto);
    }



}
