import {Body, Controller, Res, Post, Get, Param} from '@nestjs/common';
import { HistoryService } from './history.service';
import {CreateHistoryDto} from "./dto/create-history.dto";
import {ILoggedInUser, LoggedInUser} from "../../../common/decorator/user.decorator";
import {Response} from 'express'

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {

  }

  // todo: remove later
  @Post()
  async createHistory(
      @Body() payload: CreateHistoryDto,
      @LoggedInUser() user: ILoggedInUser,
      @Res() res: Response
  ) {
    const history = await this.historyService.createHistory(user._id, payload);

    return res.status(201).json({
      success: true,
      data: history,
      message: "History created successfully"
    })
  }

  /**
   * get user history
   */
  @Get()
  async getUserHistory(
      @LoggedInUser() user: ILoggedInUser,
      @Res() res: Response
  ) {
    const history = await this.historyService.getUserHistory(user._id);

    return res.status(200).json({
      success: true,
      data: history,
      message: "records fetched successfully"
    })
  }

  /**
   *  get history by id
   */
  @Get(':id')
  async getHistoryById(
      @Param('id') id: string,
      @Res() res: Response
  ) {
    const history = await this.historyService.getHistoryById(id);

    return res.status(200).json({
      success: true,
      data: history,
      message: "record fetched successfully"
    })
  }
}
