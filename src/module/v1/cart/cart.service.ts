import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
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

  async addProductToCart(data, user) {
    try {
      const { product, quantity } = data;

      const checkIfProductExist = await this.productModel.findOne({
        _id: product,
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
      const cart = await this.getUserCart(user._id);

      if (cart) {
        const itemIndex = cart.items.findIndex(
          (item) => item.product == product,
        );

        if (itemIndex > -1) {
          const item = cart.items[itemIndex];
          item.quantity = Number(item.quantity) + Number(quantity);
          item.subTotalPrice = item.quantity * checkIfProductExist.price;

          cart.items[itemIndex] = item;
          await this.recalculateCart(cart);
          cart.totalPrice = this.calculateTotalPrice(cart);
          return cart.save();
        } else {
          cart.items.push({ ...data, subTotalPrice });
          await this.recalculateCart(cart);
          cart.totalPrice = this.calculateTotalPrice(cart);
          await cart.save();
        }
      }

      return cart;
    } catch (e) {
      throw new BadRequestException(e.message); // Send a response to the client
    }
  }

  private calculateTotalPrice(cart: Cart): number {
    // Calculate the total price based on the items in the cart
    return cart.items.reduce((total, item) => total + item.subTotalPrice, 0);
  }

  private recalculateCart(cart: CartDocument) {
    cart.totalPrice = 0;
    cart.items.forEach((item) => {
      cart.totalPrice += item.quantity * item.price;
    });
  }

  async getUserCart(userId: string): Promise<CartDocument> {
    const cart = await this.cartModel.findOne({ user: userId }).populate({
      path: 'items.product',
      model: 'Product',
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return cart;
  }

  async showUserCart(query: any, user) {
    const cart = await this.getUserCart(user._id);

    return cart;
  }

  async removeItemFromCart(productId, user): Promise<any> {
    const cart = await this.getUserCart(user._id);

    // Find the index of the item with the matching productId
    const itemIndex = cart.items.findIndex((item) => item.product == productId);

    if (itemIndex == -1) {
      // Remove the item from the array
      cart.items.splice(itemIndex);

      // Recalculate and update cart properties
      await this.recalculateCart(cart);
      cart.totalPrice = this.calculateTotalPrice(cart);

      // Save the cart to update it in the database
      await cart.save();

      return cart;
    } else {
      throw new NotFoundException('Item not found in the cart.');
    }
  }

  async cart(user) {
    const cart = await this.cartModel.findOne({ user: user });

    return cart;
  }

  async increaseQuantity(productId, user) {
    try {
      const cart = await this.cart(user._id);

      const existingItemIndex = cart.items.findIndex(
        (item) => item.product == productId,
      );

      if (existingItemIndex !== -1) {
        const existingItem = cart.items[existingItemIndex];

        // Load the product details from the database
        const product = await this.productModel.findOne({
          _id: productId,
        });

        if (!product) {
          throw new NotFoundException('Product not found');
        }

        existingItem.product = product._id;
        existingItem.quantity++;

        if (existingItem.quantity > product.quantity) {
          throw new UnprocessableEntityException(
            `Cannot exceed product quantity limit ${product.quantity}`,
          );
        }

        // Calculate the subTotalPrice using the loaded product's price
        existingItem.subTotalPrice = existingItem.quantity * product.price;

        // Update the item in the cart
        cart.items[existingItemIndex] = existingItem;

        // Recalculate the cart and update the total price
        this.recalculateCart(cart);

        cart.totalPrice = this.calculateTotalPrice(cart);

        // Save the cart with the updated item
        await cart.save();

        return cart;
      } else {
        throw new NotFoundException('Product not found in the cart');
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async decreaseQuantity(productId, user) {
    try {
      const cart = await this.cart(user._id);

      const existingItemIndex = cart.items.findIndex(
        (item) => item.product == productId,
      );

      if (existingItemIndex !== -1) {
        const existingItem = cart.items[existingItemIndex];

        // Load the product details from the database
        const product = await this.productModel.findById(productId);

        if (!product) {
          throw new NotFoundException('Product not found');
        }

        existingItem.product = product._id;
        existingItem.quantity--;

        // Calculate the subTotalPrice using the loaded product's price
        existingItem.subTotalPrice = existingItem.quantity * product.price;

        // Update the item in the cart
        cart.items[existingItemIndex] = existingItem;

        // Recalculate the cart and update the total price
        this.recalculateCart(cart);

        cart.totalPrice = this.calculateTotalPrice(cart);

        // Save the cart with the updated item
        await cart.save();

        console.log(cart);

        return cart;
      } else {
        throw new NotFoundException('Product not found in the cart');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
