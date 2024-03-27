import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CategoryEnum } from '../../../../common/constants/product.constants';
import { Variant, VariantSchema } from './variant.schema';

export type ProductDocument = Product &
  Document & {
    updatedAt?: Date;
    createdAt?: Date;
  };

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  productDetails: string;

  @Prop()
  tags: string;

  @Prop()
  quantity: number;

  @Prop({
    enum: [CategoryEnum.MEN, CategoryEnum.WOMEN],
  })
  category: string;

  @Prop({ type: [VariantSchema], default: [] })
  variants: Variant[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
