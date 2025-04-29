/*
https://docs.nestjs.com/providers#services
*/

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './DTO/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './DTO/update-user.dto';


@Injectable()
export class UsersService { 

    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) {}


    // ===========================================================================
    //  Internal Functions
    // ===========================================================================


    async findUserById(id: number): Promise<User | null> {
        return await this.userRepo.findOne({ where: { id } });
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return await this.userRepo.findOne({ where: { email } });
    }

    async findExistingUserById(id: number): Promise<User> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return user;
    }

    async findExistingUserByEmail(email: string): Promise<User> {
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user) {
            throw new NotFoundException(`User with email ${email} not found`);
        }
        return user;
    }


    // ===========================================================================
    //  Public API Functions 
    // ===========================================================================

    async publicSignUp(dto: CreateUserDto): Promise<User> {
        const existingUser = await this.findUserByEmail(dto.email);
        if (existingUser) {
            throw new ForbiddenException('User with this email already exists');
        }

        const salt = 10;
        const hashedPassword = await bcrypt.hash(dto.password, salt);

        const user = this.userRepo.create({
            ...dto,
            password: hashedPassword,
            role: UserRole.CUSTOMER,
        });

        return await this.userRepo.save(user);
    }

    async createUserByAdmin(dto: CreateUserDto): Promise<User> {
        const existingUser = await this.findUserByEmail(dto.email);
        if (existingUser) {
            throw new ForbiddenException('User with this email already exists');
        }

        const salt = 10;
        const hashedPassword = await bcrypt.hash(dto.password, salt);

        const user = this.userRepo.create({
            ...dto,
            password: hashedPassword,
            role: dto.role ?? UserRole.CUSTOMER,
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

    async getUserById(requestUser: any, id: number): Promise<User> {
        if (requestUser.role !== 'admin' && requestUser.userId !== id) {
            throw new ForbiddenException('You are not allowed to view this profile');
        }

        const user = await this.findExistingUserById(id);

        return user;
    }

    async getUserByEmail(requestUser: any, email: string): Promise<User> {
        if (requestUser.role !== 'admin' && requestUser.email !== email) {
            throw new ForbiddenException('You are not allowed to view this profile');
        }

        const user = await this.findExistingUserByEmail(email);

        return user;
    }

    async deleteUser(requestUser: any, id: number): Promise<{message: string}> {
        if (requestUser.role !== 'admin' && requestUser.userId !== id) {
            throw new ForbiddenException('You are not allowed to delete this profile');
        }
        
        await this.findExistingUserById(id);

        await this.userRepo.delete(id);

        return { message: `User with id ${id} deleted successfully` };
    }

    async updateUser(requestUser: any, id: number, dto: UpdateUserDto): Promise<{ message: string }> {
        if (requestUser.role !== 'admin' && requestUser.userId !== id) {
            throw new ForbiddenException('You are not allowed to update this profile');
        }

        const user = await this.findExistingUserById(id);

        if (dto.password) {
            const salt = 10;
            const hashedPassword = await bcrypt.hash(dto.password, salt);
            dto.password = hashedPassword;
        }

        Object.assign(user, dto);

        await this.userRepo.save(user as User);

        return { message: `User with id ${id} updated successfully` };
    }
}
