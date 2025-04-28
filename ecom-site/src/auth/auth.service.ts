/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './DTO/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async login(dto: LoginDto): Promise<{ access_token: string }> {

        const user = await this.usersService.findUserByEmail(dto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const payload = { sub: user.id, role: user.role, email: user.email };
        const token = this.jwtService.sign(payload);

        return { access_token: token };

    }


}
