import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../user/schema/user.schema';

export type TokenDocument = Token & Document;

@Schema({ timestamps: true })
export class Token {
  @Prop({ type: String, required: true, unique: true })
  token: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    unique: true,
    required: true,
  })
  user: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
