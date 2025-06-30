/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './DTO/login.dto';
import { AuthGuard } from '@nestjs/passport';

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
      path: '/', // ✅ Add path for consistency
    });

    return {
      status: 'success',
      message: 'Logged in successfully',
    };
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  async logout(@Res({ passthrough: true }) res: Response) {
    // ✅ FIX: The cookie name now correctly matches the one set during login.
    res.cookie('jwt', '', {
      httpOnly: true,
      path: '/',
      expires: new Date(0),
    });
    return { message: 'Logout successful' };
  }
}
