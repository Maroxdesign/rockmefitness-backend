import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VehicleDocument = Vehicle & Document;
@Schema({ _id: false })
export class Vehicle {
  @Prop()
  image: string;

  @Prop()
  name: string;

  @Prop()
  carModel: string;

  @Prop()
  manufactureYear: string;

  @Prop()
  plateNumber: string;

  @Prop()
  color: string;
}

export const KycSchema = SchemaFactory.createForClass(Vehicle);
