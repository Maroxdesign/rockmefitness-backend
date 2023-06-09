import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ride, RidesDocument } from './schema/rides.schema';
import { Model } from 'mongoose';
import { CreateRideDto } from './dto/create-ride.dto';
import { SpacesService } from '../spaces/spaces.service';
import { UpdateRideDto } from './dto/update-ride.dto';
import { GetDeliveryAmountDto } from './dto/get-delivery-amount.dto';

@Injectable()
export class RidesService {
  constructor(
    @InjectModel(Ride.name) private rideModel: Model<RidesDocument>,
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

  async getDeliveryPrice(payload: GetDeliveryAmountDto) {
    const {
      fromLatitude,
      fromLongitude,
      toLatitude,
      toLongitude,
      packageType,
    } = payload;

    const distance = this.calculateDistance(
      fromLatitude,
      fromLongitude,
      toLatitude,
      toLongitude,
    );

    console.log('distance', distance);

    const rides = await this.getRides();
    let data = [];

    for (const ride of rides) {
      data.push({
        name: ride.name,
        image: ride.image,
        price: Math.ceil(distance * ride.pricePerKilometer),
      });
    }

    return data;
  }

  calculateDistance(
    fromLatitude: number,
    fromLongitude: number,
    toLatitude: number,
    toLongitude: number,
  ) {
    const earthRadius = 6371;
    const lat1 = this.degreesToRadians(fromLatitude);
    const lon1 = this.degreesToRadians(fromLongitude);
    const lat2 = this.degreesToRadians(toLatitude);
    const lon2 = this.degreesToRadians(toLongitude);

    const deltaLat = lat2 - lat1;
    const deltaLon = lon2 - lon1;

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
  }

  degreesToRadians(degrees: number) {
    return (degrees * Math.PI) / 180;
  }
}
