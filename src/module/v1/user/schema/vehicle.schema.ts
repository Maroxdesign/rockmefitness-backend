import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VehicleDocument = Vehicle & Document;
@Schema({ _id: false })
export class Vehicle {
  @Prop({ default: null })
  image: string;

  @Prop({ default: null })
  carModel: string;

  @Prop({ default: null })
  manufactureYear: string;

  @Prop({ default: null })
  plateNumber: string;

  @Prop({ default: null })
  color: string;
}

export const KycSchema = SchemaFactory.createForClass(Vehicle);
