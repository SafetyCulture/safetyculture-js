/*
 * Find audits and export the first audit found as a PDF document
 *
 * export SAFETYCULTURE_TOKEN=YOUR_API_TOKEN
 *
 * ./node_modules/.bin/babel-node  --presets es2015 ./examples/audit_export_to_stream.js
 *
 * To run against an alternative server:
 * export SAFETYCULTURE_URL=http://localhost:8084
 */

import fs from 'fs';
import { Client } from '../lib/index';

const TOKEN = process.env.SAFETYCULTURE_TOKEN;
const URL = process.env.SAFETYCULTURE_URL;

const client = Client({ token: TOKEN, logger: console, apiUrl: URL });

client.audits.findAll({ since: '2016-01-01' })
.then((audits) => {
  // export and download the first audit found
  const audit = audits[0];
  const exporter = client.exports;
  return exporter.create({ auditId: audit.audit_id }).then((auditExport) => {
    return exporter.get({ auditId: audit.audit_id, id: auditExport.id }).then((response) => {
      const filename = exporter.filenameFromURI(response.href);
      const writeStream = fs.createWriteStream(`./${filename}`);
      return exporter.download({ uri: response.href, writeStream });
    });
  });
})
.catch((error) => console.log('ERROR: ', error.message));
