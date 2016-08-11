
/**
* Generates Export Profiles object with methods using passed api
*
* @param {object} api API object
* @param {object} logger Logger
* @returns {object} exports Methods to interact with export profiles on API
*/
export default function ExportProfiles(api, logger) {
  return {
    /**
     * Find metadata for all available export profiles
     *
     * @param   {object} options.params extra options
     * @param   {array}  options.params.templates ids to filter profiles by
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
    findAll({ params } = {}) {
      const query = params && params.templates ? `?${params.templates.map(id => `template=${id}`).join('&')}` : '';
      const logQuery = query ? 'for ' + params.templates : '';
      return api.get(`/export_profiles/search${query}`);
    },

    /**
    * Returns an export profile by id
    *
    * @param {string} id Export Profile id
    * @returns {Promise} Resolves to requested export profile,
    *                    Rejects with an error from API.
    */
    findById: (id) => api.get(`/export_profiles/${id}`)
  };
}
