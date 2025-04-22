/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './DTO/create-user.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService { 

    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) {}

    createUser(dto: CreateUserDto): Promise<User> {
        return this.userRepo.save(dto);
    }


    

}
