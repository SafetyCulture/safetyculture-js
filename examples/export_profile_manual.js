/*
 * Export an audit as a PDF document using an export profile.
 *
 * export SAFETYCULTURE_TOKEN=YOUR_API_TOKEN
 *
 * ./node_modules/.bin/babel-node  --presets es2015 ./examples/export_profile_manual.js
 *
 * To use an alternative API server:
 * export SAFETYCULTURE_URL=http://localhost:8084
 */

import { Client } from '../lib/index';

// ===== edit audit and profile ids =====

const PROFILE = 'template_FE6ACDF6E4E441D58466EC7184A8E742:55EE583E-7D2D-4EE2-94A3-CC2F32A15511';

const AUDIT = 'audit_73656F4C964E4791B6A27225639EB3A6';

// ======================================


const TOKEN = process.env.SAFETYCULTURE_TOKEN;
const URL = process.env.SAFETYCULTURE_URL;

const client = Client({ token: TOKEN, logger: console, apiUrl: URL });

client.exports.create({ auditId: AUDIT, exportProfile: PROFILE }).then((auditExport) => {
  return client.exports.get({ auditId: AUDIT, id: auditExport.id }).then((response) => {
    return client.exports.download({ uri: response.href, dir: '.' });
  });
})
.catch((error) => console.log('ERROR: ', error.message));
