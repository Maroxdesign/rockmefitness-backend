import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Request,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { UserByEmailDto } from './dto/create-user.dto';
import {
  ChangePasswordDto,
  SwitchAvailabilityDto,
  UpdateUserDto,
} from './dto/update-user.dto';
import { UserDocument } from './schema/user.schema';
import { UserService } from './user.service';
import {
  AVAILABILITY_UPDATED,
  KYC_BANK_UPDATED,
  LOGGED_OUT,
  PASSWORD_UPDATED,
  RoleEnum,
  USER_UPDATED,
  VEHICLE_UPDATED,
} from '../../../common/constants/user.constants';
import { ResponseMessage } from '../../../common/decorator/response.decorator';
import { Roles } from '../../../common/decorator/roles.decorator';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { Public } from '../../../common/decorator/public.decorator';
import {
  ILoggedInUser,
  LoggedInUser,
} from '../../../common/decorator/user.decorator';
import { UpdateLocationDto } from '../driver/dto/update-location.dto';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async findCurrentUser(@Request() req): Promise<UserDocument> {
    return await this.userService.findById(req.user);
  }

  @Get()
  async userByEmail(
    @Query() userByEmailDto: UserByEmailDto,
  ): Promise<UserDocument> {
    return await this.userService.findUserByEmail(userByEmailDto.email);
  }

  @ResponseMessage(USER_UPDATED)
  @Patch('me')
  async update(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    return await this.userService.update(req.user._id, updateUserDto);
  }

  @ResponseMessage(LOGGED_OUT)
  @Get('logout')
  async logout(@Request() req) {
    await this.userService.logout(req.user);
    return null;
  }

  @ResponseMessage(PASSWORD_UPDATED)
  @Patch('update/password')
  async changePassword(@Body() requestData: ChangePasswordDto, @Request() req) {
    await this.userService.changePassword(requestData, req.user);
    return null;
  }

  @Get('count')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPER_ADMIN)
  async count() {
    return await this.userService.count();
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPER_ADMIN)
  async find(@Query() filter) {
    return await this.userService.paginate(filter);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPER_ADMIN)
  async findOne(@Param('id') id: string) {
    return await this.userService.findById(id);
  }

  @ResponseMessage(USER_UPDATED)
  @Patch('/find')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.SUPER_ADMIN)
  async updateSpecific(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    return await this.userService.update(updateUserDto._id, updateUserDto);
  }

  @Public()
  @ResponseMessage(VEHICLE_UPDATED)
  @Patch('vehicle/:id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  async updateVehicle(
    @Param('id') id: string,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
    },
    @Body() requestData,
  ) {
    requestData = JSON.parse(JSON.stringify(requestData));
    return await this.userService.updateVehicle(id, requestData, files);
  }

  @Public()
  @ResponseMessage(KYC_BANK_UPDATED)
  @Patch('kyc/bank/:id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'front', maxCount: 1 },
      { name: 'back', maxCount: 1 },
      { name: 'selfie', maxCount: 1 },
    ]),
  )
  async updateKycBank(
    @Param('id') id: string,
    @UploadedFiles()
    files: {
      front?: Express.Multer.File[];
      back?: Express.Multer.File[];
      selfie?: Express.Multer.File[];
    },
    @Body() requestData,
  ) {
    requestData = JSON.parse(JSON.stringify(requestData));
    return await this.userService.updateKycBank(id, requestData, files);
  }

  @ResponseMessage(AVAILABILITY_UPDATED)
  @Patch('online/offline/:id')
  async switchAvailability(
    @Param('id') id: string,
    @Body() request: SwitchAvailabilityDto,
  ) {
    return await this.userService.switchAvailability(id, request);
  }

  @Patch('location')
  async updateDriverLocation(
    @LoggedInUser() user: ILoggedInUser,
    @Body() payload: UpdateLocationDto,
    @Res() res: Response,
  ) {
    const data = await this.userService.updateUserLocation(
      user._id,
      payload.longitude,
      payload.latitude,
    );

    return res.status(200).json({
      success: true,
      data,
      message: 'Driver location updated successfully',
    });
  }

  @Patch('profile-image')
  @UseInterceptors(FileInterceptor('image'))
  async updateProfileImage(
    @LoggedInUser() user: ILoggedInUser,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    if (!file) {
      throw new BadRequestException('Image is required');
    }

    await this.userService.updateProfileImage(user._id, file);

    return res.status(200).json({
      success: true,
      message: 'Profile image updated successfully',
    });
  }
}
