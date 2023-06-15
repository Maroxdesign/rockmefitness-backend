import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GenderEnum, RoleEnum } from 'src/common/constants/user.constants';
import { Account } from './account.schema';
import { Kyc } from './kyc.schema';
import { Vehicle } from './vehicle.schema';

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

  @Prop({ required: true, unique: true, trim: true })
  phone: string;

  @Prop({
    enum: [RoleEnum.CUSTOMER, RoleEnum.SUPER_ADMIN, RoleEnum.RIDER],
    default: RoleEnum.CUSTOMER,
  })
  role: string;

  @Prop({
    enum: [GenderEnum.MALE, GenderEnum.FEMALE],
  })
  gender: string;

  @Prop()
  city: string;

  @Prop({
    select: false,
    minlength: [8, 'Password must be a least 8 characters'],
  })
  password: string;

  @Prop({ default: false })
  suspend: boolean;

  @Prop({ default: false })
  deactivate: boolean;

  @Prop({ default: false })
  driverAvailability: boolean;

  @Prop({ default: 0 })
  wallet: number;

  @Prop({ default: {}, required: false })
  kyc: Kyc;

  @Prop({ default: {}, required: false })
  vehicle: Vehicle;

  @Prop({ default: [], required: false })
  tokens: string[];

  @Prop({ default: {}, required: false })
  account: Account;

  @Prop({ nullable: true })
  longitude: number;

  @Prop({ nullable: true })
  latitude: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
