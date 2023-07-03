import { Body, Controller, Patch, Res } from '@nestjs/common';
import { DriverService } from './driver.service';
import {
  ILoggedInUser,
  LoggedInUser,
} from 'src/common/decorator/user.decorator';
import { Response } from 'express';
import { UpdateLocationDto } from './dto/update-location.dto';

@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Patch('location')
  async updateDriverLocation(
    @LoggedInUser() user: ILoggedInUser,
    @Body() payload: UpdateLocationDto,
    @Res() res: Response,
  ) {
    const data = await this.driverService.updateDriverLocation(
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
}
