import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({ example: 'user@example.com', description: 'L\'adresse email de l\'utilisateur' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Le mot de passe de l\'utilisateur' })
  password: string;
}
