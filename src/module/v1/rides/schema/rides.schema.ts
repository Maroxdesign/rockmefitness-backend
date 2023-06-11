import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RidesDocument = Ride &
  Document & {
    createdAt?: Date;
    updatedAt?: Date;
  };

@Schema({ timestamps: true })
export class Ride {
  @Prop()
  name: string;

  @Prop()
  image: string;

  @Prop()
  pricePerKilometer: number;
}

export const RidesSchema = SchemaFactory.createForClass(Ride);
