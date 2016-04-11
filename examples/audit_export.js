/*
 * Find audits and export the first audit found as a PDF document
 *
 * export SAFETYCULTURE_TOKEN=YOUR_API_TOKEN
 *
 * ./node_modules/.bin/babel-node  --presets es2015 ./examples/index.js
 *
 * To run against an alternative server:
 * export SAFETYCULTURE_URL=http://localhost:8084
 */

import { Client } from '../lib/index';

const TOKEN = process.env.SAFETYCULTURE_TOKEN;
const URL = process.env.SAFETYCULTURE_URL;

const client = Client({ token: TOKEN, logger: console, apiUrl: URL });

client.audits.findAll({ since: '2016-01-01' })
.then((audits) => {
  // export and download the first audit found
  const audit = audits[0];
  client.exports.create({ auditId: audit.audit_id }).then((auditExport) => {
    client.exports.get({ auditId: audit.audit_id, id: auditExport.id }).then((response) => {
      client.exports.download({ uri: response.href, dir: '.' });
    });
  });
})
.catch((error) => console.log(error.stack));
