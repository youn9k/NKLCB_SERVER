import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, IsNull, QueryRunner } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { SocialLoginEntity } from './entity/social-login.entity';
import { ConfigService } from '@nestjs/config';
import { CustomError, EntityNotFoundError } from 'src/common/error';
import { UserDto } from './dto/user.dto';
import { OauthUserDto } from 'src/auth/dto/oauth-user.dto';
import { DateTime } from 'luxon';
import { InternalServerError } from 'src/common/error/internal-server.error';
import { UserTokenEntity } from './entity/user-token.entity';
import { hash } from 'argon2';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(UserTokenEntity)
    private readonly userTokenRepository: Repository<UserTokenEntity>,

    private readonly configService: ConfigService,
  ) {}

  async create(user: OauthUserDto): Promise<UserDto | null> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
        const userId = await this.insert({
            provider: user.provider,
            identifier: user.identifier,
            name: user.name,
            email: user.email
        },
        qr
    );
    await qr.commitTransaction();
    } catch(error) {
        await qr.rollbackTransaction();

        if (error instanceof Error) {
            this.logger.error(error.message, error.stack);
        } else {
            this.logger.error(error);
        }
        throw new InternalServerError('failed to create user');
    } finally {
        await qr.release();
    }

    return await this.findByIdentifier(user.identifier);
  }

  async insert(
    data: OauthUserDto,
    queryRunner?: QueryRunner,
  ): Promise<number> {
    const now = DateTime.now()
      .setZone(this.configService.get<string>('tz') ?? 'Asia/Seoul')
      .toMillis(); // UNIX timestamp ex) '1256953732'

    let userId: number | null = null;

    const qr = queryRunner ?? this.dataSource.createQueryRunner();
    if (queryRunner == null) {
      await qr.connect();
      await qr.startTransaction();
    }
    try {
      const result = await qr.manager.insert(UserEntity, {
        name: data.name,
        email: data.email,
        createdAt: now,
        updatedAt: now,
      });

      userId = result.identifiers[0].id;
      if (userId == null) throw new CustomError('failed to get user id');

      await qr.manager.insert(SocialLoginEntity, {
        provider: data.provider,
        identifier: data.identifier,
        userId,
      });

      if (queryRunner == null) await qr.commitTransaction();
    } catch (error) {
      if (queryRunner == null) await qr.rollbackTransaction();

      throw error;
    } finally {
      if (queryRunner == null) await qr.release();
    }

    return userId;
  }

  async findByIdentifier(
    identifier: string,
    includeDeleted = false,
  ): Promise<UserDto | null> {
    const user = await this.userRepository.findOne({
      where: {
        socialLogin: { identifier },
        // 삭제된 유저 중에서도 찾을 지 여부
        deletedAt: !includeDeleted ? IsNull() : undefined,
      },
    });
  
    return user ? UserDto.from(user) : null;
  }

  async findByUserId(userId: number): Promise<UserDto | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId, deletedAt: IsNull() }
    });

    return user ? UserDto.from(user) : null;
  }

  async insertRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    const now = DateTime.now()
      .setZone(this.configService.get<string>('tz'))
      .toMillis();
    const hashedToken = await this.createHashedToken(refreshToken);

    await this.userTokenRepository.insert({
      userId,
      refreshToken: hashedToken,
      createdAt: now,
    });
  }

  async deleteRefreshToken(refreshToken: string): Promise<void> {
    const now = DateTime.now()
      .setZone(this.configService.get<string>('tz'))
      .toMillis();
    const hashedToken = await this.createHashedToken(refreshToken);

    await this.userTokenRepository.update(
      { refreshToken: hashedToken, deletedAt: IsNull() },
      { deletedAt: now },
    );
  }

  async isExistRefreshToken(refreshToken: string): Promise<boolean> {
    const hashedToken = await this.createHashedToken(refreshToken);

    return await this.userTokenRepository.exists({
      where: {
        refreshToken: hashedToken,
        deletedAt: IsNull(),
        user: { deletedAt: IsNull() },
      },
    });
  }

  async restore(userId: number): Promise<void> {
    try {
      await this.userTokenRepository.update({ id: userId }, { deletedAt: () => 'NULL' });
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(error.message, error.stack);
      } else {
        this.logger.error(error);
      }

      throw new InternalServerError('failed to restore user');
    }
  }

  async createHashedToken(token: string): Promise<string> {
    return await hash(token, { raw: false, salt: Buffer.alloc(16) });
  }
}