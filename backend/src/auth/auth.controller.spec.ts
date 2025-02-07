import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signup: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    const signupDto: AuthDto = {
      email: 'test@example.com',
      password: 'Password123!',
    };

    it('devrait créer un nouvel utilisateur avec succès', async () => {
      const expectedResponse = {
        id: 1,
        email: signupDto.email,
        createdAt: new Date(),
      };
      mockAuthService.signup.mockResolvedValue(expectedResponse);

      const result = await controller.signup(signupDto);

      expect(result).toEqual(expectedResponse);
      expect(authService.signup).toHaveBeenCalledWith(
        signupDto.email,
        signupDto.password
      );
    });

    it('devrait rejeter un email invalide', async () => {
      const invalidDto: AuthDto = {
        email: 'invalid-email',
        password: 'Password123!',
      };
      mockAuthService.signup.mockRejectedValue(
        new BadRequestException('Email invalide')
      );

      await expect(controller.signup(invalidDto)).rejects.toThrow(
        BadRequestException
      );
    });

    it('devrait rejeter un email déjà utilisé', async () => {
      mockAuthService.signup.mockRejectedValue(
        new ConflictException('Email déjà utilisé')
      );

      await expect(controller.signup(signupDto)).rejects.toThrow(
        ConflictException
      );
    });

    it('devrait rejeter un mot de passe trop faible', async () => {
      const weakPasswordDto: AuthDto = {
        email: 'test@example.com',
        password: '123',
      };
      mockAuthService.signup.mockRejectedValue(
        new BadRequestException('Mot de passe trop faible')
      );

      await expect(controller.signup(weakPasswordDto)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('login', () => {
    const loginDto: AuthDto = {
      email: 'test@example.com',
      password: 'Password123!',
    };

    it('devrait connecter un utilisateur avec succès', async () => {
      const expectedResponse = {
        access_token: 'jwt_token_example',
        user: {
          id: 1,
          email: loginDto.email,
        },
      };
      mockAuthService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(loginDto);

      expect(result).toEqual(expectedResponse);
      expect(authService.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password
      );
    });

    it('devrait rejeter des identifiants invalides', async () => {
      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException('Identifiants invalides')
      );

      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('devrait rejeter un compte non vérifié', async () => {
      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException('Compte non vérifié')
      );

      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('devrait rejeter un compte bloqué', async () => {
      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException('Compte bloqué')
      );

      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe('Validation DTO', () => {
    it('devrait valider le format email', async () => {
      const invalidEmailDto: AuthDto = {
        email: 'not-an-email',
        password: 'Password123!',
      };

      await expect(controller.signup(invalidEmailDto)).rejects.toThrow();
    });

    it('devrait valider la longueur minimale du mot de passe', async () => {
      const shortPasswordDto: AuthDto = {
        email: 'test@example.com',
        password: '123',
      };

      await expect(controller.signup(shortPasswordDto)).rejects.toThrow();
    });
  });
});