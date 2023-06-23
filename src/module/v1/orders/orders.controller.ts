import { Body, Controller, Post, Res } from '@nestjs/common';
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
}
