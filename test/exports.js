import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Promise from 'bluebird';
import fs from 'fs';

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

  describe('#create with export profile', () => {
    const post = sinon.stub().returns(Promise.resolve());
    const auditId = 'audit-id';
    const parameters = { format: DEFAULT_FORMAT, timezone: DEFAULT_TIMEZONE, export_profile: 'template_blah:blah' };

    it('send a request with the audit id', () => {
      return Exports({ post }, console).create({ auditId, exportProfile: 'template_blah:blah' })
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

  describe('#filenameFromURI', () => {
    it('extract and decode a filename from the end of a URI', () => {
      const filename = Exports({}, console).filenameFromURI('http://localhost:8084/audits/audit_b37ac08ea6c444e281559f19d7102b37/exports/791cfc23-0336-4a26-a49f-ab9267390fe6/Dyno-noscore%20Test%20-%20000001%20-%202016.01.05-06.44.30%2B0000.pdf');
      expect(filename).to.equal('Dyno-noscore Test - 000001 - 2016.01.05-06.44.30+0000.pdf');
    });
  });

  describe('#download', () => {
    const uri = 'http://example.com/mytestpdf.pdf';
    const writeStream = 'myWriteStream';

    it('writes to the specified stream', () => {
      const streamGet = sinon.stub().returns(Promise.resolve());
      return Exports({ streamGet }, console).download({ uri, writeStream })
      .then(() => {
        expect(streamGet.calledWith(uri, { stream: 'myWriteStream' })).to.be.true;
      });
    });

    it('writes to the specified stream', () => {
      let url;
      let arg;
      if (fs.existsSync('./mytestpdf.pdf')) throw (new Error('Please move or remove ./mytestpdf.pdf before running tests'));
      const streamGet = (arg1, arg2) => { url = arg1; arg = arg2; return Promise.resolve(); };
      return Exports({ streamGet }, console).download({ uri })
      .then(() => {
        expect(url).to.equal(uri);
        expect(arg.stream).to.be.an.instanceof(fs.WriteStream);
        fs.unlink('./mytestpdf.pdf');
      });
    });
  });
});
