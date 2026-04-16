import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyDto } from './dto/verify.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  // ─────────────────────────────────────────────
  // REGISTRO
  // ─────────────────────────────────────────────
  async register(dto: RegisterDto) {

    const exists = await this.usersRepo.findOne({
      where: { email: dto.email },
    });
    if (exists) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();


    const user = this.usersRepo.create({
      email: dto.email,
      password: hashedPassword,
      verificationCode,
    });

    await this.usersRepo.save(user);

    return {
      message: 'Usuario registrado. Verifica tu cuenta con el código.',
      verificationCode, 
    };
  }

  // ─────────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────────
  async login(dto: LoginDto) {
    const user = await this.usersRepo.findOne({
      where: { email: dto.email },
    });
    if (!user) {

      throw new UnauthorizedException('Credenciales inválidas');
    }


    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

  
    if (!user.isVerified) {
      throw new UnauthorizedException('Debes verificar tu cuenta primero');
    }

    return { message: 'Usuario válido', userId: user.id };
  }

  // ─────────────────────────────────────────────
  // VERIFICACIÓN
  // ─────────────────────────────────────────────
  async verify(dto: VerifyDto) {
    const user = await this.usersRepo.findOne({
      where: { email: dto.email },
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

   
    if (user.verificationCode !== dto.code) {
  
      throw new BadRequestException('Código de verificación incorrecto');
    }

    user.isVerified = true;
    user.verificationCode = null;
    await this.usersRepo.save(user);

    return { message: 'Cuenta verificada exitosamente' };
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }
}
