export class OauthAppleDto {
  iss: string;
  sub: string;
  aud: string;
  iat: number;
  exp: number;
  nonce: string;
  nonce_supported: boolean;
  email: string;
  email_verified: boolean;
  is_private_email: boolean;
}
