import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VariantDocument = Variant &
  Document & {
    updatedAt?: Date;
    createdAt?: Date;
  };
@Schema({ timestamps: true })
export class Variant {
  @Prop()
  _id: string;

  @Prop()
  color: string;

  @Prop()
  price: number;

  @Prop()
  image: string;

  @Prop()
  size: string;
}

export const VariantSchema = SchemaFactory.createForClass(Variant);
