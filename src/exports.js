import Promise from 'bluebird';

export const DEFAULT_TIMEZONE = 'UTC';
export const DEFAULT_FORMAT = 'pdf';
export const POLL_TIME = 60 * 60 * 1;
export const MAX_TRIES = 5;

/**
* Generates Exports object with methods using passed api
*
* @param {object} api Valid api object
* @param {object} logger Logger
* @returns {object} exports Methods to interact with exports on API
*/
export default function Exports(api, logger) {
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
    create: ({ auditId, timezone = DEFAULT_TIMEZONE, format = DEFAULT_FORMAT }) => {
      logger.info(`Creating export for ${auditId} (${timezone}, ${format})`);
      return api.post(`/audits/${auditId}/export`,
                              { qs: { format, timezone } });
    },

    /**
    * Find a promise by audit id and id
    *
    * @param {string} auditId Audit id
    * @param {string} id Export id
    * @returns {Promise} Resolves to requested export,
    *                    Rejects with an error from API.
    */
    findById: ({ auditId, id }) => {
      return api.get(`/audits/${auditId}/exports/${id}`);
    },

    /**
    * Find a promise by audit id and id when the export is completed
    *
    * @param {string} auditId Audit id
    * @param {string} id Export id
    * @returns {Promise} Resolves to requested export,
    *                    Rejects with an error from API.
    */
    findByIdCompleted: function({ auditId, id }) {
      return new Promise((resolve, reject) => {
        this.findById({ auditId, id }).then((response) => {
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
    get: function({ auditId, id, poll = POLL_TIME, tries = MAX_TRIES}) {
      logger.info(arguments);
      let attempts = 1;

      let attempt = () => {
        return this.findByIdCompleted({ auditId, id }).catch(() => {
          if (attempts < tries) {
            Promise.delay(poll).then(() => {
              attempts += 1;
              attempt();
            });
          } else {
            return Promise.reject(attempts);
          }
        });
      };

      return attempt();
    }
  };
}