/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './DTO/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService { 

    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) {}

    async createUser(dto: CreateUserDto): Promise<User> {

        const salt = 10;
        const hashedPassword = await bcrypt.hash(dto.password, salt);

        const user = this.userRepo.create({

            ...dto,
            password: hashedPassword
        });

        return await this.userRepo.save(user);
    }

    async getAllUsers(): Promise<User[]> {

        const users = await this.userRepo.find();

        if (users.length === 0) {
            throw new NotFoundException('No users found');
        }

        return users;
    }






    

}
