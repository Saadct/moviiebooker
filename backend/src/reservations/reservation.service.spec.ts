// reservation.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './reservation.entity';
import { CreateReservationDto } from './create-reservation.dto';

// Mock de la repository
const mockReservationRepository = {
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
};

describe('ReservationService', () => {
  let service: ReservationService;
  let repository: Repository<Reservation>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: getRepositoryToken(Reservation),
          useValue: mockReservationRepository,
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    repository = module.get<Repository<Reservation>>(getRepositoryToken(Reservation));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isAvailable', () => {
    it('should return true if the slot is available', async () => {
      mockReservationRepository.find.mockResolvedValue([]);

      const result = await service.isAvailable('movie1', new Date());
      expect(result).toBe(true);
    });

    it('should return false if the slot is taken', async () => {
      mockReservationRepository.find.mockResolvedValue([
        {
          movieId: 'movie1',
          reservationDateTime: new Date('2025-02-06T14:00:00Z'),
        } as Reservation,
      ]);

      const result = await service.isAvailable('movie1', new Date('2025-02-06T15:00:00Z'));
      expect(result).toBe(false);
    });
  });

  describe('createReservation', () => {
    it('should create a new reservation if slot is available', async () => {
      mockReservationRepository.find.mockResolvedValue([]); 
      mockReservationRepository.create.mockReturnValue({
        movieId: 'movie1',
        userId: 'user1',
        movieName: 'Movie Name',
        reservationDateTime: new Date(),
      } as Reservation);
      mockReservationRepository.save.mockResolvedValue({} as Reservation);

      const createReservationDto: CreateReservationDto = {
        movieId: 'movie1',
        userId: 'user1',
        reservationDateTime: new Date().toISOString(),
        movieName: 'Movie Name',
      };

      const result = await service.createReservation(createReservationDto);
      expect(result.message).toBe('Réservation réussi');
    });

    it('should throw an error if slot is not available', async () => {
      mockReservationRepository.find.mockResolvedValue([
        {
          movieId: 'movie1',
          reservationDateTime: new Date('2025-02-06T14:00:00Z'),
        } as Reservation,
      ]);

      const createReservationDto: CreateReservationDto = {
        movieId: 'movie1',
        userId: 'user1',
        reservationDateTime: new Date('2025-02-06T15:00:00Z').toISOString(),
        movieName: 'Movie Name',
      };

      await expect(service.createReservation(createReservationDto))
        .rejects
        .toThrowError('Ce créneau est ddeja reserver. Veuillez choisir un autre horaire.');
    });
  });

  describe('getUserReservations', () => {
    it('should return an array of reservations for a user', async () => {
      mockReservationRepository.find.mockResolvedValue([
        { movieId: 'movie1', userId: 'user1', reservationDateTime: new Date() } as Reservation,
      ]);

      const result = await service.getUserReservations('user1');
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(1);
    });
  });

  describe('cancelReservation', () => {
    it('should cancel a reservation', async () => {
      mockReservationRepository.findOne.mockResolvedValue({ id: '1' } as Reservation);
      mockReservationRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.cancelReservation('1');
      expect(result).toBeTruthy();
    });

    it('should throw an error if reservation not found', async () => {
      mockReservationRepository.findOne.mockResolvedValue(null);

      await expect(service.cancelReservation('1'))
        .rejects
        .toThrowError('Reservation non trouvée');
    });
  });
});
