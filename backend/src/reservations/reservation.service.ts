import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './reservation.entity';
import { CreateReservationDto } from './create-reservation.dto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>
  ) {}

  async isAvailable(movieId: string, reservationTime: Date): Promise<boolean> {
    const existingReservations = await this.reservationRepository.find({
      where: {
        movieId, 
      },
    });
  
    for (const reservation of existingReservations) {
      const existingReservationTime = new Date(reservation.reservationDateTime);
      const existingEndTime = new Date(existingReservationTime.getTime() + 2 * 60 * 60 * 1000); 
      if (
        (reservationTime >= existingReservationTime && reservationTime < existingEndTime) ||
        (reservationTime < existingEndTime && reservationTime >= existingReservationTime)
      ) {
        return false;
      }
    }
    return true; 
  }

  async createReservation(createReservationDto: CreateReservationDto) {
    const { movieId, userId, reservationDateTime, movieName } = createReservationDto;   
    const reservationTime = new Date(reservationDateTime);
    const isAvailable = await this.isAvailable(movieId, reservationTime);
    if (!isAvailable) {
        throw new Error('Ce créneau est ddeja reserver. Veuillez choisir un autre horaire.');
    }

    const reservation = this.reservationRepository.create({
      movieId,
      movieName,
      userId,
      reservationDateTime: reservationDateTime,
    });

    await this.reservationRepository.save(reservation);
    return { message: 'Réservation réussi', movieId, movieName, userId, reservationDateTime };
    }

    async getUserReservations(userId: string) {
        return await this.reservationRepository.find({ where: { userId } });
    }
    
    async cancelReservation(reservationId: string) {
    const reservation = await this.reservationRepository.findOne({
        where: { id: reservationId },
    });

    if (!reservation) {
        throw new Error('Reservation non trouvée');
    }

    return await this.reservationRepository.delete(reservation);
    }
}

