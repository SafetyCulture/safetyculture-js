'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Audits;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* Generates Audits object with methods using passed api
* @param {object} api Valid api object
* @returns {object} audits Methods to interact with audits on API
*/
function Audits(api, logger) {
  return {
    /**
    * Returns all audits, with options.
    *
    * @param {object} opts Options object
    * @param {string} opts.since Modified since date (ISO datestring)
    * @param {string} opts.order Order of audits, default 'asc'
    * @param {object} opts.params Additional parameters to be passed into the querystring
    * @returns {Promise} Resolves to array of audits ids and modified_at fields,
    *                    Rejects with an error from API.
    */
    findAll: function findAll() {
      var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var since = _ref.since;
      var order = _ref.order;
      var params = _ref.params;

      var qs = _lodash2.default.merge({
        modified_after: since,
        field: ['audit_id', 'modified_at'],
        order: order ? order : 'asc'
      }, params ? params : {});

      logger.info('Search Request: ' + JSON.stringify(qs));

      return api.get('/audits/search', { qs: qs }).then(function (body) {
        return body.audits;
      });
    },

    /**
    * Returns an audit by id
    *
    * @param {string} id Audit id
    * @returns {Promise} Resolves to requested audit,
    *                    Rejects with an error from API.
    */
    findById: function findById(id) {
      return api.get('/audits/' + id);
    }
  };
}