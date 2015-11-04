import Client from '../../src/client';

describe('Client', () => {
  it('should return an object with required api resources', () => {
    const token = 'testToken';
    const client = Client({ token });

    expect(client.audits).to.exist;
  });
});
