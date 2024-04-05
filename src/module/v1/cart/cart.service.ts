import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schema/cart.schema';
import { Product, ProductDocument } from '../product/schema/product.schema';
import { Item, ItemDocument } from './schema/item.schema';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Item.name) private itemModel: Model<ItemDocument>,
  ) {}

  async showUserCart(user) {
    const cart = await this.cartModel.aggregate([
      {
        $match: { user: user._id },
      },
      {
        $unwind: '$cartItems',
      },
      {
        $lookup: {
          from: 'products',
          localField: 'cartItems.product',
          foreignField: '_id',
          as: 'cartItems.product',
        },
      },
      {
        $unwind: '$cartItems.product',
      },
      {
        $addFields: {
          'cartItems.product.variants': {
            $filter: {
              input: '$cartItems.product.variants',
              as: 'variant',
              cond: { $eq: ['$$variant._id', '$cartItems.variant'] },
            },
          },
        },
      },
      {
        $match: { 'cartItems.product.variants': { $ne: [] } },
      },
      {
        $group: {
          _id: '$_id',
          user: { $first: '$user' },
          cartItems: { $push: '$cartItems' },
        },
      },
    ]);

    return cart;
  }

  async getUserCart(user) {
    const cart = await this.cartModel.findOne({ user: user._id });
    return cart;
  }

  async addProductToCart(data, user) {
    const { productId, variantId, quantity } = data;

    // Find user's cart or create a new one if it doesn't exist
    let cart = await this.cartModel.findOne({ user: user._id });

    if (!cart) {
      cart = await this.cartModel.create({ user: user._id, cartItems: [] });
    }

    // Find the product by its ID
    const product = await this.productModel.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    // Check if the variant exists in the cart
    const existingCartItem = cart.cartItems.find(
      (item) =>
        item.product?.toString() === productId && item.variant === variantId,
    );

    if (existingCartItem) {
      // Update the quantity of the existing item
      existingCartItem.quantity += quantity;
    } else {
      // Create a new cart item and add it to the cart
      const newItem: Item = {
        _id: uuidv4(),
        product: productId,
        variant: variantId,
        quantity,
      }; // Ensure newItem conforms to Item schema
      cart.cartItems.push(newItem);
    }

    // Save and return the updated cart
    return await cart.save();
  }

  async removeItemFromCart(productId: string, user) {
    // Find user's cart
    const cart = await this.cartModel.findOne({ user: user._id });

    if (!cart) {
      throw new Error('Cart not found');
    }

    // Find index of the item to remove
    const indexToRemove = cart.cartItems.findIndex(
      (item) => item.product?.toString() === productId,
    );

    if (indexToRemove === -1) {
      throw new Error('Item not found in cart');
    }

    // Remove the item from the cart
    cart.cartItems.splice(indexToRemove, 1);

    // Save and return the updated cart
    return await cart.save();
  }

  async incrementCartItemQuantity(productId: string, user) {
    const cart = await this.getUserCart(user);
    const item = cart.cartItems.find(
      (item) => item.product?.toString() === productId,
    );

    if (!item) {
      throw new Error('Item not found in cart');
    }

    item.quantity++;

    return await cart.save();
  }

  async decrementCartItemQuantity(productId: string, user) {
    const cart = await this.getUserCart(user);
    const item = cart.cartItems.find(
      (item) => item.product?.toString() === productId,
    );

    if (!item) {
      throw new Error('Item not found in cart');
    }

    if (item.quantity === 1) {
      // If quantity is already 1, remove the item instead of decrementing
      return await this.removeItemFromCart(productId, user);
    }

    item.quantity--;

    return await cart.save();
  }
}
