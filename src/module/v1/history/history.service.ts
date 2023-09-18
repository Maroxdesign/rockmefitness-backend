import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { History, HistoryDocument } from './schema/history.schema';
import { Model } from 'mongoose';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { HistoryQueryDto } from './dto/history-query.dto';

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel(History.name) private historyModel: Model<HistoryDocument>,
  ) {}

  async createHistory(userId: string, payload: CreateHistoryDto) {
    return await this.historyModel.create({
      ...payload,
      userId,
    });
  }

  async getUserHistory(userId: string, query?: HistoryQueryDto) {
    let { page, limit } = query;

    page = Number(page) ? Number(page) : 1;
    limit = Number(limit) ? Number(limit) : 10;

    const [result, count] = await Promise.all([
      this.historyModel
        .find({
          userId,
        })
        .skip(limit * (page - 1))
        .limit(limit)
        .sort({
          createdAt: -1,
        }),

      this.historyModel.countDocuments({
        userId,
      }),
    ]);

    return {
      data: result,
      pagination: {
        total: count,
        page,
        limit,
      },
    };
  }

  async getHistoryById(id: string) {
    return this.historyModel.findOne({
      _id: id,
    });
  }

  async updateHistoryById(id: string, payload: UpdateHistoryDto) {
    const { status } = payload;

    await this.historyModel.updateOne(
      { _id: id },
      {
        status,
      },
    );
  }

  async updateHistoryByOrderId(orderId: string, payload: UpdateHistoryDto) {
    const { status } = payload;

    console.log('orderId', orderId);
    console.log('payloaod', payload);

    await this.historyModel.updateOne(
      {
        orderId,
      },
      {
        status,
      },
    );
  }
}
