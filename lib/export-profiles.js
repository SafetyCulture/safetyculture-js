'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ExportProfiles;

/**
* Generates Export Profiless object with methods using passed api
*
* @param {object} api Valid api object
* @param {object} logger Logger
* @returns {object} exports Methods to interact with export profiles on API
*/
function ExportProfiles(api, logger) {
  return {
    /**
     * Find metadata for all available export profiles
     *
     * @param   {object} options.params extra options
     * @param   {array}  options.params.templateIds ids to filter profiles by
     * @returns {object} export profile metadata
     *
     * {
     *   "export_profiles": [
     *     {
     *       "id": "template_FE6ACDF6E4E441D58466EC7184A8E742:85090EC6-1C21-4B96-97B9-1E3C839C26C7",
     *       "name": "test3",
     *       "templates": [
     *         {
     *           "id": "template_FE6ACDF6E4E441D58466EC7184A8E742",
     *           "name": "Export Profile Test"
     *         }
     *       ]
     *     },
     *   ]
     * }
     */

    findAll: function findAll() {
      var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var params = _ref.params;

      var query = params && params.templateIds ? '?' + templateIds.map(function (id) {
        return 'template=' + id;
      }).join('&') : '';
      var logQuery = query ? 'for ' + templateIds : '';
      logger.info('Finding export profiles ' + logQuery);
      return api.get('/export_profiles/search' + query);
    },


    /**
    * Returns an export profile by id
    *
    * @param {string} id Export Profile id
    * @returns {Promise} Resolves to requested export profile,
    *                    Rejects with an error from API.
    */
    findById: function findById(id) {
      return api.get('/export_profiles/' + id);
    }
  };
}