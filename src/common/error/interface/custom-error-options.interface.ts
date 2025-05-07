import { HttpStatus } from '@nestjs/common';
import { ALL_ERROR_CODES } from '../types';

export interface CustomErrorOptions {
  httpStatusCode: HttpStatus;
  httpMessage: string;
  errorCode: ALL_ERROR_CODES;
}
