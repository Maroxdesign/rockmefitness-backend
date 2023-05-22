import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type KycDocument = Kyc & Document;
@Schema({ _id: false })
export class Kyc {
  @Prop({ default: null })
  type?: string;

  @Prop({ default: null })
  front?: string;

  @Prop({ default: null })
  back?: string;

  @Prop({ default: null })
  selfie?: string;
}

export const KycSchema = SchemaFactory.createForClass(Kyc);
