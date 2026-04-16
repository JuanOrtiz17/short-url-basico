import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './entities/url.entity';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Url]),

    UsersModule,
  ],
  controllers: [UrlsController],
  providers: [UrlsService],
})
export class UrlsModule {}
