import { CustomError } from './custom.error';
import { ALL_ERROR_CODES } from './types';
import { DEFAULT_ERROR_CODES } from './types/default.types';

export class BadRequestError extends CustomError {
  constructor(
    message: string,
    errorCode: ALL_ERROR_CODES = DEFAULT_ERROR_CODES.BAD_REQUEST,
  ) {
    super(message, {
      httpMessage: 'Bad Request Error',
      httpStatusCode: 400,
      errorCode,
    });
  }
}
