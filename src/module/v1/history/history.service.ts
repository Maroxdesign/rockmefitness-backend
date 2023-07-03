import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {History, HistoryDocument} from "./schema/history.schema";
import {Model} from "mongoose";
import {CreateHistoryDto} from "./dto/create-history.dto";
import {UpdateHistoryDto} from "./dto/update-history.dto";

@Injectable()
export class HistoryService {
    constructor(@InjectModel(History.name) private historyModel: Model<HistoryDocument>) {
    }

    async createHistory(userId: string, payload: CreateHistoryDto) {
        return await this.historyModel.create({
            ...payload,
            userId
        })
    }

    async getUserHistory(userId: string) {
        return this.historyModel.find({
            userId
        }).sort({
            createdAt: -1
        })
    }

    async getHistoryById(id: string) {
        return this.historyModel.findOne({
            _id: id
        });
    }

    async updateHistoryById(id: string, payload: UpdateHistoryDto) {
        const { status } = payload

        await this.historyModel.updateOne({_id: id}, {
            status
        })
    }

    async updateHistoryByOrderId(orderId: string, payload: UpdateHistoryDto) {
        const { status } = payload;

        console.log('orderId', orderId);
        console.log('payloaod', payload)

        await this.historyModel.updateOne({
            orderId
        }, {
            status
        })
    }
}
