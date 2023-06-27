import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { generate } from 'rxjs';
import { environment } from 'src/common/config/environment';
import { OtpEnum } from 'src/common/constants/otp.enum';
import { generateIdentifier } from 'src/common/utils/uniqueId';
import { MailService } from '../mail/mail.service';
import { otpTemplate } from '../mail/template/otp';
import { User, UserDocument } from '../user/schema/user.schema';
import { Otp, OtpDocument } from './schema/otp.schema';

interface IVerifyEmail {
  email: string;
  otp: number;
  reason: OtpEnum;
}

@Injectable()
export class OtpService {
  constructor(
    private mailService: MailService,
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000);
  };

  async create(email: string, reason: OtpEnum): Promise<OtpDocument> {
    const otp = this.generateOTP();
    const subject = `${environment.APP.NAME} - One time password`;
    await this.otpModel.updateMany({
      email,
      deactivated: true,
    });
    const createdOtp = this.otpModel.create({ otp, reason, email });
    if (!createdOtp) throw new BadRequestException('Could not create otp');

    await this.mailService.sendMail({
      to: email,
      subject,
      template: otpTemplate({ otp }),
    });
    return createdOtp;
  }

  async sendOtpForExistingUsers(
    email: string,
    reason: OtpEnum,
  ): Promise<OtpDocument> {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('This email does not exist');
    return this.create(email, reason);
  }

  async validate({ email, otp, reason }: IVerifyEmail) {
    const validateOtp = await this.otpModel.findOneAndUpdate(
      { otp, email, deactivated: false, reason },
      { deactivated: true },
    );
    if (!validateOtp) throw new BadRequestException('Invalid OTP');
  }

  async emailConfirmation({ otp }) {
    const validateOtp = await this.otpModel.findOneAndUpdate(
      { otp, deactivated: false },
      { deactivated: true },
    );
    if (!validateOtp) throw new BadRequestException('Invalid OTP');
  }

  async confirmEmail({ otp }) {
    return await this.emailConfirmation({ otp });
  }

  async verifyEmail({ email, otp, reason }: IVerifyEmail) {
    return await this.validate({ email, otp, reason });
  }

  async sendOtp(email: string): Promise<OtpDocument> {
    const otp = this.generateOTP();
    const subject = `${environment.APP.NAME} - One time password`;
    await this.otpModel.updateMany({
      email,
      deactivated: true,
    });
    const createdOtp = this.otpModel.create({
      otp,
      reason: OtpEnum.PASSWORD,
      email,
    });
    if (!createdOtp) throw new BadRequestException('Could not create otp');

    await this.mailService.sendMail({
      to: email,
      subject,
      template: otpTemplate({ otp }),
    });
    return createdOtp;
  }
}
