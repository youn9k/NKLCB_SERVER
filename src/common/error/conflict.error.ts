import { CustomError } from './custom.error';
import { ALL_ERROR_CODES } from './types';
import { DEFAULT_ERROR_CODES } from './types/default.types';

export class ConflictError extends CustomError {
  constructor(
    message: string,
    errorCode: ALL_ERROR_CODES = DEFAULT_ERROR_CODES.CONFLICT,
  ) {
    super(message, { httpStatusCode: 409, httpMessage: 'Conflict', errorCode });
  }
}
