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
        expect(get.calledWith('/audits/search', { qs: { modified_after: since }})).to.be.true;
      });
    });
  });
});
