module.exports = {
  runner: './src/index.js',
  displayName: 'markdown',
  moduleFileExtensions: ['md'],
  modulePathIgnorePatterns: ['fixtures'],
  testMatch: ['**/*.md'],
  watchPlugins: ['jest-watch-typeahead/filename'],
};
