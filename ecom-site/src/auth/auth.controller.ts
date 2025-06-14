/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './DTO/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const accessToken = await this.authService.login(dto);

    response.cookie('jwt', accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    return {
      status: 'success',
      message: 'Logged in successfully',
    };
  }
}
