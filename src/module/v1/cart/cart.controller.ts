import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { ResponseMessage } from '../../../common/decorator/response.decorator';
import {
  CART_PRODUCT_CREATED,
  CART_PRODUCT_REMOVED,
} from '../../../common/constants/product.constants';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ResponseMessage(CART_PRODUCT_CREATED)
  @Post(':id')
  async addProductToCart(@Param('id') id: string, @Req() req) {
    return await this.cartService.addProductToCart(id, req.user);
  }

  @Get()
  async showCartItems(@Query() queryData, @Req() req) {
    return await this.cartService.showCartItems(queryData, req.user);
  }

  @ResponseMessage(CART_PRODUCT_REMOVED)
  @Delete(':id')
  async removeProductFromCart(@Param('id') id: string, @Req() req) {
    return await this.cartService.removeProductFromCart(id, req.user);
  }
}
