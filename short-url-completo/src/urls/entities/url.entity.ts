import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { UrlVisit } from './url-visit.entity';
@Entity('urls')
export class Url {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar' })
  originalUrl: string;
  @Column({ type: 'varchar', unique: true })
  shortCode: string;
  @Column({ type: 'boolean', default: true })
  isActive: boolean;
  @Column({ type: 'int', default: 0 })
  visits: number;
  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date | null;
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
  @ManyToOne(() => User, (user) => user.urls, { onDelete: 'CASCADE' })
  user: User;
  @OneToMany(() => UrlVisit, (visit) => visit.url)
  urlVisits: UrlVisit[];
}
