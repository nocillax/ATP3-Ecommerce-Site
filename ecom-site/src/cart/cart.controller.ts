/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { AddToCartDto } from './DTO/add-to-cart.dto';
import { UpdateCartItemDto } from './DTO/update-cart-item.dto';

@Controller('cart')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('customer', 'admin')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.userId);
  }

  @Post()
  addToCart(@Request() req, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(req.user.userId, dto);
  }

  @Patch()
  updateCartItem(@Request() req, @Body() dto: UpdateCartItemDto) {
    return this.cartService.updateCartItem(req.user.userId, dto);
  }

  @Delete(':cartItemId')
  removeCartItem(
    @Request() req,
    @Param('cartItemId', ParseIntPipe) cartItemId: number,
  ) {
    return this.cartService.removeCartItem(req.user.userId, cartItemId);
  }

  @Delete()
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.userId);
  }
}
