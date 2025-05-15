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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}.local`, `.env.${process.env.NODE_ENV}`],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: Number(configService.get('DB_PORT')),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [
          UserEntity,
          SocialLoginEntity,
        ],
        synchronize: configService.get('DB_SYNC'),
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
