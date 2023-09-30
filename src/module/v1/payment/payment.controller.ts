import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { TOKEN_GENERATED_SUCCESSFULLY } from '../../../common/constants/payment';
import { ResponseMessage } from '../../../common/decorator/response.decorator';
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
  async processPayment(@Body() paymentData) {
    return await this.paymentService.processPayment(paymentData);
  }
}
