import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SocialLoginEntity } from './social-login.entity';

@Entity({ name: 'user',database: 'main' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 191, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 191, nullable: true })
  email?: string | null;

  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  @Column({ name: 'created_at', type: 'bigint', nullable: false })
  createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint', nullable: false })
  updatedAt: number;

  @Column({ name: 'deleted_at', type: 'bigint', nullable: true })
  deletedAt?: number;

  @OneToOne(() => SocialLoginEntity, (socialLogin) => socialLogin.user, {
    cascade: true,
  })
  socialLogin: SocialLoginEntity;
}