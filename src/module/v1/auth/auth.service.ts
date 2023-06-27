import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { OtpEnum } from 'src/common/constants/otp.enum';
import {
  generateIdentifier,
  randomFourDigitNumber,
} from 'src/common/utils/uniqueId';
import { OtpService } from '../otp/otp.service';
import { OtpDocument } from '../otp/schema/otp.schema';
import { TokenService } from '../token/token.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User, UserDocument } from '../user/schema/user.schema';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordResetDto } from './dto/password.dto';
import { IAuthResponse } from './interface/auth.interface';
import { RoleEnum } from '../../../common/constants/user.constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private userService: UserService,
    private otpService: OtpService,
    private jwtService: JwtService,
    private tokenService: TokenService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async register(
    requestPayload: Readonly<CreateUserDto>,
  ): Promise<IAuthResponse> {
    const { password } = requestPayload;
    const hash = await this.hashPassword(password);
    const user = await this.userService.create({
      ...requestPayload,
      password: hash,
    });
    const accessToken = this.jwtService.sign({
      _id: user._id,
      role: user.role,
      generator: generateIdentifier(),
    });
    await this.tokenService.create({ user: user._id, token: accessToken });
    await this.otpService.create(user.email, OtpEnum.EMAIL);
    return {
      user,
      accessToken,
    };
  }

  async registerRider(
    requestPayload: Readonly<CreateUserDto>,
  ): Promise<IAuthResponse> {
    const { password } = requestPayload;
    const role = RoleEnum.RIDER;
    const hash = await this.hashPassword(password);
    const user = await this.userService.create({
      role: role,
      ...requestPayload,
      password: hash,
    });

    const accessToken = this.jwtService.sign({
      _id: user._id,
      role: user.role,
      generator: generateIdentifier(),
    });

    await this.tokenService.create({ user: user._id, token: accessToken });
    await this.otpService.create(user.email, OtpEnum.EMAIL);
    return {
      user,
      accessToken,
    };
  }

  async validateUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.userService.fullUserDetails({ email });
    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      throw new NotFoundException('Invalid login credentials');
    }
    return user;
  }

  async login(request: LoginDto): Promise<IAuthResponse> {
    const { email, password } = request;
    const user = await this.validateUser(email, password);
    const accessToken = this.jwtService.sign({
      _id: user._id,
      role: user.role,
      generator: generateIdentifier(),
    });
    await this.tokenService.create({ user: user._id, token: accessToken });
    return {
      user,
      accessToken,
    };
  }

  async checkEmail(email: string): Promise<OtpDocument> {
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new BadRequestException('This email already exist in expressRyder');
    }
    return;
  }

  async resetPassword(requestData: ForgotPasswordResetDto) {
    const { email, otp, password } = requestData;

    await this.otpService.validate({ email, otp, reason: OtpEnum.PASSWORD });
    const hash = await this.hashPassword(password);
    const updatePassword = await this.userModel.findOneAndUpdate(
      { email },
      { password: hash },
      { new: true },
    );
    if (!updatePassword) {
      throw new BadRequestException('Could not reset password');
    }
    return updatePassword;
  }
}
