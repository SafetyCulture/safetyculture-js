import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Promise from 'bluebird';

chai.use(sinonChai);

import Exports, { DEFAULT_TIMEZONE, DEFAULT_FORMAT } from '../src/exports';

describe('Exports', () => {
  describe('#create', () => {
    const post = sinon.stub().returns(Promise.resolve());
    const auditId = 'audit-id';
    const parameters = { format: DEFAULT_FORMAT, timezone: DEFAULT_TIMEZONE };

    it('send a request with the audit id', () => {
      return Exports({ post }, console).create({ auditId })
      .then(() => {
        expect(post.calledWith(`/audits/${auditId}/export`, {qs: parameters})).to.be.true;
      });
    });
  });

  describe('#findById', () => {
    const get = sinon.stub().returns(Promise.resolve());
    const auditId = 'audit-id';
    const id = 'export-id';

    it('send a request with the right id', () => {
      return Exports({ get }, console).findById({ auditId, id })
      .then(() => {
        expect(get.calledWith(`/audits/${auditId}/exports/${id}`)).to.be.true;
      });
    });
  });

  describe('#get', () => {
    const get = sinon.stub().returns(Promise.resolve({status: 'SUCCESS'}));
    const failed = sinon.stub().returns(Promise.reject({status: 'In Progress'}));
    const auditId = 'audit-id';
    const id = 'export-id';

    it('send a request with the right id', () => {
      return Exports({ get }, console).get({ auditId, id })
      .then(() => {
        expect(get.calledWith(`/audits/${auditId}/exports/${id}`)).to.be.true;
      });
    });

    xit('should retry if the export has not completed', () => {
      const poll = 5;
      const tries = 1;
      return Exports({ get: failed }, console).get({ auditId, id, poll, tries })
        .then(() => {
          expect(failed.calledWith(`/audits/${auditId}/exports/${id}`)).to.be.true;
        }).catch((e) => {
          expect(e).to.be.equal(1);
        });
    });
  });
});
