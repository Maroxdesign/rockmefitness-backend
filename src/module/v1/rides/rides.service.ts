import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rides, RidesDocument } from './schema/rides.schema';
import { Model } from 'mongoose';
import { CreateRideDto } from './dto/create-ride.dto';
import { SpacesService } from '../spaces/spaces.service';
import { UpdateRideDto } from './dto/update-ride.dto';

@Injectable()
export class RidesService {
  constructor(
    @InjectModel(Rides.name) private rideModel: Model<RidesDocument>,
    private spacesService: SpacesService,
  ) {}

  async createRide(
    payload: CreateRideDto,
    file: Express.Multer.File,
  ): Promise<RidesDocument> {
    try {
      return await this.rideModel.create({
        name: payload.name,
        image: await this.spacesService.uploadFile(file),
        pricePerKilometer: payload.pricePerKilometer,
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async updateRide(
    id: string,
    payload: UpdateRideDto,
    file: Express.Multer.File,
  ): Promise<void> {
    try {
      if (file) {
        await this.rideModel.findOneAndUpdate(
          { _id: id },
          {
            image: await this.spacesService.uploadFile(file),
          },
          { new: true },
        );
      }

      await this.rideModel.findOneAndUpdate(
        { _id: id },
        {
          name: payload.name,
          pricePerKilometer: payload.pricePerKilometer,
        },
        { new: true },
      );
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getRides(): Promise<RidesDocument[]> {
    try {
      return await this.rideModel.find();
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
