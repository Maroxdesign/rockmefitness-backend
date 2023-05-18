import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type KycDocument = Kyc & Document;
@Schema({ _id: false })
export class Kyc {
  @Prop()
  type: string;

  @Prop()
  front: string;

  @Prop()
  back: string;

  @Prop()
  selfie: string;
}

export const KycSchema = SchemaFactory.createForClass(Kyc);
