import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { RatingService } from './rating.service';
import { Roles } from 'src/common/decorator/roles.decorator';
import { RoleEnum } from 'src/common/constants/user.constants';
import { CreateRatingDto } from './dto/create-rating.dto';
import { Response } from 'express';
import {
  ILoggedInUser,
  LoggedInUser,
} from 'src/common/decorator/user.decorator';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  async createRating(
    @Body() payload: CreateRatingDto,
    @Res() res: Response,
    @LoggedInUser() user: ILoggedInUser,
  ) {
    const rating = await this.ratingService.createRating(payload, user._id);

    return res.status(201).json({
      success: true,
      message: 'Rating created successfully',
      data: rating,
    });
  }

  @Get(':id/order')
  async getRatingByOrderId(@Param('id') id: string, @Res() res: Response) {
    const ratings = await this.ratingService.getRatingsByOrderId(id);

    return res.status(200).json({
      success: true,
      message: 'records fetched successfully',
      data: ratings,
    })
  }
}
