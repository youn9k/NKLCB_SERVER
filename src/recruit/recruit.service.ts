import { Injectable } from '@nestjs/common';

@Injectable()
export class RecruitService {
  getRecruits(company: string) {
    return [{ id: 1, title: 'iOS Developer', company }];
  }
}