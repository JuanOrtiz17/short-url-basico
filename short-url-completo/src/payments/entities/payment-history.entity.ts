import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { UserSubscription } from '../../subscriptions/entities/user-subscription.entity';
export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}
@Entity('payment_history')
export class PaymentHistory {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user) => user.payments, { onDelete: 'CASCADE' })
  user: User;
  @ManyToOne(() => UserSubscription, (sub) => sub.payments, { nullable: true })
  subscription: UserSubscription;
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;
  @Column({ type: 'varchar', default: 'MXN' })
  currency: string;
  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;
  @Column({ type: 'varchar', nullable: true })
  paymentMethod: string;
  @Column({ type: 'varchar', unique: true, nullable: true })
  transactionId: string;
  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
