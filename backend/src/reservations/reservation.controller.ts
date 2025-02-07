import { Controller, Post, Get, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateReservationDto } from './create-reservation.dto';

@Controller('reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Roles('user')
  @Post()
  async createReservation(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.createReservation(createReservationDto);
  }

  @Roles('user')
  @Get(':id')
  async getUserReservations(@Param('id') id: string) {
    return await this.reservationService.getUserReservations(id);
  }

  @Roles('user')  
  @Delete(':id')
  async cancelReservation(@Param('id') id: string) {
    return await this.reservationService.cancelReservation(id);
  }
}
