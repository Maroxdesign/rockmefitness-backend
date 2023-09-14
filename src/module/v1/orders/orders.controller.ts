import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  ILoggedInUser,
  LoggedInUser,
} from 'src/common/decorator/user.decorator';
import { Response } from 'express';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @Body() payload: CreateOrderDto,
    @LoggedInUser() user: ILoggedInUser,
    @Res() res: Response,
  ) {
    const paymentUrl = await this.ordersService.create(user._id, payload);

    return res.status(201).json({
      success: true,
      data: paymentUrl,
      message: 'Order created successfully',
    });
  }

  @Get()
  async getUserOrders(
    @LoggedInUser() user: ILoggedInUser,
    @Res() res: Response,
  ) {
    const orders = await this.ordersService.getUserOrders(user._id);

    return res.status(200).json({
      success: true,
      data: orders,
      message: 'records fetched successfully',
    });
  }

  @Get(':id')
  async getUserOrderById(
    @LoggedInUser() user: ILoggedInUser,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const order = await this.ordersService.getOrderById(id);

    return res.status(200).json({
      success: true,
      data: order,
      message: 'record fetched successfully',
    });
  }

  @Post('cancel/:id')
  async cancelOrder(
    @LoggedInUser() user: ILoggedInUser,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const order = await this.ordersService.cancelOrder(id, user._id);

    return res.status(200).json({
      success: true,
      data: order,
      message: 'order cancelled successfully',
    });
  }
}
