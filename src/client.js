import Api from './api';
import Audits from './audits';

const DEFAULT_LOGGER = {info: () => { console.log(arguments); },
                        error: () => {}};
/**
* Generates Client methods based off passed in token
* @param {object} options
* @param {string} options.token SafetyCulture access token
* @returns {object} SafetyCulture API Client
*/
export default function Client({ token, logger = DEFAULT_LOGGER}) {
  logger.info(`SafetyCulture Client ${logger}`);

  const api = Api({ token });

  return {
    audits: Audits(api, logger)
  };
}
