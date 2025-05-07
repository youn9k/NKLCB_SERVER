import { HttpStatus } from '@nestjs/common';
import { CustomErrorOptions } from './interface/custom-error-options.interface';
import { DEFAULT_ERROR_CODES } from './types/default.types';
import { ALL_ERROR_CODES } from './types';

export class CustomError extends Error {
  readonly options: CustomErrorOptions;

  constructor(message: string, options?: CustomErrorOptions) {
    super(message);
    this.options = options ?? {
      httpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      httpMessage: 'Internal Server Error',
      errorCode: DEFAULT_ERROR_CODES.INTERNAL_SERVER_ERROR,
    };

    Error.captureStackTrace(this, this.constructor);
  }

  getErrorMessage(): string {
    return this.options.httpMessage;
  }

  getErrorCode(): ALL_ERROR_CODES {
    return this.options.errorCode;
  }

  getStatusCode(): number {
    return this.options.httpStatusCode;
  }
}
