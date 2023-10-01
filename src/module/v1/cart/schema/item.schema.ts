import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Product } from '../../product/schema/product.schema';

export type ItemDocument = Item & Document;

@Schema({ timestamps: false })
export class Item {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
  product?: Product;

  @Prop()
  name: string;

  @Prop()
  quantity: number;

  @Prop()
  price: number;

  @Prop()
  subTotalPrice: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
