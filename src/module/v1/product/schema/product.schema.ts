import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GenderEnum, RoleEnum } from 'src/common/constants/user.constants';
import { CategoryEnum } from '../../../../common/constants/product.constants';

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
  color: string;

  @Prop()
  tags: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  image: string;

  @Prop()
  size: string;

  @Prop({
    enum: [CategoryEnum.MEN, CategoryEnum.WOMEN],
  })
  category: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
