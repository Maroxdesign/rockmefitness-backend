import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AccountDocument = Account & Document;
@Schema({ _id: false })
export class Account {
  @Prop()
  bankName: string;

  @Prop()
  accountNumber: string;

  @Prop()
  accountName: string;

  @Prop()
  type: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
