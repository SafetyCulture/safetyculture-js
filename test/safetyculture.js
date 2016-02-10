import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

import SafetyCulture from '../src/safetyculture';

describe('SafetyCulture', () => {
  it('should export a Client', () => {
    expect(SafetyCulture.Client).to.exist;
  });
});
