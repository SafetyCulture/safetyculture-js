import Promise from 'bluebird';
import fs from 'fs';

export const DEFAULT_TIMEZONE = 'UTC';
export const DEFAULT_FORMAT = 'pdf';
export const POLL_TIME = 5 * 1000;
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
    create({ auditId, timezone = DEFAULT_TIMEZONE, format = DEFAULT_FORMAT, exportProfile }) {
      logger.info(`Creating export for ${auditId} (${timezone}, ${format}, ${exportProfile})`);
      const qs = { format, timezone };
      if (exportProfile) qs.export_profile = exportProfile;
      return api.post(`/audits/${auditId}/export`, { qs });
    },

    /**
    * Find a promise by audit id and id
    *
    * @param {string} auditId Audit id
    * @param {string} id Export id
    * @returns {Promise} Resolves to requested export,
    *                    Rejects with an error from API.
    */
    findById({ auditId, id }) {
      return api.get(`/audits/${auditId}/exports/${id}`).catch((error) => {
        if (error.statusCode === 404) { // Workaround for ARG-2136
          return api.get(`/audits/${auditId}/exports/${id}`);
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
    get({ auditId, id, poll = POLL_TIME, tries = MAX_TRIES }) {
      let attempts = 1;

      let attempt = () => {
        return this.findById({ auditId, id }).then((response) => {
          if (response.status === `FAILED`) return Promise.reject(response.error);
          if (response.status === `SUCCESS`) return response;
          if (response.status === `IN PROGRESS` && attempts < tries) {
            return Promise.delay(poll).then(() => {
              attempts += 1;
              return attempt();
            });
          }
          return Promise.reject(new Error(`Request to get export timed out after ${attempts} attempts.`));
        }).catch((error) => Promise.reject(error));
      };

      return attempt();
    },

    /**
     * extract and decode a filename from the end of a URI
     * @param   {string} uri a uri with a filename
     * @returns {string}     a decoded filename
     */
    filenameFromURI(uri) {
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
    download({ uri, dir = '.', filename, writeStream }) {
      if (writeStream) {
        logger.info(`Downloading export\n   from ${uri}\n   to writeStream`);
        return api.streamGet(uri, { stream: writeStream });
      }
      const targetFilename = filename || this.filenameFromURI(uri);
      logger.info(`Downloading export\n   from ${uri}\n   to ${dir}/${targetFilename}`);
      return api.streamGet(uri, { stream: fs.createWriteStream(`${dir}/${targetFilename}`) });
    }
  };
}
