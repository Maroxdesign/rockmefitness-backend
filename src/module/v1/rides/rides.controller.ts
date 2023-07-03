import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { RidesService } from './rides.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateRideDto } from './dto/create-ride.dto';
import { Response } from 'express';
import { UpdateRideDto } from './dto/update-ride.dto';
import { GetDeliveryAmountDto } from './dto/get-delivery-amount.dto';

@Controller('rides')
export class RidesController {
  constructor(private readonly ridesService: RidesService) {}

  //TODO: limit this function to admin only
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createRide(
    @Body() payload: CreateRideDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const data = await this.ridesService.createRide(payload, file);

    return res.status(201).json({
      success: true,
      data,
      message: 'Ride created successfully',
    });
  }

  // TODO: limit this function to admin only
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updateRide(
    @Param('id') id: string,
    @Body() payload: UpdateRideDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    await this.ridesService.updateRide(id, payload, file);

    return res.status(200).json({
      success: true,
      message: 'Ride updated successfully',
    });
  }

  @Get()
  async getRides(@Res() res: Response) {
    const rides = await this.ridesService.getRides();

    return res.status(200).json({
      success: true,
      data: rides,
      message: 'Rides fetched successfully',
    });
  }

  @Post('delivery-price')
  async getDeliveryPrice(
    @Body() payload: GetDeliveryAmountDto,
    @Res() res: Response,
  ): Promise<any> {
    const response = await this.ridesService.getDeliveryPrice(payload);

    res.status(200).json({
      success: true,
      data: response,
      message: 'Success',
    });
  }
}
