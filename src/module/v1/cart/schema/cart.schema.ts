import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../user/schema/user.schema';
import { Product } from '../../product/schema/product.schema';

export type CartDocument = Cart &
  Document & {
    updatedAt?: Date;
    createdAt?: Date;
  };

@Schema({ timestamps: true })
export class Cart {
  @Prop()
  count: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Product.name })
  product?: Product;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user?: User;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
