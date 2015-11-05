import { generateToken } from '../../src/api';

// Fill in for live tests
const USER = '';
const PASSWORD = '';

describe.skip('api-live', () => {
  describe('#generateToken', () => {
    it('should resolve to a token', () => {
      return generateToken(USER, PASSWORD)
      .then(token => {
        expect(token).to.be.string;
      });
    });

    it('should reject with Invalid username or password on error', () => {
      return generateToken(USER, 'invalid')
      .catch(e => {
        expect(e.message).to.equal('Invalid username or password');
      });
    });
  });
});
