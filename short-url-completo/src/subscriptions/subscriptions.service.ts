import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import {
  UserSubscription,
  SubscriptionStatus,
} from './entities/user-subscription.entity';
import { UsersService } from '../users/users.service';
import { PaymentHistory, PaymentStatus } from '../payments/entities/payment-history.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private readonly plansRepo: Repository<SubscriptionPlan>,
    @InjectRepository(UserSubscription)
    private readonly subsRepo: Repository<UserSubscription>,
    @InjectRepository(PaymentHistory)
    private readonly paymentsRepo: Repository<PaymentHistory>,
    private readonly usersService: UsersService,
  ) {}
  async getPlans(): Promise<SubscriptionPlan[]> {
    return this.plansRepo.find({ order: { price: 'ASC' } });
  }
  async createPlan(data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    const plan = this.plansRepo.create(data);
    return this.plansRepo.save(plan);
  }
  async subscribe(userId: number, dto: CreateSubscriptionDto): Promise<UserSubscription> {
    const user = await this.usersService.findById(userId);
    const plan = await this.plansRepo.findOne({ where: { id: dto.planId } });
    if (!plan) throw new NotFoundException('Plan no encontrado');
    await this.subsRepo.update(
      { user: { id: userId }, status: SubscriptionStatus.ACTIVE },
      { status: SubscriptionStatus.CANCELLED },
    );
    const startsAt = new Date();
    const endsAt = new Date();
    endsAt.setMonth(endsAt.getMonth() + 1);
    const sub = this.subsRepo.create({
      user,
      plan,
      status: SubscriptionStatus.ACTIVE,
      startsAt,
      endsAt,
    });
    const savedSub = await this.subsRepo.save(sub);
    const payment = this.paymentsRepo.create({
      user,
      subscription: savedSub,
      amount: plan.price,
      currency: plan.currency,
      status: PaymentStatus.COMPLETED,
      paymentMethod: dto.paymentMethod ?? 'card',
      transactionId: `TXN-${Date.now()}-${userId}`,
      paidAt: new Date(),
    });
    await this.paymentsRepo.save(payment);
    return savedSub;
  }
  async getActiveSubscription(userId: number): Promise<UserSubscription | null> {
    return this.subsRepo.findOne({
      where: { user: { id: userId }, status: SubscriptionStatus.ACTIVE },
      relations: ['plan'],
      order: { createdAt: 'DESC' },
    });
  }
  async getUserSubscriptions(userId: number): Promise<UserSubscription[]> {
    return this.subsRepo.find({
      where: { user: { id: userId } },
      relations: ['plan'],
      order: { createdAt: 'DESC' },
    });
  }
  async cancel(userId: number, subscriptionId: number) {
    const sub = await this.subsRepo.findOne({
      where: { id: subscriptionId },
      relations: ['user'],
    });
    if (!sub) throw new NotFoundException('Suscripción no encontrada');
    if (sub.user.id !== userId) throw new ForbiddenException();
    sub.status = SubscriptionStatus.CANCELLED;
    await this.subsRepo.save(sub);
    return { message: 'Suscripción cancelada' };
  }
  async getUrlLimit(userId: number): Promise<number> {
    const sub = await this.getActiveSubscription(userId);
    return sub?.plan?.urlLimit ?? 5; 
  }
}
