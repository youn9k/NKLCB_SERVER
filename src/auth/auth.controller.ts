import { TypedBody } from '@nestia/core'
import { BadRequestException, Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OAuthLoginRequestDto } from './dto/oauth-login-request.dto';
import { OAuthLoginResponseDto } from './dto/oauth-login-response.dto';
import { AccessTokenDto } from './dto/access-token.dto';
import { Token } from './decorator/token.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
) {}

/**
 * 로그인
 * 
 * @param body OAuth provider ex) 'naver', token
 * @returns AccessToken, RefreshToken, AccessTokenExpiresIn
 */
  @Post('/login')
  async loginWithOAuth(
    @Body() body: OAuthLoginRequestDto
  ): Promise<OAuthLoginResponseDto> {
    const oauthUser = await this.authService.getOAuthUserData(
      body.provider,
      body.token
    );

    if (!oauthUser) {
      throw new UnauthorizedException('Invalid OAuth token or provider');
    }

    return this.authService.login(oauthUser);
  }

  @Post('/token')
  async renewAccessToken(
    @Token() token: string | null,
  ): Promise<AccessTokenDto> {
    if (token == null) throw new BadRequestException('token not found');
    
    return await this.authService.renewAccessToken(token);
  }

  @Post('/logout')
  async logout(
    @Token() token: string | null
  ): Promise<void> {
    if (token == null) throw new BadRequestException('token not found');

    await this.authService.logout(token);
  }  

}