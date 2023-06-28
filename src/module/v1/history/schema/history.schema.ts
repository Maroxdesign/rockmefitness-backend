import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {HistoryTypeEnum} from "../../../../common/constants/history.constants";

export type HistoryDocument = History &
  Document & {
    updatedAt?: Date;
    createdAt?: Date;
  };

@Schema({ timestamps: true })
export class History {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, trim: true, type: "string", enum: HistoryTypeEnum })
  type: HistoryTypeEnum;

  @Prop({ required: true })
  status: string;

  @Prop({ required: false })
  amount: string;

  @Prop({ required: false })
  fromLocation: string;

  @Prop({ required: false })
  toLocation: string;

  @Prop({ required: true })
  userId: string;
}

export const HistorySchema = SchemaFactory.createForClass(History);
