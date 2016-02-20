import Api from './api';
import Audits from './audits';

const DEFAULT_LOGGER = {info: () => {},
                        error: () => {}};
/**
* Generates Client methods based off passed in token
*
* @param {object} options
* @param {string} options.token SafetyCulture access token
* @param {string} options.host SafetyCulture API host
* @param {object} options.logger The logger object to push messages
*
* @returns {object} SafetyCulture API Client
*/
export default function Client({ token, host, logger = DEFAULT_LOGGER }) {
  const api = Api({ token, host });

  return {
    host,
    audits: Audits(api, logger)
  };
}
