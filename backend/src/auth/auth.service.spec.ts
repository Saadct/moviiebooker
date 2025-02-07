import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword123',
    role: 'user'
  };

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn()
  };

  const mockJwtService = {
    sign: jest.fn(),
    decode: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    const signupData = {
      email: 'test@example.com',
      password: 'Password123!'
    };

    it('devrait créer un nouvel utilisateur avec succès', async () => {
      const hashedPassword = await bcrypt.hash(signupData.password, 10);
      mockUserRepository.create.mockReturnValue({
        ...mockUser,
        password: hashedPassword
      });
      mockUserRepository.save.mockResolvedValue({
        id: 1,
        email: signupData.email,
        password: hashedPassword
      });

      const result = await service.signup(signupData.email, signupData.password);

      expect(result).toBeDefined();
      expect(result.email).toBe(signupData.email);
      expect(result.password).not.toBe(signupData.password);
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('devrait hasher le mot de passe avant de sauvegarder', async () => {
      mockUserRepository.create.mockImplementation(dto => dto);
      mockUserRepository.save.mockImplementation(user => user);

      const result = await service.signup(signupData.email, signupData.password);

      expect(result.password).not.toBe(signupData.password);
      expect(await bcrypt.compare(signupData.password, result.password)).toBe(true);
    });

    it('devrait gérer les erreurs de création d\'utilisateur', async () => {
      mockUserRepository.save.mockRejectedValue(new Error('Erreur de base de données'));

      await expect(
        service.signup(signupData.email, signupData.password)
      ).rejects.toThrow('Erreur de base de données');
    });
  });

  describe('login', () => {
    const loginData = {
      email: 'test@example.com',
      password: 'Password123!'
    };

    it('devrait connecter un utilisateur avec succès', async () => {
      const hashedPassword = await bcrypt.hash(loginData.password, 10);
      mockUserRepository.findOne.mockResolvedValue({
        ...mockUser,
        password: hashedPassword
      });
      mockJwtService.sign.mockReturnValue('jwt_token');
      mockJwtService.decode.mockReturnValue({
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role
      });

      const result = await service.login(loginData.email, loginData.password);

      expect(result).toBeDefined();
      expect(result.access_token).toBe('jwt_token');
      expect(result.user_id).toBe(mockUser.id);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginData.email }
      });
    });

    it('devrait rejeter un utilisateur non trouvé', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.login(loginData.email, loginData.password)
      ).rejects.toThrow('Utilisateur non trouvé');
    });

    it('devrait rejeter un mot de passe incorrect', async () => {
      const hashedPassword = await bcrypt.hash('different_password', 10);
      mockUserRepository.findOne.mockResolvedValue({
        ...mockUser,
        password: hashedPassword
      });

      await expect(
        service.login(loginData.email, loginData.password)
      ).rejects.toThrow('Mot de passe incorrect');
    });

    it('devrait générer un token JWT valide', async () => {
      const hashedPassword = await bcrypt.hash(loginData.password, 10);
      mockUserRepository.findOne.mockResolvedValue({
        ...mockUser,
        password: hashedPassword
      });
      mockJwtService.sign.mockReturnValue('jwt_token');

      const result = await service.login(loginData.email, loginData.password);

      expect(result.access_token).toBeDefined();
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role
      });
    });
  });

  describe('Gestion des erreurs', () => {
    it('devrait gérer les erreurs de base de données', async () => {
      mockUserRepository.findOne.mockRejectedValue(new Error('Erreur de base de données'));

      await expect(
        service.login('test@example.com', 'password')
      ).rejects.toThrow();
    });

    it('devrait gérer les erreurs de JWT', async () => {
      const hashedPassword = await bcrypt.hash('password', 10);
      mockUserRepository.findOne.mockResolvedValue({
        ...mockUser,
        password: hashedPassword
      });
      mockJwtService.sign.mockImplementation(() => {
        throw new Error('Erreur JWT');
      });

      await expect(
        service.login('test@example.com', 'password')
      ).rejects.toThrow();
    });
  });
});