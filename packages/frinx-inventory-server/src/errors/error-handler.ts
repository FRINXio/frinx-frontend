import getLogger from '../get-logger';
import BaseError from './base-error';

const log = getLogger('frinx-inventory-server');

export default class ErrorHandler {
  public static handleError(err: Error): void {
    log.error(err.message);
  }

  public static isTrustedError(error: Error): boolean {
    if (error instanceof BaseError) {
      return error.isOperational;
    }
    return false;
  }
}
