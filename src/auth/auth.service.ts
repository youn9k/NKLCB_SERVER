import { Injectable } from '@nestjs/common';
import { OAuthLoginResponseDto } from './dto/oauth-login-response.dto';
import { OauthUserDto } from './dto/oauth-user.dto';
import { OauthAppleDto } from './dto/oauth-apple.dto';
import { HttpService } from '@nestjs/axios';
import { JwksClient } from 'jwks-rsa'
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OauthType } from './constant';
import { UserService } from 'src/user/user.service';
import { UserDto } from 'src/user/dto/user.dto';
import { DateTime } from 'luxon';
import { AccessTokenDto } from './dto/access-token.dto';
import { DecodedRefreshTokenDto } from './dto/decoded-refresh-token.dto';
import { BadRequestError } from 'src/common/error/bad-request.error';

@Injectable()
export class AuthService {
  private readonly jwksClient: JwksClient;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    this.jwksClient = new JwksClient({
      jwksUri: 'https://appleid.apple.com/auth/keys',
    });
  }

  async getOAuthUserData(
    provider: OauthType,
    token: string,
  ): Promise<OauthUserDto | null> {
    let prov = provider.toLowerCase();
    switch (prov) {
      case 'apple':
        return await this.getAppleOAuthUser(token);
      case 'naver':
        return null;
      default:
        throw new BadRequestError('not support provider');
    }
  }

  async login(oauthUser: OauthUserDto): Promise<OAuthLoginResponseDto> {
    let user: UserDto | null = null;
    user = await this.userService.findByIdentifier(
      oauthUser.identifier,
      true
    );
    
    // 일치하는 유저 정보가 없다면, 회원가입
    if (user == null) {
      user = await this.userService.create(oauthUser);
    }

    // 회원 탈퇴했던 유저라면, 계정복구
    if (user?.deletedAt != null) {
      await this.userService.restore(user.id);
    }
  
    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);
  
    await this.userService.insertRefreshToken(user.id, refreshToken);

    return {
      accessToken: accessToken,
      expiresIn: await this.getTokenExpirationTime(),
      refreshToken: refreshToken,
    };
  }

  async renewAccessToken(token: string): Promise<AccessTokenDto> {
    const decodedToken = await this.getDecodedRefreshToken(token);
    const isExist = await this.userService.isExistRefreshToken(token);

    if (!isExist) throw new BadRequestError('not exist token');

    const user = await this.userService.findByUserId(decodedToken.userId);
    const accessToken = await this.createAccessToken(user);

    return {
      token: accessToken,
      expiresIn: await this.getTokenExpirationTime(),
    };
  }


  async logout(token: string): Promise<void> {
    const isExist = await this.userService.isExistRefreshToken(token);
    if (!isExist) throw new BadRequestError('already not exist token');

    await this.userService.deleteRefreshToken(token);
  }

/***********************
 * 
 * 아래는 helper methods
 * 
 ************************/

  private async createAccessToken(user: UserDto): Promise<string> {
    return await this.jwtService.signAsync(
      {
        userId: user.id,
      },
      {
        secret: 
          this.configService.get<string>('jwt.accessTokenSecret'),
        expiresIn:
          this.configService.get<number>('jwt.accessTokenExpiresIn'),
      },
    );
  }

  private async createRefreshToken(user: UserDto): Promise<string> {
    return await this.jwtService.signAsync(
      {
        userId: user.id,
      },
      {
        secret: this.configService.get<string>('jwt.refreshTokenSecret'),
      },
    );
  }

  private async getAppleOAuthUser(token: string): Promise<OauthUserDto | null> {
    const header = this.headerDecode(token);

    const key = await this.jwksClient.getSigningKey(header['kid']);
    if (key == null) return null;

    const publicKey = key.getPublicKey();

    const profile = await this.jwtService.verifyAsync<OauthAppleDto>(token, {
      publicKey,
      algorithms: ['RS256'],
    });

    return {
      provider: 'apple',
      identifier: profile.sub,
      email: profile.email,
      name: this.configService.get<string>('user.defaultName') || 'default',
    };
  }

  private headerDecode(token: string): { [key: string]: string } {
    const header = token.split('.')[0];
    return JSON.parse(Buffer.from(header, 'base64').toString());
  }

  private async getTokenExpirationTime(): Promise<number> {
    const timezone = this.configService.get<string>('tz') ?? 'Asia/Seoul';
    const expiresIn = this.configService.get<number>('jwt.accessTokenExpiresIn') ?? 3600; // 1시간
  
    return DateTime.now()
      .setZone(timezone)
      .plus({ seconds: expiresIn })
      .toMillis() / 1000; // 초 단위로 변환
  }

  private async getDecodedRefreshToken(token: string): Promise<DecodedRefreshTokenDto> {
    try {
      return await this.jwtService.verifyAsync<DecodedRefreshTokenDto>(token, {
        secret: this.configService.get<string>('jwt.refreshTokenSecret'),
      });
    } catch (error) {
      throw new BadRequestError('invalid token');
    }
  }
}