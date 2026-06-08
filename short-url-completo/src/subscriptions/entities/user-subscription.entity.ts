import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SubscriptionPlan } from './subscription-plan.entity';
import { PaymentHistory } from '../../payments/entities/payment-history.entity';
export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}
@Entity('user_subscriptions')
export class UserSubscription {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user) => user.subscriptions, { onDelete: 'CASCADE' })
  user: User;
  @ManyToOne(() => SubscriptionPlan, (plan) => plan.subscriptions)
  plan: SubscriptionPlan;
  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  status: SubscriptionStatus;
  @Column({ type: 'timestamp' })
  startsAt: Date;
  @Column({ type: 'timestamp', nullable: true })
  endsAt: Date;
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @OneToMany(() => PaymentHistory, (payment) => payment.subscription)
  payments: PaymentHistory[];
}
