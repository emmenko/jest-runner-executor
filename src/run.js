const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { pass, fail } = require('create-jest-runner');
const kebabCase = require('lodash.kebabcase');
const loadConfig = require('./load-config');

module.exports = async ({ config: jestConfig, testPath }) => {
  const start = new Date();

  // Load the jest runner config
  const runnerConfig = loadConfig();

  // In case the config is for multiple executors, pick the one matching
  // the current jest config.
  const executorConfig = Array.isArray(runnerConfig)
    ? runnerConfig.find(
        ({ matchDisplayName }) => matchDisplayName === jestConfig.displayName
      )
    : runnerConfig;

  if (!executorConfig) {
    throw new Error(
      `Could not find a config for the jest-runner-exectutor (displayName: ${jestConfig.displayName})`
    );
  }

  // Resolve the binary path in case `<rootDir>` is being used.
  const binaryPath = executorConfig.binaryPath.replace(
    '<rootDir>',
    jestConfig.rootDir.replace(/\/?$/, '')
  );

  // Normalize options to be forwarded to the binary CLI
  const cliOptions = executorConfig.cliOptions || {};
  const normalizeOptions = Object.keys(cliOptions)
    .reduce((cliArguments, option) => {
      const cliArg = kebabCase(option);
      const cliVal = cliOptions[option];
      if (typeof cliVal === 'boolean' && cliVal)
        return cliArguments.concat(`--${cliArg}`);
      return cliArguments.concat(`--${cliArg}=${cliVal}`);
    }, [])
    .join(' ')
    .trim();

  // Build the string command
  const commandWithArgs = `${binaryPath} ${normalizeOptions}`.trim();

  let errorMessage;
  try {
    // Execute the command and handle error outputs
    const { stderr } = await exec(`${commandWithArgs} ${testPath}`.trim());
    if (stderr) errorMessage = stderr;
  } catch (error) {
    errorMessage = error.stderr || error.stdout;
  }

  if (errorMessage) {
    return Promise.resolve(
      fail({
        start,
        end: new Date(),
        test: {
          path: testPath,
          errorMessage,
        },
      })
    );
  }
  return Promise.resolve(
    pass({
      start,
      end: new Date(),
      test: { path: testPath },
    })
  );
};
