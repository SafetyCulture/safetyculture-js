'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BASE_URL = undefined;
exports.generateToken = generateToken;
exports.default = Api;

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BASE_URL = exports.BASE_URL = 'https://api.safetyculture.io';

/**
* Generates an access token from a SafetyCulture username and password
* @param {string} username
* @param {string} password
* @returns {Promise} Resolves with access token
*                    Rejects with error if login failed
*/
function generateToken(username, password) {
  var apiUrl = arguments.length <= 2 || arguments[2] === undefined ? BASE_URL : arguments[2];

  return (0, _requestPromise2.default)({
    method: 'POST',
    uri: apiUrl + '/auth',
    form: {
      username: username,
      password: password,
      grant_type: 'password'
    },
    json: true
  }).then(function (body) {
    return body.access_token;
  }).catch(function () {
    throw new Error('Invalid username or password');
  });
}

/**
* Create a SafetyCulture Api client
* @param {object} opts The following options
* @param {string} token Valid token for authorization requests
* @returns {object} api Api client
*/
function Api(_ref) {
  var token = _ref.token;
  var _ref$apiUrl = _ref.apiUrl;
  var apiUrl = _ref$apiUrl === undefined ? BASE_URL : _ref$apiUrl;

  var defaultOptions = {
    headers: {
      'Authorization': 'Bearer ' + token
    },
    useQuerystring: true,
    json: true
  };

  var getUri = function getUri(_ref2) {
    var uri = _ref2.uri;
    var options = _ref2.options;
    var toStream = _ref2.toStream;

    var params = _lodash2.default.assign({}, defaultOptions, { uri: uri }, options);
    if (toStream) return (0, _request2.default)(params).pipe(toStream);
    return (0, _requestPromise2.default)(_lodash2.default.assign({}, defaultOptions, { uri: uri }, options));
  };

  return {
    /**
    * Posts body to endpoint on SafetyCulture
    * @param {string} endpoint        The endpoint to post to on SafetyCulture
    * @param {object} [args.options]  Request options
    * @returns {Promise} Resolves to body of response,
    *                    Rejects with an error from API.
    */

    post: function post(endpoint, options) {
      return (0, _requestPromise2.default)(_lodash2.default.assign({}, defaultOptions, {
        method: 'POST',
        uri: apiUrl + endpoint
      }, options));
    },


    /**
    * Gets from endpoint on SafetyCulture
    * @param {string} endpoint         The endpoint to get from on SafetyCulture
    * @param {object} [args.options]   Request options
    * @param {stream} [args.toStream]  A file stream to write response body to
    * @returns {Promise} Unless write stream is specified.
    *                    Resolves to body of response,
    *                    Rejects with an error from API.
    */
    get: function get(endpoint, options, toStream) {
      return getUri({ uri: apiUrl + endpoint, options: options, toStream: toStream });
    },


    /**
    * Gets from URI
    * @param {string} args.uri         The URI to get from
    * @param {object} [args.options]   Request options
    * @param {stream} [args.toStream]  A file stream to write response body to
    * @returns {Promise} Unless write stream is specified.
    *                    Resolves to body of response,
    *                    Rejects with an error from API.
    */
    getUri: getUri
  };
}