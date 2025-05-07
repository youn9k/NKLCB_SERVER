import { OauthType } from '../constant';

export class OAuthLoginRequestDto {
  provider: OauthType;
  token: string;
}
