import { expect } from 'chai';

import { Client } from '../src/index';

describe('SafetyCulture', () => {
  it('should export a Client', () => {
    expect(Client).to.exist;
  });
});
