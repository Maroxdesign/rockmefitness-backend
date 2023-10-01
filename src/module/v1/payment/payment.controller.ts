import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { TOKEN_GENERATED_SUCCESSFULLY } from '../../../common/constants/payment';
import { ResponseMessage } from '../../../common/decorator/response.decorator';
import { DATA_FETCH } from '../../../common/constants/product.constants';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../../../common/decorator/roles.decorator';
import { RoleEnum } from '../../../common/constants/user.constants';
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ResponseMessage(TOKEN_GENERATED_SUCCESSFULLY)
  @Get('generate_token')
  async generateClientToken() {
    try {
      const response = await this.paymentService.generateClientToken();
      return { clientToken: response.clientToken };
    } catch (error) {
      throw new Error('Failed to generate client token');
    }
  }

  @Post('process_payment')
  async processPayment(@Body() paymentData, @Req() req) {
    return await this.paymentService.processPayment(paymentData, req.user);
  }

  @ResponseMessage(DATA_FETCH)
  @Get('user')
  async getUserPayments(@Query() queryData, @Req() req) {
    return await this.paymentService.getUserPayments(queryData, req.user);
  }

  @ResponseMessage(DATA_FETCH)
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async paginate(@Query() queryData) {
    return await this.paymentService.paginate(queryData);
  }
}
