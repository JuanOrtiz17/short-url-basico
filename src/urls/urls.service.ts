import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { nanoid } from 'nanoid';
import { Url } from './entities/url.entity';
import { UsersService } from '../users/users.service';
import { CreateUrlDto } from './dto/create-url.dto';

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(Url)
    private readonly urlsRepo: Repository<Url>,
    // Importamos UsersService para buscar el usuario por email
    private readonly usersService: UsersService,
  ) {}

  private async generateUniqueCode(): Promise<string> {
    let code: string;
    let attempts = 0;

    do {
      code = nanoid(8); 
      attempts++;

      if (attempts > 10) {
        throw new BadRequestException(
          'No se pudo generar un código único. Intenta de nuevo.',
        );
      }

      const existing = await this.urlsRepo.findOne({
        where: { shortCode: code },
      });

      if (!existing) break;


    } while (true);

    return code;
  }

  async createUrl(dto: CreateUrlDto) {
    const user = await this.usersService.findByEmail(dto.email);

    const shortCode = await this.generateUniqueCode();

    const url = this.urlsRepo.create({
      originalUrl: dto.originalUrl,
      shortCode,
      user,
    });

    await this.urlsRepo.save(url);

    return {
      id: url.id,
      originalUrl: url.originalUrl,
      shortUrl: `/url/${shortCode}`, 
      shortCode,
    };
  }

  async findByShortCode(shortCode: string): Promise<Url> {
    const url = await this.urlsRepo.findOne({ where: { shortCode } });

    if (!url) {
      throw new NotFoundException('URL no encontrada');
    }

    if (!url.isActive) {
      throw new BadRequestException('Esta URL ha sido desactivada');
    }

    url.visits += 1;
    await this.urlsRepo.save(url);

    return url;
  }

  // ─────────────────────────────────────────────
  // DESACTIVAR URL
  // ─────────────────────────────────────────────
  async deactivate(id: number) {
    const url = await this.urlsRepo.findOne({ where: { id } });
    if (!url) throw new NotFoundException('URL no encontrada');

    url.isActive = false;
    await this.urlsRepo.save(url);

    return { message: 'URL desactivada', id: url.id };
  }

  // ─────────────────────────────────────────────
  // ACTIVAR URL
  // ─────────────────────────────────────────────
  async activate(id: number) {
    const url = await this.urlsRepo.findOne({ where: { id } });
    if (!url) throw new NotFoundException('URL no encontrada');

    url.isActive = true;
    await this.urlsRepo.save(url);

    return { message: 'URL activada', id: url.id };
  }
}
