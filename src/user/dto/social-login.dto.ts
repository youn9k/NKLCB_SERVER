import { SocialLoginEntity } from '../entity/social-login.entity';
import { UserDto } from './user.dto';

export class SocialLoginDto {
  id: number;

  userId: number;

  provider: string;

  identifier: string;

  user?: UserDto;

  static from(entity: SocialLoginEntity): SocialLoginDto {
    const dto = new SocialLoginDto();
    dto.id = entity.id;
    dto.userId = entity.userId;
    dto.provider = entity.provider;
    dto.identifier = entity.identifier;
    if (entity.user) dto.user = UserDto.from(entity.user);

    return dto;
  }
}
