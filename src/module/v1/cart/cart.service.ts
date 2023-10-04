import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Cart, CartDocument } from './schema/cart.schema';
import { Product, ProductDocument } from '../product/schema/product.schema';
import { Item, ItemDocument } from './schema/item.schema';
import {use} from "passport";

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Item.name) private itemModel: Model<ItemDocument>,
  ) {}

  async getUserCart(user) {
    const cart = await this.cartModel.findOne({ user: user._id });
    return cart;
  }

  async addProductToCart(data, user) {
    try {
      const { productId, quantity } = data;

      const checkIfProductExist = await this.productModel.findOne({
        _id: productId,
      });

      if (!checkIfProductExist) {
        throw new NotFoundException('Product not found');
      }

      if (quantity > checkIfProductExist.quantity) {
        throw new BadRequestException(
          `Cannot exceed product quantity limit ${checkIfProductExist.quantity}`,
        );
      }

      const subTotalPrice = quantity * checkIfProductExist.price;
      const cart = await this.getUserCart(user);

      if (!cart) {
        const newCart = await this.cartModel.create({ user: user._id });
        await this.itemModel.create({
          cart: newCart._id,
          product: checkIfProductExist._id,
          quantity: quantity,
          subTotalPrice: subTotalPrice,
        });

        await this.recalculateCart(cart);
      } else {
        const productCheck = await this.itemModel.findOne({
          cart: cart._id,
          product: productId,
        });

        if (productCheck) {
          throw new BadRequestException(
            'Product already exist increase quantity',
          );
        }

        await this.itemModel.create({
          cart: cart._id,
          product: productId,
          quantity: quantity,
          subTotalPrice: subTotalPrice,
        });

        await this.recalculateCart(cart);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  private async recalculateCart(cart) {
    let totalPrice = 0;
    const items = await this.itemModel.find({
      cart: cart._id,
    });

    for (const item of items) {
      const product = await this.productModel.findOne({
        _id: item.product,
      });

      item.subTotalPrice = item.quantity * product.price;
      item.save();

      totalPrice += item.subTotalPrice;
    }

    cart.totalPrice = totalPrice;
    await cart.save();

    return totalPrice;
  }

  async showUserCart(query: any, user): Promise<any> {
    const cart = await this.cartModel
      .findOne({ user: user._id })
      .select('-__v -user');

    const cartItems = await this.itemModel
      .find({
        cart: cart._id,
      })
      .populate({
        path: 'product',
        model: 'Product',
      });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    if (cartItems.length == 0) {
      cart.totalPrice = 0;
      await cart.save();
    }

    const mergedCartData = {
      cart,
      cartItems,
    };

    return mergedCartData;
  }

  async removeItemFromCart(productId, user) {
    const cart = await this.cartModel.findOne({
      user: user._id,
    });

    const cartItem = await this.itemModel.findOne({
      product: productId,
      user: user._id,
      cart: cart._id,
    });

    if (!cartItem) {
      throw new NotFoundException('Product not found');
    }

    await cartItem.remove();
    await this.recalculateCart(cart);
  }

  async increaseQuantity(productId, user) {
    try {
      const cart = await this.cartModel.findOne({
        user: user._id,
      });

      const cartItem = await this.itemModel.findOne({
        product: productId,
        user: user._id,
      });

      if (!cartItem) {
        throw new NotFoundException('Product not found in the cart');
      }

      cartItem.quantity++;
      await cartItem.save();

      await this.recalculateCart(cart);

      return await this.getUserCart(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async decreaseQuantity(productId, user) {
    try {
      const cart = await this.cartModel.findOne({
        user: user._id,
      });

      const cartItem = await this.itemModel.findOne({
        product: productId,
        user: user._id,
      });

      if (!cartItem) {
        throw new NotFoundException('Product not found in the cart');
      }

      cartItem.quantity--;
      await cartItem.save();

      await this.recalculateCart(cart);

      return await this.getUserCart(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getCartItemsByCart(cart, user) {
    const cartItems = await this.itemModel.find({
      cart: cart,
      user: user._id,
    });

    return cartItems;
  }
}
