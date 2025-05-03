import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { get } from 'http';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) {}

  /**
   * 서버 상태 체크
   */
  @Get('/heartbeat')
  async heartbeat(): Promise<HeartBeatResponseDTO> {
    return { status: 'alive' };
  }
}

export class HeartBeatResponseDTO {
  status: 'alive' | 'died'
}