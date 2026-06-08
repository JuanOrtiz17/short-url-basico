import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { nanoid } from 'nanoid';
import { Url } from './entities/url.entity';
import { UrlVisit } from './entities/url-visit.entity';
import { UsersService } from '../users/users.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { CreateUrlDto } from './dto/create-url.dto';
@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(Url)
    private readonly urlsRepo: Repository<Url>,
    @InjectRepository(UrlVisit)
    private readonly visitsRepo: Repository<UrlVisit>,
    private readonly usersService: UsersService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}
  private async generateUniqueCode(): Promise<string> {
    let code: string;
    let attempts = 0;
    do {
      code = nanoid(8);
      attempts++;
      if (attempts > 10)
        throw new BadRequestException('No se pudo generar un código único. Intenta de nuevo.');
      const existing = await this.urlsRepo.findOne({ where: { shortCode: code } });
      if (!existing) break;
    } while (true);
    return code;
  }
  async createUrl(userId: number, dto: CreateUrlDto) {
    const user = await this.usersService.findById(userId);
    const limit = await this.subscriptionsService.getUrlLimit(userId);
    const count = await this.urlsRepo.count({ where: { user: { id: userId } } });
    if (count >= limit) {
      throw new ForbiddenException(
        `Has alcanzado el límite de ${limit} URLs de tu plan. Actualiza tu suscripción.`,
      );
    }
    const shortCode = await this.generateUniqueCode();
    const url = this.urlsRepo.create({
      originalUrl: dto.originalUrl,
      shortCode,
      user,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
    });
    await this.urlsRepo.save(url);
    return {
      id: url.id,
      originalUrl: url.originalUrl,
      shortUrl: `/url/${shortCode}`,
      shortCode,
      expiresAt: url.expiresAt,
    };
  }
  async findByShortCode(shortCode: string, req?: Request): Promise<Url> {
    const url = await this.urlsRepo.findOne({
      where: { shortCode },
      relations: ['user'],
    });
    if (!url) throw new NotFoundException('URL no encontrada');
    if (!url.isActive) throw new BadRequestException('Esta URL ha sido desactivada');
    if (url.expiresAt && url.expiresAt < new Date()) {
      throw new BadRequestException('Esta URL ha expirado');
    }
    url.visits += 1;
    await this.urlsRepo.save(url);
    if (url.user) {
      const sub = await this.subscriptionsService.getActiveSubscription(url.user.id);
      if (sub?.plan?.analyticsEnabled) {
        const visit = this.visitsRepo.create({
          url,
          ipAddress: req?.ip ?? null,
          userAgent: req?.headers['user-agent'] ?? null,
          referrer: req?.headers['referer'] ?? null,
        });
        await this.visitsRepo.save(visit);
      }
    }
    return url;
  }
  async getMyUrls(userId: number): Promise<Url[]> {
    return this.urlsRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }
  async getUrlStats(userId: number, urlId: number) {
    const url = await this.urlsRepo.findOne({
      where: { id: urlId, user: { id: userId } },
    });
    if (!url) throw new NotFoundException('URL no encontrada');
    const sub = await this.subscriptionsService.getActiveSubscription(userId);
    if (!sub?.plan?.analyticsEnabled) {
      return { id: url.id, shortCode: url.shortCode, visits: url.visits };
    }
    const visits = await this.visitsRepo.find({
      where: { url: { id: urlId } },
      order: { visitedAt: 'DESC' },
      take: 100,
    });
    return { id: url.id, shortCode: url.shortCode, visits: url.visits, details: visits };
  }
  async deactivate(userId: number, id: number) {
    const url = await this.urlsRepo.findOne({ where: { id }, relations: ['user'] });
    if (!url) throw new NotFoundException('URL no encontrada');
    if (url.user.id !== userId) throw new ForbiddenException();
    url.isActive = false;
    await this.urlsRepo.save(url);
    return { message: 'URL desactivada', id: url.id };
  }
  async activate(userId: number, id: number) {
    const url = await this.urlsRepo.findOne({ where: { id }, relations: ['user'] });
    if (!url) throw new NotFoundException('URL no encontrada');
    if (url.user.id !== userId) throw new ForbiddenException();
    url.isActive = true;
    await this.urlsRepo.save(url);
    return { message: 'URL activada', id: url.id };
  }
  async deleteUrl(userId: number, id: number) {
    const url = await this.urlsRepo.findOne({ where: { id }, relations: ['user'] });
    if (!url) throw new NotFoundException('URL no encontrada');
    if (url.user.id !== userId) throw new ForbiddenException();
    await this.urlsRepo.remove(url);
    return { message: 'URL eliminada', id };
  }
}
