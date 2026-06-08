import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentHistory } from './entities/payment-history.entity';
@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentHistory)
    private readonly paymentsRepo: Repository<PaymentHistory>,
  ) {}
  async getMyPayments(userId: number): Promise<PaymentHistory[]> {
    return this.paymentsRepo.find({
      where: { user: { id: userId } },
      relations: ['subscription', 'subscription.plan'],
      order: { createdAt: 'DESC' },
    });
  }
}
