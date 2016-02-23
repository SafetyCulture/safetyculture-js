'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MAX_TRIES = exports.POLL_TIME = exports.DEFAULT_FORMAT = exports.DEFAULT_TIMEZONE = undefined;
exports.default = Exports;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_TIMEZONE = exports.DEFAULT_TIMEZONE = 'UTC';
var DEFAULT_FORMAT = exports.DEFAULT_FORMAT = 'pdf';
var POLL_TIME = exports.POLL_TIME = 60 * 60 * 1;
var MAX_TRIES = exports.MAX_TRIES = 5;

/**
* Generates Exports object with methods using passed api
*
* @param {object} api Valid api object
* @param {object} logger Logger
* @returns {object} exports Methods to interact with exports on API
*/
function Exports(api, logger) {
  return {
    /**
    * Create an export for an audit
    *
    * @param {string} auditId Audit id
    * @param {string} timezone Timezone of export
    * @param {string} export format
    * @returns {Promise} Resolves to successfully created export,
    *                    Rejects with an error from API.
    */
    create: function create(_ref) {
      var auditId = _ref.auditId;
      var _ref$timezone = _ref.timezone;
      var timezone = _ref$timezone === undefined ? DEFAULT_TIMEZONE : _ref$timezone;
      var _ref$format = _ref.format;
      var format = _ref$format === undefined ? DEFAULT_FORMAT : _ref$format;

      logger.info('Creating export for ' + auditId + ' (' + timezone + ', ' + format + ')');
      return api.post('/audits/' + auditId + '/export', { qs: { format: format, timezone: timezone } });
    },

    /**
    * Find a promise by audit id and id
    *
    * @param {string} auditId Audit id
    * @param {string} id Export id
    * @returns {Promise} Resolves to requested export,
    *                    Rejects with an error from API.
    */
    findById: function findById(_ref2) {
      var auditId = _ref2.auditId;
      var id = _ref2.id;

      return api.get('/audits/' + auditId + '/exports/' + id);
    },

    /**
    * Find a promise by audit id and id when the export is completed
    *
    * @param {string} auditId Audit id
    * @param {string} id Export id
    * @returns {Promise} Resolves to requested export,
    *                    Rejects with an error from API.
    */
    findByIdCompleted: function findByIdCompleted(_ref3) {
      var _this = this;

      var auditId = _ref3.auditId;
      var id = _ref3.id;

      return new _bluebird2.default(function (resolve, reject) {
        _this.findById({ auditId: auditId, id: id }).then(function (response) {
          if (response.status === 'SUCCESS') {
            resolve(response);
          } else {
            reject(response);
          }
        });
      });
    },

    /**
    * Get an export (poll until completed)
    *
    * @param {string} auditId Audit id
    * @param {string} id Export id
    * @returns {Promise} Resolves to requested export,
    *                    Rejects with an error from API.
    */
    get: function get(_ref4) {
      var _this2 = this;

      var auditId = _ref4.auditId;
      var id = _ref4.id;
      var _ref4$poll = _ref4.poll;
      var poll = _ref4$poll === undefined ? POLL_TIME : _ref4$poll;
      var _ref4$tries = _ref4.tries;
      var tries = _ref4$tries === undefined ? MAX_TRIES : _ref4$tries;

      logger.info(arguments);
      var attempts = 1;

      var attempt = function attempt() {
        return _this2.findByIdCompleted({ auditId: auditId, id: id }).catch(function () {
          if (attempts < tries) {
            _bluebird2.default.delay(poll).then(function () {
              attempts += 1;
              attempt();
            });
          } else {
            return _bluebird2.default.reject(attempts);
          }
        });
      };

      return attempt();
    }
  };
}