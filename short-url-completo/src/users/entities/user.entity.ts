import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserSubscription } from '../../subscriptions/entities/user-subscription.entity';
import { PaymentHistory } from '../../payments/entities/payment-history.entity';
import { Url } from '../../urls/entities/url.entity';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', unique: true })
  email: string;
  @Column({ type: 'varchar' })
  password: string;
  @Column({ type: 'boolean', default: false })
  isVerified: boolean;
  @Column({ type: 'varchar', nullable: true })
  verificationCode: string | null;
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
  @OneToMany(() => UserSubscription, (sub) => sub.user)
  subscriptions: UserSubscription[];
  @OneToMany(() => PaymentHistory, (payment) => payment.user)
  payments: PaymentHistory[];
  @OneToMany(() => Url, (url) => url.user)
  urls: Url[];
}
