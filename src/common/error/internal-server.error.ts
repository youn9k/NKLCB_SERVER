import { CustomError } from './custom.error';
import { ALL_ERROR_CODES } from './types';
import { DEFAULT_ERROR_CODES } from './types/default.types';

export class InternalServerError extends CustomError {
  constructor(
    message: string,
    errorCode: ALL_ERROR_CODES = DEFAULT_ERROR_CODES.INTERNAL_SERVER_ERROR,
  ) {
    super(message, {
      httpStatusCode: 500,
      httpMessage: 'Internal Server Error',
      errorCode,
    });
  }
}
