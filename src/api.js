import rp from 'request-promise';
import request from 'request';
import _ from 'lodash';

export const BASE_URL = 'https://api.safetyculture.io';

/**
* Generates an access token from a SafetyCulture username and password
* @param {string} username
* @param {string} password
* @returns {Promise} Resolves with access token
*                    Rejects with error if login failed
*/
export function generateToken(username, password, apiUrl = BASE_URL) {
  return rp({
    method: 'POST',
    uri: apiUrl + '/auth',
    form: {
      username,
      password,
      grant_type: 'password'
    },
    json: true
  })
  .then(body => body.access_token)
  .catch(() => { throw new Error('Invalid username or password'); });
}

/**
* Create a SafetyCulture Api client
* @param {object} opts The following options
* @param {string} token Valid token for authorization requests
* @returns {object} api Api client
*/
export default function Api({ token, apiUrl = BASE_URL }) {
  const defaultOptions = {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    useQuerystring: true,
    json: true
  };

  const build = (uri, options) => {
    return _.assign({}, defaultOptions, { uri }, options);
  };

  return {
    /**
    * Posts body to endpoint on SafetyCulture
    *
    * @param {string} endpoint        The endpoint to post to on SafetyCulture
    * @param {object} [args.options]  Request options
    * @returns {Promise} Resolves to body of response,
    *                    Rejects with an error from API.
    */
    post(endpoint, options) {
      return rp(_.assign({}, defaultOptions, {
        method: 'POST',
        uri: apiUrl + endpoint
      }, options));
    },

    /**
    * Gets from endpoint on SafetyCulture
    *
    * @param {string} endpoint         The endpoint to get from on SafetyCulture
    * @param {object} [args.options]   Request options
    * @returns {Promise} Unless write stream is specified.
    *                    Resolves to body of response,
    *                    Rejects with an error from API.
    */
    get(endpoint, options) {
      return rp(build(apiUrl + endpoint, options));
    },

    /**
    * GET output to Stream
    *
    * @param {string} uri         The URI to get from
    * @param {object} [args.options]   Request options
    * @param {stream} [args.stream]  A file stream to write response body to
    * @returns {Promise} Unless write stream is specified.
    *                    Resolves to body of response,
    *                    Rejects with an error from API.
    */
    streamGet(uri, { options = {}, stream }) {
      return request(build(uri, options)).pipe(stream);
    }
  };
}
