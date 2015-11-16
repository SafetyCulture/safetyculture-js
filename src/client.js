import Api from './api';
import Audits from './audits';

/**
* Generates Client methods based off passed in token
* @param {object} options
* @param {string} options.token SafetyCulture access token
* @returns {object} SafetyCulture API Client
*/
export default function Client({ token }) {
  const api = Api({ token });

  return {
    audits: Audits(api)
  };
}
