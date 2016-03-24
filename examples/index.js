import { Client } from '../lib/index';

const TOKEN = process.env.SAFETYCULTURE_TOKEN;

// apiUrl is optional and will default to the production API URL
const URL = process.env.SAFETYCULTURE_URL;

const client = Client({ token: TOKEN, logger: console, apiUrl: URL });

client.audits.findAll({ since: '2016-01-01' })
.then((audits) => {
  // export and download the first audit found
  const audit = audits[0];
  client.exports.create({ auditId: audit.audit_id }).then((auditExport) => {
    client.exports.get({ auditId: audit.audit_id, id: auditExport.id }).then((response) => {
      client.exports.download({ uri: response.href, dir: '.' })
      .catch((error) => console.log(error));
    });
  });
})
.catch((error) => console.log(error.error.message));
