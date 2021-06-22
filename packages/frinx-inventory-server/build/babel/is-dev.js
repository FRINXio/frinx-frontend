"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const ENVIRONMENT = process.env.NODE_ENV || 'development';
const isProd = ENVIRONMENT === 'production';
const isDev = ENVIRONMENT === 'development';

if (!(isProd || isDev)) {
  throw new Error('server: isProd or isDev has to be true');
}

var _default = isDev;
exports.default = _default;