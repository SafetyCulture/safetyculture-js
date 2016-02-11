'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Client;

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _audits = require('./audits');

var _audits2 = _interopRequireDefault(_audits);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_LOGGER = { info: function info() {},
  error: function error() {} };
/**
* Generates Client methods based off passed in token
* @param {object} options
* @param {string} options.token SafetyCulture access token
* @returns {object} SafetyCulture API Client
*/
function Client(_ref) {
  var token = _ref.token;
  var _ref$logger = _ref.logger;
  var logger = _ref$logger === undefined ? DEFAULT_LOGGER : _ref$logger;

  logger.info('SafetyCulture Client ' + logger);

  var api = (0, _api2.default)({ token: token });

  return {
    audits: (0, _audits2.default)(api, logger)
  };
}
module.exports = exports['default'];