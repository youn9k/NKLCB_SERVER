import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RecruitModule } from './recruit/recruit.module'

@Module({
  imports: [AuthModule, RecruitModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
