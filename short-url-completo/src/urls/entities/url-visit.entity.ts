import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Url } from './url.entity';
@Entity('url_visits')
export class UrlVisit {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Url, (url) => url.urlVisits, { onDelete: 'CASCADE' })
  url: Url;
  @Column({ type: 'varchar', nullable: true })
  ipAddress: string;
  @Column({ type: 'varchar', nullable: true })
  userAgent: string;
  @Column({ type: 'varchar', nullable: true })
  referrer: string;
  @Column({ type: 'varchar', nullable: true })
  country: string;
  @CreateDateColumn({ type: 'timestamp' })
  visitedAt: Date;
}
