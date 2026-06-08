import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserSubscription } from './user-subscription.entity';
@Entity('subscription_plans')
export class SubscriptionPlan {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', unique: true })
  name: string;
  @Column({ type: 'varchar', nullable: true })
  description: string;
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
  @Column({ type: 'varchar', default: 'MXN' })
  currency: string;
  @Column({ type: 'int', default: 10 })
  urlLimit: number;
  @Column({ type: 'boolean', default: false })
  analyticsEnabled: boolean;
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @OneToMany(() => UserSubscription, (sub) => sub.plan)
  subscriptions: UserSubscription[];
}
