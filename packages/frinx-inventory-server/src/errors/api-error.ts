import BaseError, { HttpStatusCode } from './base-error';

export default class APIError extends BaseError {
  constructor(
    name: string,
    httpCode = HttpStatusCode.INTERNAL_SERVER,
    isOperational = true,
    description = 'internal server error',
  ) {
    super(name, httpCode, description, isOperational);
  }
}
