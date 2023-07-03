import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OtpEnum } from 'src/common/constants/otp.enum';

export type OtpDocument = Otp & Document;
@Schema({ timestamps: true })
export class Otp {
  @Prop({ type: Number, required: true, unique: true })
  otp: number;

  @Prop({ type: Boolean, default: false })
  deactivated: boolean;

  @Prop()
  email: string;

  @Prop({
    enum: [OtpEnum.PHONE, OtpEnum.EMAIL, OtpEnum.PASSWORD],
    default: OtpEnum.EMAIL,
  })
  reason: string;

  @Prop({ type: Date, default: Date.now, expires: 300 })
  date: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
