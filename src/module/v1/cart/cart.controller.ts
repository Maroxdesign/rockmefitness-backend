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
  QUANTITY_DECREASED,
  QUANTITY_INCREASED,
} from '../../../common/constants/product.constants';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ResponseMessage(DATA_FETCH)
  @Get()
  async getUserCart(@Req() req) {
    return await this.cartService.showUserCart(req.user);
  }

  @ResponseMessage(CART_PRODUCT_CREATED)
  @Post()
  async addProductToCart(@Body() data, @Req() req) {
    return await this.cartService.addProductToCart(data, req.user);
  }

  @ResponseMessage(CART_PRODUCT_REMOVED)
  @Delete('/remove/product/:productId')
  async removeItemFromCart(@Param('productId') productId: string, @Req() req) {
    return await this.cartService.removeItemFromCart(productId, req.user);
  }

  @ResponseMessage(QUANTITY_INCREASED)
  @Post('/product/quantity/increase/:productId')
  async incrementCartItemQuantity(
    @Param('productId') productId: string,
    @Req() req,
  ) {
    await this.cartService.incrementCartItemQuantity(productId, req.user);
  }

  @ResponseMessage(QUANTITY_DECREASED)
  @Post('/product/quantity/decrease/:productId')
  async decrementCartItemQuantity(
    @Param('productId') productId: string,
    @Req() req,
  ) {
    await this.cartService.decrementCartItemQuantity(productId, req.user);
  }

  // @ResponseMessage(DATA_FETCH)
  // @Get()
  // async showUserCart(@Query() queryData, @Req() req) {
  //   return await this.cartService.showUserCart(queryData, req.user);
  // }
  //
}
