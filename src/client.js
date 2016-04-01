import Api from './api';
import Audits from './audits';
import Exports from './exports';

const DEFAULT_LOGGER = {info: () => {},
                        error: () => {}};

/**
* Generates Client methods based off passed in token
*
* @param {object} options
* @param {string} options.token SafetyCulture access token
* @param {string} options.apiUrl SafetyCulture API host
* @param {object} options.logger The logger object to push messages
*
* @returns {object} SafetyCulture API Client
*/
export default function Client({ token, apiUrl, logger = DEFAULT_LOGGER }) {
  const api = Api({ token, apiUrl });

  return {
    apiUrl,
    exports: Exports(api, logger),
    audits: Audits(api, logger)
  };
}
