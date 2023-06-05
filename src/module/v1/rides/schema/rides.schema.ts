import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type RidesDocument = Rides &
  Document & {
    createdAt?: Date;
    updatedAt?: Date;
  };

@Schema({ timestamps: true })
export class Rides {
  @Prop()
  name: string;

  @Prop()
  image: string;

  @Prop()
  pricePerKilometer: number;
}

export const RidesSchema = SchemaFactory.createForClass(Rides);
