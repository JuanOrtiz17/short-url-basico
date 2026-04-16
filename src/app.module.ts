import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { UrlsModule } from './urls/urls.module';
import { User } from './users/entities/user.entity';
import { Url } from './urls/entities/url.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),


    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get('DB_USER', 'postgres'),
        password: config.get('DB_PASS', 'postgres'),
        database: config.get('DB_NAME', 'url_shortener'),


        entities: [User, Url],


        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    UsersModule,
    UrlsModule,
  ],
})
export class AppModule {}
