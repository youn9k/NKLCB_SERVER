import { OauthType } from '../constant';

export class OauthUserDto {
  provider: OauthType;
  identifier: string;
  email?: string;
  name: string;
}
