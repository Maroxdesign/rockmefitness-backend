import { Body, Controller, Get, Param, Post, Put, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Response } from 'express';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import {
  ILoggedInUser,
  LoggedInUser,
} from '../../../common/decorator/user.decorator';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async createPayment(@Body() payload: CreatePaymentDto, @Res() res: Response) {
    const payment = await this.paymentService.createPayment(payload);

    return res.status(201).json({
      success: true,
      data: payment,
      message: 'Payment created successfully',
    });
  }

  @Put(':id')
  async updatePayment(
    @Param('id') id: string,
    @Body() payload: UpdatePaymentDto,
    @Res() res: Response,
  ) {
    await this.paymentService.updatePayment(id, payload);
  }

  @Get(':id')
  async getPaymentByOrderId(
    @Param('id') orderId: string,
    @Res() res: Response,
  ) {
    const payment = await this.paymentService.getPaymentByOrderId(orderId);

    return res.status(200).json({
      success: true,
      data: payment,
      message: 'Payment retrieved successfully',
    });
  }

  @Get('user')
  async getUserPayments(
    @LoggedInUser() user: ILoggedInUser,
    @Res() res: Response,
  ) {
    const payments = await this.paymentService.getUserPayments(user._id);

    return res.status(200).json({
      success: true,
      data: payments,
      message: 'Payments retrieved successfully',
    });
  }
}
