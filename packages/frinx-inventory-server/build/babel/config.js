"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function envString(key) {
  const {
    env
  } = process;
  const value = env[key];

  if (typeof value !== 'string') {
    throw new Error(`Mandatory env variable "${key}" not found`);
  }

  return value;
}

const config = {
  host: envString('HOST'),
  port: envString('PORT')
};
var _default = config;
exports.default = _default;