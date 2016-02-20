import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

import api, { generateToken, BASE_URL } from '../src/api';

describe('api', () => {
  describe('#generateToken', () => {
    const expectedToken = 'testToken';
    const expectedBody = { access_token: expectedToken };

    it('should resolve to a token', () => {
      api.__Rewire__('rp', () => Promise.resolve(expectedBody));

      return generateToken('test', 'test')
      .then(token => {
        api.__ResetDependency__('rp');
        expect(token).to.equal(expectedToken);
      });
    });

    it('should reject with Invalid username or password on error', () => {
      api.__Rewire__('rp', () => Promise.reject());

      return generateToken('test', 'test')
      .catch(e => {
        api.__ResetDependency__('rp');
        expect(e.message).to.equal('Invalid username or password');
      });
    });

    it('should post supplied username and password to the api', () => {
      const testUsername = 'john@smith.com';
      const testPassword = 'password123';

      api.__Rewire__('rp', ({ form }) => {
        expect(form.username).to.equal(testUsername);
        expect(form.password).to.equal(testPassword);
        return Promise.resolve(expectedBody);
      });

      return generateToken(testUsername, testPassword)
      .then(() => {
        api.__ResetDependency__('rp');
      });
    });
  });

  describe('#post', () => {
    it('should use the correct authorization header', () => {
      const token = 'testToken';
      api.__Rewire__('rp', ({ headers }) => {
        expect(headers.Authorization).to.equal(`Bearer ${token}`);
        return Promise.resolve();
      });

      api({ token }).post()
      .then(() => {
        api.__ResetDependency__('rp');
      });
    });

    it('should use method POST', () => {
      const token = 'testToken';

      api.__Rewire__('rp', ({ method }) => {
        expect(method).to.equal('POST');
        return Promise.resolve();
      });

      api({ token }).post()
      .then(() => {
        api.__ResetDependency__('rp');
      });
    });

    it('should post to the correct endpoint', () => {
      const token = 'testToken';
      const testEndpoint = '/test';

      api.__Rewire__('rp', ({ uri }) => {
        expect(uri).to.equal(BASE_URL + testEndpoint);
        return Promise.resolve();
      });

      api({ token }).post(testEndpoint)
      .then(() => {
        api.__ResetDependency__('rp');
      });
    });

    it('custom host', () => {
      const token = 'testToken';
      const testEndpoint = '/test';
      const host = 'https://super.safetyculture.io';

      api.__Rewire__('rp', ({ uri }) => {
        expect(uri).to.equal(host + testEndpoint);
        return Promise.resolve();
      });

      api({ token, host }).post(testEndpoint)
      .then(() => {
        api.__ResetDependency__('rp');
      });
    });

    it('should pass the body of the request', () => {
      const token = 'testToken';
      const body = { test: 'test' };

      api.__Rewire__('rp', (opts) => {
        expect(opts.body).to.equal(body);
        return Promise.resolve();
      });

      api({ token }).post('/test', { body })
      .then(() => {
        api.__ResetDependency__('rp');
      });
    });
  });

  describe('#get', () => {
    it('should use the correct authorization header', () => {
      const token = 'testToken';
      api.__Rewire__('rp', ({ headers }) => {
        expect(headers.Authorization).to.equal(`Bearer ${token}`);
        return Promise.resolve();
      });

      api({ token }).get()
      .then(() => {
        api.__ResetDependency__('rp');
      });
    });

    it('should get from the correct endpoint', () => {
      const token = 'testToken';
      const testEndpoint = '/test';

      api.__Rewire__('rp', ({ uri }) => {
        expect(uri).to.equal(BASE_URL + testEndpoint);
        return Promise.resolve();
      });

      api({ token }).get(testEndpoint)
      .then(() => {
        api.__ResetDependency__('rp');
      });
    });

    it('should pass through other options', () => {
      const token = 'testToken';
      const qs = { test: 'test' };

      api.__Rewire__('rp', (opts) => {
        expect(opts.qs).to.equal(qs);
        return Promise.resolve();
      });

      api({ token }).get('/test', { qs })
      .then(() => {
        api.__ResetDependency__('rp');
      });
    });

    it('should encode arrays using querystring', () => {
      const token = 'testToken';
      const qs = { pets: ['cat', 'dog'] };

      api.__Rewire__('rp', (opts) => {
        expect(opts.qs).to.equal(qs);
        expect(opts.useQuerystring).to.equal(true);
        return Promise.resolve();
      });

      api({ token }).get('/test', { qs })
      .then(() => {
        api.__ResetDependency__('rp');
      });
    });
  });
});
