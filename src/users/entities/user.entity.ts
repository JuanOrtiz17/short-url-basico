import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({ type: 'varchar' })
  password!: string;

  @Column({ type: 'boolean', default: false })
  isVerified!: boolean;

  @Column({ type: 'varchar', nullable: true })
  verificationCode!: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;
}