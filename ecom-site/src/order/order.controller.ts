import { Controller, Post, UseGuards, Request, Get, Param, ParseIntPipe, Patch, Body, Delete, Query, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { OrderStatus } from './order.entity';
import { UpdateOrderStatusDto } from './DTO/update-order-status.dto';
import { GetOrdersQueryDto } from './DTO/get-orders-query.dto';
import { CreateOrderDto } from './DTO/create-order.dto';
import { initialize } from 'passport';

@Controller('orders')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OrderController {
    constructor(private readonly ordersService: OrderService) {}

    /* @Post('checkout')
    @Roles('customer')
    initiateCheckout(
        @Request() req: any,
        @Body() dto: CreateOrderDto,
    ) {
        return this.ordersService.initiateCheckout(req.user.userId, dto.shippingAddress);
    } */

    @Get()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin', 'customer')
    async getOrders(
        @Request() req: any,
        @Query(new ValidationPipe({ transform: true })) query: GetOrdersQueryDto,
        ) {
        const SORT_FIELDS = {
            id: 'id',
            createdat: 'createdAt',
            totalprice: 'totalPrice',
            status: 'status',
        } as const;

        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const sortKey = query.sort?.toLowerCase();
        const sort = SORT_FIELDS[sortKey as keyof typeof SORT_FIELDS] ?? 'createdAt';
        const order = query.order ?? 'DESC';
        const skip = (page - 1) * limit;

        let userId: number | undefined;

        if (req.user.role === 'customer') {
            userId = req.user.userId;
        } 
        else if (req.user.role === 'admin') {
            userId = query.userId; 
        }

        const [data, total] = await this.ordersService.getFilteredOrders({
            skip,
            take: limit,
            sort,
            order,
            userId,
            status: query.status,
        });

        return {
            data,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        };
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
