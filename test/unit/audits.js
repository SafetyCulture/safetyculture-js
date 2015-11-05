import Audits from '../../src/audits';

describe('Audits', () => {
  describe('#findAll', () => {
    const audits = ['1', '2', '3'];
    const get = sinon.stub().returns(Promise.resolve({ audits }));

    it('should return all audits from request', () => {
      return Audits({ get }).findAll()
      .then(res => {
        expect(res).to.equal(audits);
      });
    });

    it('should call api with correct endpoint', () => {
      return Audits({ get }).findAll()
      .then(() => {
        expect(get.calledWith('/audits/search')).to.be.true;
      });
    });

    it('should pass since into querystring', () => {
      const since = new Date().toISOString();

      return Audits({ get }).findAll({ since })
      .then(() => {
        const qs = {
          modified_after: since,
          field: ['audit_id', 'modified_at'],
          order: 'asc'
        };
        expect(get.calledWith('/audits/search', { qs: qs })).to.be.true;
      });
    });

    it('should pass order into querystring', () => {
      const order = 'desc';

      return Audits({ get }).findAll({ order })
      .then(() => {
        const qs = {
          modified_after: undefined,
          field: ['audit_id', 'modified_at'],
          order
        };
        expect(get.calledWith('/audits/search', { qs: qs })).to.be.true;
      });
    });

    it('should default order to asc in querystring', () => {
      return Audits({ get }).findAll()
      .then(() => {
        const qs = {
          modified_after: undefined,
          field: ['audit_id', 'modified_at'],
          order: 'asc'
        };
        expect(get.calledWith('/audits/search', { qs: qs })).to.be.true;
      });
    });
  });
});
