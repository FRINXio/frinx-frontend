import { Request, Response } from 'express';

// normally expressjs handles errors thrown in the url-handler.
// but, when it happens during async code, it does not catch it.
// we have to wrap all those into a `.catch()` code,
// but that is annoying, so we created this handler,
// that auto-wraps the code.
export function asyncHandler(
  handler: (req: Request, res: Response) => Promise<void>,
): (req: Request, res: Response, next: (e: Error) => void) => void {
  return (req: Request, res: Response, next: (e: Error) => void) => {
    handler(req, res).catch((e: Error) => {
      next(e);
    });
  };
}
