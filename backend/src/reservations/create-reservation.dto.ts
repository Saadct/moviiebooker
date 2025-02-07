import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDateString, IsInt, Min, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class CreateReservationDto {
  @ApiProperty({ example: '939243', description: 'L\'id du film' })
  @IsUUID()
  @IsNotEmpty()
  movieId: string;

  @ApiProperty({ example: 'Sonic', description: 'L\'id du film' })
  @IsNotEmpty()
  movieName: string;

  @ApiProperty({ example: '1', description: 'L\'id de lutilisateur' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;  

  @ApiProperty({
    example: '2025-02-06T14:30:00.000Z', 
    description: "La date et l'heure de la réservation",
  })
  @IsDateString()
  @IsNotEmpty()
  reservationDateTime: string; 

}
