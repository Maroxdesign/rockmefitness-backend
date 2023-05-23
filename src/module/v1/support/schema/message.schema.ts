import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Document } from "mongoose";

export type MessageDocument = Message & Document;

@Schema({ _id: false })
export class Message {
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  senderId: string;

  @Prop({type: String, required: true})
  content: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);