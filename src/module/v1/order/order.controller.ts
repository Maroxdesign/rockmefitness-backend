import { OrderService } from './order.service';
import {
  Body,
  Controller,
  Get,
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
import { OrderDto } from './dto/order.dto';
import { RoleEnum } from '../../../common/constants/user.constants';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../../../common/decorator/roles.decorator';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ResponseMessage(DATA_FETCH)
  @Get('user')
  async getUserOrders(@Query() queryData, @Req() req) {
    return await this.orderService.getUserOrders(queryData, req.user);
  }

  @ResponseMessage(DATA_FETCH)
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async paginate(@Query() queryData) {
    return await this.orderService.paginate(queryData);
  }

  @ResponseMessage(CREATE_ORDER)
  @Post()
  async create(@Body() data: OrderDto, @Req() req) {
    return await this.orderService.create(data, req.user);
  }
}
