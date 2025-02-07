import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Créer un compte utilisateur' })
  @ApiResponse({ status: 201, description: 'User créé avec succès' })
  @ApiBody({ type: AuthDto })
  async signup(@Body() body: AuthDto) {
    return this.authService.signup(body.email, body.password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Se connecter' })
  @ApiResponse({ status: 200, description: 'Connexion réussie' })
  @ApiBody({ type: AuthDto })
  async login(@Body() body: AuthDto) {
    return this.authService.login(body.email, body.password);
  }
}
