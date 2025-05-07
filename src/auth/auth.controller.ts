;import { Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OAuthLoginRequestDto } from './dto/oauth-login-request.dto';
import { OAuthLoginResponseDto } from './dto/oauth-login-response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
) {}

  // @Post('/login')
  // async loginWithOAuth(
  //   @TypedBody() body: OAuthLoginRequestDto
  // ): Promise<OAuthLoginResponseDto> {
  //   const oauthUser = await this.authService.getOAuthUserData(
  //     body.provider,
  //     body.token
  //   );

  //   if (!oauthUser) {
  //     throw new UnauthorizedException('Invalid OAuth token or provider');
  //   }

  //   return this.authService.login(oauthUser);
  // }
}