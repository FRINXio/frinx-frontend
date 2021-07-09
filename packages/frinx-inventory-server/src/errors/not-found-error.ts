import APIError from './api-error';
import { HttpStatusCode } from './base-error';

export default class NotFoundError extends APIError {
  constructor(message: string) {
    super('NOT FOUND', HttpStatusCode.NOT_FOUND, true, message);
  }
}
