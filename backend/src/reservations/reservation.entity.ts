import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/users/user.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  movieId: string;

  @Column()
  movieName: string;

  @Column()
  userId: string;

  @Column()
  reservationDateTime: Date; 

  @Column({ default: false })
  canceled: boolean;
}
