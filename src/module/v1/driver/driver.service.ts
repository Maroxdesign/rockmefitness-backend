import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class DriverService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async updateDriverLocation(
    driverId: string,
    longitude: number,
    latitude: number,
  ): Promise<UserDocument> {
    return await this.userModel.findByIdAndUpdate(
      { _id: driverId },
      {
        $set: {
          location: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
        },
      },
      { new: true },
    );
  }

  async findNearbyDrivers(lat: number, lng: number): Promise<UserDocument[]> {
    return await this.userModel
      .find({
        location: {
          $near: {
            $maxDistance: 10000,
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat],
            },
          },
        },
      })
      .sort({ location: 'asc' });
  }
}
