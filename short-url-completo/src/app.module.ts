import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { UrlsModule } from './urls/urls.module';
import { AuthModule } from './auth/auth.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { PaymentsModule } from './payments/payments.module';
import { User } from './users/entities/user.entity';
import { Url } from './urls/entities/url.entity';
import { UrlVisit } from './urls/entities/url-visit.entity';
import { SubscriptionPlan } from './subscriptions/entities/subscription-plan.entity';
import { UserSubscription } from './subscriptions/entities/user-subscription.entity';
import { PaymentHistory } from './payments/entities/payment-history.entity';
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
        entities: [User, Url, UrlVisit, SubscriptionPlan, UserSubscription, PaymentHistory],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    UrlsModule,
    SubscriptionsModule,
    PaymentsModule,
  ],
})
export class AppModule {}
