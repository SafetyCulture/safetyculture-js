/*
 * Find audits created from a specific template.
 *
 * export SAFETYCULTURE_TOKEN=YOUR_API_TOKEN
 *
 * ./node_modules/.bin/babel-node  --presets es2015 ./examples/audits_find_recent.js
 *
 * To use an alternative API server:
 * export SAFETYCULTURE_URL=http://localhost:8084
 */

import { Client } from '../lib/index';

const TOKEN = process.env.SAFETYCULTURE_TOKEN;
const URL = process.env.SAFETYCULTURE_URL;

const client = Client({ token: TOKEN, logger: console, apiUrl: URL });

client.audits.findAll({
  since: '2016-01-01',
  order: 'desc',
  params: { limit: 10 }
})
.then((audits) => {
  console.log(JSON.stringify(audits, null, 2));
})
.catch((error) => console.log(error.stack));
