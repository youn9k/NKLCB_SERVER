import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RecruitModule } from './recruit/recruit.module'
import { UserEntity } from './user/entity/user.entity';
import { SocialLoginEntity } from './user/entity/social-login.entity';
import { UserModule } from './user/user.module';
import config from './common/config/config';
import { UserTokenEntity } from './user/entity/user-token.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}.local`, `.env.${process.env.NODE_ENV}`],
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('db.host'),
        port: Number(configService.get('db.port')),
        username: configService.get('db.username'),
        password: configService.get('db.password'),
        database: configService.get('db.name'),
        entities: [
          UserEntity,
          UserTokenEntity,
          SocialLoginEntity,
        ],
        synchronize: configService.get('db.sync'),
        supportBigNumbers: true,
      }),
    }),
    AuthModule, 
    UserModule,
    RecruitModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
