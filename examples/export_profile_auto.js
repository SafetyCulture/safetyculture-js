/*
 * Find available export profiles.
 * Find an audit created from a template which has an export profile.
 * Export the audit as a PDF document using the export profile.
 *
 * export SAFETYCULTURE_TOKEN=YOUR_API_TOKEN
 *
 * ./node_modules/.bin/babel-node  --presets es2015 ./examples/export_profile_auto.js
 *
 * To use an alternative API server:
 * export SAFETYCULTURE_URL=http://localhost:8084
 */

import _find from 'lodash/collection/find';
import _map from 'lodash/collection/map';
import _flatten from 'lodash/array/flatten';

import { Client } from '../lib/index';

const TOKEN = process.env.SAFETYCULTURE_TOKEN;
const URL = process.env.SAFETYCULTURE_URL;

const client = Client({ token: TOKEN, logger: console, apiUrl: URL });

function profileByTemplate(profiles, templateId) {
  return _find(profiles, prof => {
    return _find(prof.templates, { id: templateId });
  });
}

function findAuditsByTemplates(templateIds, { limit = 10 }) {
  return client.audits.findAll({
    since: '2016-01-01',
    params: {
      limit,
      field: ['audit_id', 'modified_at', 'template_id'],
      template: templateIds
    }
  });
}

function getTemplateIdsFromProfiles(profiles) {
  return _flatten(_map(profiles, profile => _map(profile.templates, template => template.id)));
}

client.exportProfiles.findAll()
.then(profilesResponse => {
  const profileList = profilesResponse.export_profiles;
  const templateIds = getTemplateIdsFromProfiles(profileList);

  return findAuditsByTemplates(templateIds, { limit: 1 })
  .then((audits) => {
    const audit = audits[0];
    const templateId = audit.template_id;
    const profile = profileByTemplate(profileList, templateId);
    return client.exports.create({ auditId: audit.audit_id, exportProfile: profile.id }).then((auditExport) => {
      return client.exports.get({ auditId: audit.audit_id, id: auditExport.id }).then((exportsResponse) => {
        return client.exports.download({ uri: exportsResponse.href, dir: '.' });
      });
    });
  });
})
.catch((error) => console.log('ERROR: ', error.message));
