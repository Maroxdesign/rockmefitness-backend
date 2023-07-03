import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { SupportService } from './support.service';
import { Request, Response } from 'express';
import {
  ILoggedInUser,
  LoggedInUser,
} from 'src/common/decorator/user.decorator';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { AddMessageDto } from './dto/add-message.dto';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('create-ticket')
  async createTicket(
    @LoggedInUser() user: ILoggedInUser,
    @Res() res: Response,
  ) {
    const result = await this.supportService.createTicket(user._id);

    return res.status(201).json({
      success: true,
      data: result,
      message: 'Ticket created successfully',
    });
  }

  @Get('user-tickets')
  async getUserTickets(
    @LoggedInUser() user: ILoggedInUser,
    @Res() res: Response,
    @Query('status') status?: string,
  ) {
    const tickets = await this.supportService.getUserTickets(user._id, status);

    return res.status(200).json({
      success: true,
      data: tickets,
      message: 'Tickets fetched successfully',
    });
  }

  @Get('ticket/:ticketId')
  async getTicketById(
    @Param('ticketId') ticketId: string,
    @Res() res: Response,
  ) {
    const ticket = await this.supportService.getTicketById(ticketId);

    return res.status(200).json({
      success: true,
      data: ticket,
      message: 'Ticket fetched successfully',
    });
  }

  @Put(':ticketId/status')
  async updateTicketStatus(
    @Param('ticketId') ticketId: string,
    @Body() payload: UpdateTicketStatusDto,
    @Res() res: Response,
  ) {
    const result = await this.supportService.updateTicketStatus(
      ticketId,
      payload.status,
    );

    return res.status(200).json({
      success: true,
      data: result,
      message: 'Ticket status updated successfully',
    });
  }

  @Put(':ticketId/add-message')
  async addMessage(
    @Param('ticketId') ticketId: string,
    @Body() payload: AddMessageDto,
    @LoggedInUser() user: ILoggedInUser,
    @Res() res: Response,
  ) {
    const response = await this.supportService.addMessage(
      ticketId,
      payload.content,
      user._id,
    );

    return res.status(200).json({
      success: true,
      data: response,
      message: 'Message added successfully',
    });
  }
}
