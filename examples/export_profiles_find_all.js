/*
 * Find available export profiles.
 *
 * export SAFETYCULTURE_TOKEN=YOUR_API_TOKEN
 *
 * ./node_modules/.bin/babel-node  --presets es2015 ./examples/export_profiles_find_all.js
 *
 * To use an alternative API server:
 * export SAFETYCULTURE_URL=http://localhost:8084
 */

import { Client } from '../lib/index';

const TOKEN = process.env.SAFETYCULTURE_TOKEN;
const URL = process.env.SAFETYCULTURE_URL;

const client = Client({ token: TOKEN, logger: console, apiUrl: URL });

client.exportProfiles.findAll()
.then(profiles => {
  console.log(JSON.stringify(profiles, null, 2));
})
.catch((error) => console.log(error.stack));
