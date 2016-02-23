import { Client } from '../lib/index';
import _ from 'lodash';

const TOKEN = process.env.SAFETYCULTURE_TOKEN;
const client = Client({token: TOKEN, logger: console});

client.audits.findAll({since: '2016-01-01'})
             .then((audits) => {
               audits.forEach((audit) => {
                client.exports.create({ auditId: audit.audit_id }).then((auditExport) => {
                  client.exports.get({auditId: audit.audit_id, id: auditExport.id }).then((response) => {
                    console.log(response.href);
                  });
                })
               });
             });
