import { Controller, Get, Query } from '@nestjs/common';
import { RecruitService } from './recruit.service';

@Controller('recruit')
export class RecruitController {
  constructor(private readonly recruitService: RecruitService) {}

  @Get('/list')
  getRecruits(@Query('company') company: string) {
    return this.recruitService.getRecruits(company);
  }
}