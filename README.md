<div align="center">
  <!-- replace with accurate logo e.g from https://worldvectorlogo.com/ -->
  <img width="150" height="150" src="./terminal-logo.png">
  <a href="https://facebook.github.io/jest/">
    <img width="150" height="150" vspace="" hspace="25" src="https://user-images.githubusercontent.com/2440089/37489554-6f776bd2-286e-11e8-862f-cb6c398cf752.png">
  </a>
  <h1>jest-runner-executor</h1>
  <p>A general purpose executor that allows to run any script as a Jest runner.</p>
</div>

## Usage

### Install

Install `jest`_(it needs Jest 21+)_ and `jest-runner-executor`

```bash
yarn add --dev jest jest-runner-executor

# or with NPM

npm install --save-dev jest jest-runner-executor
```

### Add it to your Jest config

#### Standalone

In your `package.json`

```json
{
  "jest": {
    "runner": "jest-runner-executor",
    "moduleFileExtensions": [
      /* whatever file you wish to match */
    ],
    "testMatch": [
      /* whatever paths you wish to match */
    ]
  }
}
```

Or in `jest.config.js`

```js
module.exports = {
  runner: 'jest-runner-executor',
  moduleFileExtensions: [
    /* whatever file you wish to match */
  ],
  testMatch: [
    /* whatever paths you wish to match */
  ],
};
```

Please update `testMatch` to match your project folder structure.

#### Alongside other runners

It is recommended to use the [`projects`](https://facebook.github.io/jest/docs/en/configuration.html#projects-array-string-projectconfig) configuration option to run multiple Jest runners simultaneously.

If you are using Jest <22.0.5, you can use multiple Jest configuration files and supply the paths to those files in the `projects` option. For example:

```js
// jest-test.config.js
module.exports = {
  // your Jest test options
  displayName: 'test',
};

// jest-executor.config.js
module.exports = {
  // your jest-runner-executor options
  runner: 'jest-runner-executor',
  displayName: 'markdown',
  moduleFileExtensions: [
    /* whatever file you wish to match */
  ],
  testMatch: [
    /* whatever paths you wish to match */
  ],
};
```

In your `package.json`:

```json
{
  "jest": {
    "projects": [
      "<rootDir>/jest.test.config.js",
      "<rootDir>/jest.markdown.config.js"
    ]
  }
}
```

Or in `jest.config.js`:

```js
module.exports = {
  projects: [
    '<rootDir>/jest.test.config.js',
    '<rootDir>/jest.markdown.config.js',
  ],
};
```

If you are using Jest >=22.0.5, you can supply an array of project configuration objects instead. In your `package.json`:

```json
{
  "jest": {
    "projects": [
      {
        "displayName": "test"
      },
      {
        "runner": "jest-runner-executor",
        "displayName": "markdown",
        "moduleFileExtensions": [
          /* whatever file you wish to match */
        ],
        "testMatch": [
          /* whatever paths you wish to match */
        ]
      }
    ]
  }
}
```

Or in `jest.config.js`:

```js
module.exports = {
  projects: [
    {
      displayName: 'test',
    },
    {
      runner: 'jest-runner-executor',
      displayName: 'markdown',
      moduleFileExtensions: [
        /* whatever file you wish to match */
      ],
      testMatch: [
        /* whatever paths you wish to match */
      ],
    },
  ],
};
```

### Run Jest

```bash
yarn test
```

## Options

This project uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig), so you can provide config via:

- a `jest-runner-executor` property in your `package.json`
- a `jest-runner-executor.config.js` JS file
- a `.jest-runner-executorrc` JSON file

In `package.json`

```json
{
  "jest-runner-executor": {
    "binaryPath": "/path/to/file",
    "cliOptions": {
      // Options here as key-value
    }
  }
}
```

The `binaryPath` must be an absolute path, or the name of a globally installed binary.
You can also provide a template variable `<rootDir>` to reference local paths within your repository.

or in `jest-runner-executor.config.js`

```js
module.exports = {
  binaryPath: '',
  cliOptions: {
    // Options here as key-value
  },
};
```

### cliOptions

All passed options will be normalized and forwarded to the binary.

## Multiple executors

You can configure multiple executors to run with this jest runner. In the `jest-runner-executor` config file, simply return/export an array of config objects instead of a single one. **Important** is that each config contains a `matchDisplayName` with the reference to the `displayName` used in the jest project config.

For example, given some config to lint markdown files:

```js
// jest.markdown.config.js
module.exports = {
  runner: 'jest-runner-executor',
  displayName: 'markdown',
  moduleFileExtensions: ['md'],
  testMatch: ['**/*.md'],
};
```

Then the `jest-runner-executor.config.js` should contain an array of configs with the matching display names:

```js
module.exports = [
  {
    matchDisplayName: 'markdown',
    binaryPath: '<rootDir>/node_modules/.bin/remark',
    cliOptions: {
      quiet: true,
    },
  },
];
```
