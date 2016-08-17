'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MAX_TRIES = exports.POLL_TIME = exports.DEFAULT_FORMAT = exports.DEFAULT_TIMEZONE = undefined;
exports.default = Exports;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_TIMEZONE = exports.DEFAULT_TIMEZONE = 'UTC';
var DEFAULT_FORMAT = exports.DEFAULT_FORMAT = 'pdf';
var POLL_TIME = exports.POLL_TIME = 5 * 1000;
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
      var exportProfile = _ref.exportProfile;

      logger.info('Creating export for ' + auditId + ' (' + timezone + ', ' + format + ', ' + exportProfile + ')');
      var qs = { format: format, timezone: timezone };
      if (exportProfile) qs.export_profile = exportProfile;
      return api.post('/audits/' + auditId + '/export', { qs: qs });
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

      return api.get('/audits/' + auditId + '/exports/' + id).catch(function (error) {
        if (error.statusCode === 404) {
          // Workaround for ARG-2136
          return api.get('/audits/' + auditId + '/exports/' + id);
        }
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
    get: function get(_ref3) {
      var _this = this;

      var auditId = _ref3.auditId;
      var id = _ref3.id;
      var _ref3$poll = _ref3.poll;
      var poll = _ref3$poll === undefined ? POLL_TIME : _ref3$poll;
      var _ref3$tries = _ref3.tries;
      var tries = _ref3$tries === undefined ? MAX_TRIES : _ref3$tries;

      var attempts = 1;

      var attempt = function attempt() {
        return _this.findById({ auditId: auditId, id: id }).then(function (response) {
          if (response.status === 'FAILED') return _bluebird2.default.reject(response.error);
          if (response.status === 'SUCCESS') return response;
          if (response.status === 'IN PROGRESS' && attempts < tries) {
            return _bluebird2.default.delay(poll).then(function () {
              attempts += 1;
              return attempt();
            });
          }
          return _bluebird2.default.reject(new Error('Request to get export timed out after ' + attempts + ' attempts.'));
        }).catch(function (error) {
          return _bluebird2.default.reject(error);
        });
      };

      return attempt();
    },


    /**
     * extract and decode a filename from the end of a URI
     * @param   {string} uri a uri with a filename
     * @returns {string}     a decoded filename
     */
    filenameFromURI: function filenameFromURI(uri) {
      return decodeURIComponent(uri.match(/\/([^/]+)$/)[1]);
    },


    /**
    * Download an export
    *
    * @param {string} uri Export uri
    * @param {string} [dir=.] Directory to save to
    * @param {string} [filename] file to save to
    * @param {stream} [writeStream] stream to write to
    * @returns {Promise} Rejects with an error from API.
    *
    * If no optional arguments are set the downloaded file will be saved to the current
    * directory with the filename extracted from the end of the URI.
    */
    download: function download(_ref4) {
      var uri = _ref4.uri;
      var _ref4$dir = _ref4.dir;
      var dir = _ref4$dir === undefined ? '.' : _ref4$dir;
      var filename = _ref4.filename;
      var writeStream = _ref4.writeStream;

      if (writeStream) {
        logger.info('Downloading export\n   from ' + uri + '\n   to writeStream');
        return api.streamGet(uri, { stream: writeStream });
      }
      var targetFilename = filename || this.filenameFromURI(uri);
      logger.info('Downloading export\n   from ' + uri + '\n   to ' + dir + '/' + targetFilename);
      return api.streamGet(uri, { stream: _fs2.default.createWriteStream(dir + '/' + targetFilename) });
    }
  };
}