import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rating, RatingDocument } from './schema/rating.schema';
import { Model } from 'mongoose';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating.name) private ratingModel: Model<RatingDocument>,
  ) {}

  async createRating(payload: CreateRatingDto, userId: string): Promise<Rating> {
    try {
      return await this.ratingModel.create({
        ...payload,
        userId,
      });
    } catch (err) {
      if (err.name === 'CastError') {
        throw new BadRequestException('Invalid rating');
      } else {
        throw new InternalServerErrorException(err.message);
      }
    }
  }

  async getRatingsByOrderId(orderId: string): Promise<Rating[]> {
    try {
      return await this.ratingModel.find({
        orderId,
      });
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
