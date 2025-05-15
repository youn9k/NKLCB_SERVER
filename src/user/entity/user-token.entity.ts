import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_token', database: 'main' })
export class UserTokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'int', nullable: false })
  userId: number;

  @Column({
    name: 'refresh_token',
    type: 'varchar',
    length: 191,
    nullable: false,
  })
  refreshToken: string;

  @Column({ name: 'created_at', type: 'bigint', nullable: false })
  createdAt: number;

  @Column({ name: 'deleted_at', type: 'bigint', nullable: true })
  deletedAt: number | null;

  @ManyToOne(() => UserEntity, (user) => user.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;
}
