/*
 * Find available export profiles.
 *
 * export SAFETYCULTURE_TOKEN=YOUR_API_TOKEN
 *
 * ./node_modules/.bin/babel-node  --presets es2015 ./examples/export_profile_find.js
 *
 * To use an alternative API server:
 * export SAFETYCULTURE_URL=http://localhost:8084
 */

import { Client } from '../lib/index';

// ===== edit export profile id =====

const PROFILE = 'template_FE6ACDF6E4E441D58466EC7184A8E742:E3308FD3-89AE-4A5B-B377-90F092098BF4';

// ======================================

const TOKEN = process.env.SAFETYCULTURE_TOKEN;
const URL = process.env.SAFETYCULTURE_URL;

const client = Client({ token: TOKEN, logger: console, apiUrl: URL });

client.exportProfiles.findById(PROFILE)
.then(profile => {
  console.log(JSON.stringify(profile, null, 2));
})
.catch((error) => console.log(error.stack));
