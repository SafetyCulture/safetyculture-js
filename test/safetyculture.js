import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

import SafetyCulture from '../src/index';

describe('SafetyCulture', () => {
  it('should export a Client', () => {
    expect(SafetyCulture).to.exist;
    expect(SafetyCulture.Client).to.exist;
  });
});
