/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './DTO/create-user.dto';

@Controller('users')
export class UsersController { 
    constructor(private readonly usersService: UsersService) {}

    @Post()
    createUser(@Body() dto: CreateUserDto): Promise<User> {
        return this.usersService.createUser(dto);
    }

    @Get()
    getAllUsers(): Promise<User[]> {
        return this.usersService.getAllUsers();
    }

    @Get(':id')
    getUserById(@Param('id') id: number): Promise<User | null> {
        return this.usersService.getUserById(id);
    }

    @Delete(':id')
    deleteUser(@Param('id') id: number): Promise<{message: string}> {
        return this.usersService.deleteUser(id);
    }



}
