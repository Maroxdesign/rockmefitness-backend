import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GenderEnum, RoleEnum } from 'src/common/constants/user.constants';

export type UserDocument = User &
  Document & {
    updatedAt?: Date;
    createdAt?: Date;
  };

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @Prop({ unique: true, trim: true })
  phone: string;

  @Prop({
    enum: [RoleEnum.CUSTOMER, RoleEnum.ADMIN],
    default: RoleEnum.CUSTOMER,
  })
  role: string;

  @Prop({
    enum: [GenderEnum.MALE, GenderEnum.FEMALE],
  })
  gender: string;

  @Prop({
    select: false,
    minlength: [6, 'Password must be a least 6 characters'],
  })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
