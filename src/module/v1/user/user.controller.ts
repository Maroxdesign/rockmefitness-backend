import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { UserByEmailDto } from './dto/create-user.dto';
import { ChangePasswordDto, UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './schema/user.schema';
import { UserService } from './user.service';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ResponseMessage } from '../../../common/decorators/response.decorator';
import { LOGGED_OUT, PASSWORD_UPDATED, RoleEnum, USER_UPDATED } from "../../../common/constants/user.constants";

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
}
