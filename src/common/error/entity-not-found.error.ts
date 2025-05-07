import { CustomError } from './custom.error';
import { ALL_ERROR_CODES } from './types';
import { DEFAULT_ERROR_CODES } from './types/default.types';

export class EntityNotFoundError extends CustomError {
  constructor(
    message: string,
    errorCode: ALL_ERROR_CODES = DEFAULT_ERROR_CODES.NOT_FOUND,
  ) {
    super(message, {
      httpMessage: 'Entity Not Found',
      httpStatusCode: 404,
      errorCode,
    });
  }
}
