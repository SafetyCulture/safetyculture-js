import { expect } from 'chai';
import sinon from 'sinon';
import Promise from 'bluebird';

import ExportProfiles from '../src/export-profiles';

describe('Export Profiless', () => {
  describe('#findAll', () => {
    const get = sinon.stub().returns(Promise.resolve());

    it('send a request with no', () => {
      return ExportProfiles({ get }, console).findAll()
      .then(() => {
        expect(get.calledWith(`/export_profiles/search`)).to.be.true;
      });
    });
  });

  describe('#findAll - filtered', () => {
    const get = sinon.stub().returns(Promise.resolve());

    it('send a request with single template query', () => {
      const params = { templates: ['template_123123123123123'] };
      return ExportProfiles({ get }, console).findAll({ params })
      .then(() => {
        expect(get.calledWith(`/export_profiles/search?template=template_123123123123123`)).to.be.true;
      });
    });

    it('send a request with multiple template query', () => {
      const params = { templates: ['template_123123123123123', 'template_234234234234'] };
      return ExportProfiles({ get }, console).findAll({ params })
      .then(() => {
        expect(get.calledWith(`/export_profiles/search?template=template_123123123123123&template=template_234234234234`)).to.be.true;
      });
    });
  });
});
