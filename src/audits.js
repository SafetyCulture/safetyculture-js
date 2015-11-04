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
    * @param {object} opts.since Find all audits modified since date
    * @returns {Promise} Resolves to array of audits,
    *                    Rejects with an error from API.
    */
    findAll: ({ since } = {}) =>
      api.get('/audits/search', { qs: { modified_after: since } })
      .then(body => body.audits)
  };
}
