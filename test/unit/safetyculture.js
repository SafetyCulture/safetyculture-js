import SafetyCulture from '../../src/safetyculture';

describe('SafetyCulture', () => {
  it('should export a Client', () => {
    expect(SafetyCulture.Client).to.exist;
  });
});
