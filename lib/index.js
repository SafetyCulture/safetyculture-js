'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateToken = exports.Client = undefined;

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _api = require('./api');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Client = _client2.default;
exports.generateToken = _api.generateToken;