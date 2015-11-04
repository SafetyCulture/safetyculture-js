import javascriptSdk, { Client } from '../../src/javascript-sdk';

describe('javascriptSdk', () => {
  it('should export a Client', () => {
    expect(Client).to.exist;
  });
});
