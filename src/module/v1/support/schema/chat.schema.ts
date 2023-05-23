import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ChatDocument = Chat & Document;

@Schema({timestamps: true})
export class Chat {
  @Prop({required: true})
  userId: string;

  @Prop({default: false})
  adminJoined: boolean;

  @Prop({required: false})
  adminId: string;

  @Prop({default: false})
  closed: boolean;

  @Prop()
  messages: [{
    senderId: {type: string, required: true},
    mesaage: {type: string, required: true},
  }]
}

export const ChatSchema = SchemaFactory.createForClass(Chat);