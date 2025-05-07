import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

export type SocialProvider = 'apple' | 'naver';

@Entity({ name: 'social_login', database: 'main' })
export class SocialLoginEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // 'apple', 'naver' 등
  @Column({ type: 'varchar', length: 50 })
  provider: SocialProvider;

  // Apple의 경우: sub, Naver의 경우: id 등 고유 식별자
  @Column({ type: 'varchar', length: 191, unique: true })
  identifier: string;

  @OneToOne(() => UserEntity, (user) => user.socialLogin, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;
}