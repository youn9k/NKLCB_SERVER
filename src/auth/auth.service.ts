import { Injectable } from '@nestjs/common';
import { OAuthLoginResponseDto } from './dto/oauth-login-response.dto';
import { OauthUserDto } from './dto/oauth-user.dto';
import { JwksClient } from 'jwks-rsa'

@Injectable()
export class AuthService {
  private readonly jwksClient: JwksClient;

  constructor() {
    this.jwksClient = new JwksClient({
      jwksUri: 'https://appleid.apple.com/auth/keys',
    });
  }

  // async login(oauthUser: OauthUserDto): Promise<OAuthLoginResponseDto> {
  //   let user: OauthUserDto | null = null;
  //   try {
  //     user = await this.userService.findByIdentifier(
  //       oauthUser.identifier,
  //       true
  //     );
  //   } catch(e) {}
    
  //   if (user == null) {
  //     user = await this.userService.create(oauthUser);
  //   }

  //   if (null) { ... }
  
  
  // }
}