"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _helpers = require("./helpers");

function makeAPIHandler() {
  const router = (0, _express.Router)();
  router.get('/', (0, _helpers.asyncHandler)(async (_, res) => {
    res.status(200).send({
      hello: 'world'
    });
  }));
  return router;
}

var _default = makeAPIHandler;
exports.default = _default;