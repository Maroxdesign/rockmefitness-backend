import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Account } from 'aws-sdk';
import { Kyc } from 'src/module/v1/user/schema/kyc.schema';
import { Vehicle } from 'src/module/v1/user/schema/vehicle.schema';

export const LoggedInUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user ?? null;
  },
);

export interface ILoggedInUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  gender: string;
  city: string;
  suspend: boolean;
  deactivate: boolean;
  driverAvailability: boolean;
  wallet: number;
  kyc: Kyc;
  account: Account;
  vehicle: Vehicle;
}
