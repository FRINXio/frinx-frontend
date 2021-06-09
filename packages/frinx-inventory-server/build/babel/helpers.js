"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asyncHandler = asyncHandler;

// normally expressjs handles errors thrown in the url-handler.
// but, when it happens during async code, it does not catch it.
// we have to wrap all those into a `.catch()` code,
// but that is annoying, so we created this handler,
// that auto-wraps the code.
function asyncHandler(handler) {
  return (req, res, next) => {
    handler(req, res).catch(e => {
      next(e);
    });
  };
}