import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './schema/cart.schema';
import { Product, ProductDocument } from '../product/schema/product.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}
  async addProductToCart(id, user) {
    try {
      const product = await this.productModel.findOne({
        _id: id,
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      return await this.cartModel.create({
        product: product._id,
        user: user,
        count: 1,
      });
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async showCartItems(query: any, user) {
    let { currentPage, size, sort } = query;

    currentPage = Number(currentPage) ? parseInt(currentPage) : 1;
    size = Number(size) ? parseInt(size) : 10;
    sort = sort ? sort : 'desc';

    delete query.currentPage;
    delete query.size;
    delete query.sort;

    const count = await this.cartModel.count({
      user: user._id,
    });
    const response = await this.cartModel
      .find({ user: user._id })
      .populate('product')
      .skip(size * (currentPage - 1))
      .limit(size)
      .sort({ createdAt: sort });

    return {
      response,
      pagination: {
        total: count,
        currentPage,
        size,
      },
    };
  }

  async removeProductFromCart(id, user) {
    const cartItem = await this.cartModel.findOneAndDelete({
      product: id,
      user: user._id,
    });

    if (!cartItem) {
      throw new NotFoundException('Cannot delete another user product in cart');
    }

    return;
  }
}
