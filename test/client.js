import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

import Client from '../src/client';

describe('Client', () => {
  it('should return an object with required api resources', () => {
    const token = 'testToken';
    const client = Client({ token });
    expect(client.audits).to.exist;
  });

  it('should set a custom host', () => {
    const apiUrl = 'https://super.safetyculture.io';
    const token = 'testToken';
    const client = Client({ token, apiUrl });
    expect(client.apiUrl).to.equal(apiUrl);
  });
});
