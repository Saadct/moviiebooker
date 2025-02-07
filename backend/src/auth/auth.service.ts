import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ email, password: hashedPassword });
    return await this.userRepository.save(user);
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Mot de passe incorrect');
    }
    const payload = { sub: user.id, email: user.email, role: user.role }; 
    const access_token = this.jwtService.sign(payload);
    console.log('JWT:', this.jwtService.decode(access_token));
    console.log(user);
    return { access_token, user_id: user.id };
  }
}
