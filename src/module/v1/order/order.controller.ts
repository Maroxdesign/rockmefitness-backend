import { OrderService } from './order.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ResponseMessage } from '../../../common/decorator/response.decorator';
import {
  CREATE_ORDER,
  DATA_FETCH,
} from '../../../common/constants/product.constants';
import { RoleEnum } from '../../../common/constants/user.constants';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../../../common/decorator/roles.decorator';
import { Public } from '../../../common/decorator/public.decorator';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ResponseMessage(DATA_FETCH)
  @Get('user')
  async getUserOrders(@Query() queryData, @Req() req) {
    return await this.orderService.getUserOrders(queryData, req.user);
  }

  @ResponseMessage(DATA_FETCH)
  @Public()
  @Get('tax/:amount')
  async getTax(@Param('amount') amount: string) {
    return await this.orderService.getTax(amount);
  }

  @ResponseMessage(DATA_FETCH)
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async paginate(@Query() queryData) {
    return await this.orderService.paginate(queryData);
  }

  @ResponseMessage(DATA_FETCH)
  @Get(':orderId')
  async viewSingleOrder(@Param('orderId') orderId: string) {
    return await this.orderService.viewSingleOrder(orderId);
  }

  @ResponseMessage(CREATE_ORDER)
  @Post()
  async create(@Body() data, @Req() req) {
    try {
      const order = await this.orderService.create(data, req.user);

      return order;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
