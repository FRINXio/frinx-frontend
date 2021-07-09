import APIError from './api-error';
import { HttpStatusCode } from './base-error';

export default class BadRequestError extends APIError {
  constructor(message: string) {
    super('BAD REQUEST', HttpStatusCode.BAD_REQUEST, true, message);
  }
}
