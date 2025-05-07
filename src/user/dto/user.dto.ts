import { SocialLoginDto } from './social-login.dto';
import { UserEntity } from '../entity/user.entity';

export class UserDto {
  id: number;

  email?: string | null;

  name: string;

  createdAt: Date;

  updatedAt: Date;

  deletedAt?: Date;

  socialLogin: SocialLoginDto;

  static from(entity: UserEntity): UserDto {
    const dto = new UserDto();
    dto.id = entity.id;
    dto.email = entity.email;
    dto.name = entity.name;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    dto.deletedAt = entity.deletedAt;

    return dto;
  }
}
