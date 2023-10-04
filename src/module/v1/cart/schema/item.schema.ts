import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Product } from '../../product/schema/product.schema';
import { Cart } from './cart.schema';

export type ItemDocument = Item & Document;

@Schema({ timestamps: true })
export class Item {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Product.name })
  product?: Product;

  @Prop()
  quantity: number;

  @Prop()
  subTotalPrice: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Cart.name })
  cart?: Cart;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
