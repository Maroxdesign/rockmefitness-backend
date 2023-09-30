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
  DATA_FETCH,
  QUANTITY_UPDATED,
} from '../../../common/constants/product.constants';
import { ItemDTO } from './dto/item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ResponseMessage(CART_PRODUCT_CREATED)
  @Post()
  async addProductToCart(@Body() data: ItemDTO, @Req() req) {
    return await this.cartService.addProductToCart(data, req.user);
  }

  @ResponseMessage(DATA_FETCH)
  @Get()
  async showUserCart(@Query() queryData, @Req() req) {
    return await this.cartService.showUserCart(queryData, req.user);
  }

  @ResponseMessage(CART_PRODUCT_REMOVED)
  @Delete(':productId')
  async removeItemFromCart(@Param('productId') productId: string, @Req() req) {
    return await this.cartService.removeItemFromCart(productId, req.user);
  }

  @ResponseMessage(QUANTITY_UPDATED)
  @Post('increase/:productId')
  async increaseQuantity(@Param('productId') productId: string, @Req() req) {
    return await this.cartService.increaseQuantity(productId, req.user);
  }

  @ResponseMessage(QUANTITY_UPDATED)
  @Post('decrease/:productId')
  async decreaseQuantity(@Param('productId') productId: string, @Req() req) {
    return await this.cartService.decreaseQuantity(productId, req.user);
  }
}
