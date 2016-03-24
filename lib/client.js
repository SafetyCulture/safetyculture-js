'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Client;

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _audits = require('./audits');

var _audits2 = _interopRequireDefault(_audits);

var _exports = require('./exports');

var _exports2 = _interopRequireDefault(_exports);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_LOGGER = { info: function info() {},
  error: function error() {} };
/**
* Generates Client methods based off passed in token
*
* @param {object} options
* @param {string} options.token SafetyCulture access token
* @param {string} options.apiUrl SafetyCulture API host
* @param {object} options.logger The logger object to push messages
*
* @returns {object} SafetyCulture API Client
*/
function Client(_ref) {
  var token = _ref.token;
  var apiUrl = _ref.apiUrl;
  var _ref$logger = _ref.logger;
  var logger = _ref$logger === undefined ? DEFAULT_LOGGER : _ref$logger;

  var api = (0, _api2.default)({ token: token, apiUrl: apiUrl });

  return {
    apiUrl: apiUrl,
    exports: (0, _exports2.default)(api, logger),
    audits: (0, _audits2.default)(api, logger)
  };
}