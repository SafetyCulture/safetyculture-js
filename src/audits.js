/**
* Generates Audits object with methods using passed api
* @param {object} api Valid api object
* @returns {object} audits Methods to interact with audits on API
*/
export default function Audits(api) {
  return {
    /**
    * Returns all audits, with options.
    * @param {object} opts Options object
    * @param {string} opts.since Modified since date (ISO datestring)
    * @param {string} opts.order Order of audits, default 'asc'
    * @returns {Promise} Resolves to array of audits ids and modified_at fields,
    *                    Rejects with an error from API.
    */
    findAll: ({ since, order } = {}) => api.get('/audits/search', {
      qs: {
        modified_after: since,
        field: ['audit_id', 'modified_at'],
        order: order ? order : 'asc'
      }
    })
    .then(body => body.audits),

    /**
    * Returns an audit by id
    * @param {string} id Audit id
    * @returns {Promise} Resolves to requested audit,
    *                    Rejects with an error from API.
    */
    findById: (id) => api.get(`/audits/${id}`)
  };
}
