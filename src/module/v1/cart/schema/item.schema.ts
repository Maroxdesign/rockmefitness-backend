import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Product } from '../../product/schema/product.schema';

export type ItemDocument = Item & Document;

@Schema({ timestamps: true })
export class Item {
  @Prop()
  _id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Product.name })
  product?: Product;

  @Prop()
  variant: string;

  @Prop()
  quantity: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
