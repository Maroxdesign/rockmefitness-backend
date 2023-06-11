import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket } from './schema/ticket.schema';
import { Model } from 'mongoose';

@Injectable()
export class SupportService {
  constructor(@InjectModel(Ticket.name) private ticketModel: Model<Ticket>) {}

  async createTicket(userId: string) {
    try {
      const ticket = await this.ticketModel.create({ userId });
      return ticket;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getAllTickets() {
    return await this.ticketModel.find();
  }

  async getTicketById(ticketId: string) {
    return await this.ticketModel.findById(ticketId);
  }

  async getUserTickets(userId: string, status?: string) {
    if (!status) {
      return await this.ticketModel.find({ userId });
    } else {
      return await this.ticketModel.find({ userId, status });
    }
  }

  async updateTicketStatus(ticketId: string, status: string) {
    try {
      const result = await this.ticketModel.findByIdAndUpdate(
        ticketId,
        { status },
        { new: true },
      );

      if (!result) throw new InternalServerErrorException('Ticket not found');

      return result;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async addMessage(ticketId: string, content: string, senderId: string) {
    try {
      const result = await this.ticketModel.findByIdAndUpdate(
        ticketId,
        {$push: {messages: {content, senderId}}},
        {new: true}
      )

      if (!result) throw new InternalServerErrorException('Ticket not found');

      return result;
      
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
