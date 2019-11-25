const path = require('path');
const run = require('./run');

const createJestConfig = custom => ({
  rootDir: path.join(__dirname, '../'),
  ...custom,
});

const createTestByFileExt = ext => () => {
  describe('good fixture', () => {
    let result;
    let fileName;
    beforeEach(async () => {
      fileName = `good.${ext}`;
      result = await run({
        testPath: path.join(__dirname, 'fixtures', fileName),
        config: createJestConfig(),
        globalConfig: {},
      });
    });
    it('should pass the lint check', () => {
      expect(result.numPassingTests).toBe(1);
    });
    it('should not fail the test', () => {
      expect(result.numFailingTests).toBe(0);
    });
  });
  describe('bad fixture', () => {
    let result;
    let fileName;
    beforeEach(async () => {
      fileName = `bad.${ext}`;
      result = await run({
        testPath: path.join(__dirname, 'fixtures', fileName),
        config: createJestConfig(),
        globalConfig: {},
      });
    });
    it('should not pass the lint check', () => {
      expect(result.numPassingTests).toBe(0);
    });
    it('should fail the test', () => {
      expect(result.numFailingTests).toBe(1);
    });
  });
};

describe('linter', () => {
  // eslint-disable-next-line jest/valid-describe
  describe('.md', createTestByFileExt('md'));
});
