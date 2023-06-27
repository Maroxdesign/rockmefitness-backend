import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AccountDocument = Account & Document;
@Schema({ _id: false })
export class Account {
  @Prop({ default: null })
  bankName?: string;

  @Prop({ default: null })
  accountNumber?: string;

  @Prop({ default: null })
  accountName?: string;

  @Prop({ default: null })
  accountType?: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
