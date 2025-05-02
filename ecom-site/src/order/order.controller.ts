import { Controller, Post, UseGuards, Request, Get, Param, ParseIntPipe, Patch, Body, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { OrderStatus } from './order.entity';
import { UpdateOrderStatusDto } from './DTO/update-order-status.dto';

@Controller('orders')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OrderController {
    constructor(private readonly ordersService: OrderService) {}

    @Post()
    @Roles('customer')
    createOrder(@Request() req: any) {
        return this.ordersService.createOrder(req.user.userId);
    }

    @Get()
    @Roles('customer')
    getMyOrders(@Request() req: any) {
        return this.ordersService.getMyOrders(req.user.userId);
    }

    @Get('all')
    @Roles('admin')
    getAllOrders() {
        return this.ordersService.getAllOrders();
    }

    @Get(':id')
    @Roles('admin')
    getOrderById(@Param('id', ParseIntPipe) id: number) {
        return this.ordersService.getOrderById(id);
    }

    @Patch('cancel/:id')
    @Roles('customer')
    cancelOrder(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
        return this.ordersService.cancelOrder(req.user.userId, id);
    }

    @Patch('update-status/:id')
    @Roles('admin')
    updateOrderStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrderStatusDto) {
        return this.ordersService.updateOrderStatus(id, dto.status);
    }

    @Delete(':id')
    @Roles('admin')
    deleteOrder(@Param('id', ParseIntPipe) id: number) {
        return this.ordersService.deleteOrder(id);
    }
}
