import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

export type RatingDocument = Rating & Document

@Schema({timestamps: true})
export class Rating {
  @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: "user"})
  userId: string;

  // TODO: change type to object id when order done
  @Prop({required: true, type: String})
  orderId: string;

  @Prop({required: true, type: String})
  rating: string;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);