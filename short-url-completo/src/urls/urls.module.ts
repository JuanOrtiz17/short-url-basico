import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { Url } from './entities/url.entity';
import { UrlVisit } from './entities/url-visit.entity';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Url, UrlVisit]),
    UsersModule,
    AuthModule,
    SubscriptionsModule,
  ],
  controllers: [UrlsController],
  providers: [UrlsService],
})
export class UrlsModule {}
