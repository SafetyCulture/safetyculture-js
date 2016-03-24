import { generateToken } from '../lib/index';

const USERNAME = process.env.SAFETYCULTURE_USERNAME;
const PASSWORD = process.env.SAFETYCULTURE_PASSWORD;

// apiUrl is optional and will default to the production API URL
const URL = process.env.SAFETYCULTURE_URL;

generateToken(USERNAME, PASSWORD).then((response) => {
  console.log(response);
});
