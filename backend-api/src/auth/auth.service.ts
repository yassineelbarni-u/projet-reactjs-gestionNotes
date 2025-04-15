import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    try {
      const existingUser = await this.userRepo.findOne({ where: { email } });

      if (existingUser) {
        throw new ConflictException('Un utilisateur avec cet email existe déjà.');
      }

      const hashed = await bcrypt.hash(password, 10);
      const user = this.userRepo.create({ email, password: hashed });
      return await this.userRepo.save(user);
    } catch (err) {
      console.error('Erreur dans AuthService.register :', err);
      throw new InternalServerErrorException('Erreur lors de la création de l’utilisateur.');
    }
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Identifiants invalides');
    }

    const token = this.jwtService.sign({ userId: user.id, email: user.email });
    return { token };
  }
}