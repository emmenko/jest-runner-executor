module.exports = {
  '*.{md}': ['yarn format:md', 'git add'],
  '*.{js}': ['yarn format:js', 'git add'],
};
