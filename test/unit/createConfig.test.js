const test = require('tape');

const createConfig = require('../../src/createConfig');

test('[createConfig] creates valid config file if no config file is found', t => {
  const config = createConfig();

  t.equal(
    config.root,
    'src',
    'creates valid config file'
  );

  t.end();
});

test('[createConfig] normalizes invalid config values', t => {
  const root = 'input';
  const wait = '100';
  const config = createConfig({ root, test: 'value', wait });

  t.equal(config.root, root, 'does not overwrite valid value');
  t.false(config.test, 'does not create invalid key');
  t.notEqual(config.wait, wait, 'overwrites invalid value');

  t.end();
});

test('[createConfig] creates default config file', t => {
  t.deepEqual(
    createConfig(),
    {
      root: 'src',
      wait: 200,
      metadata: {
        title: null,
        author: null,
        desc: null,
        script: 'js',
        site: null,
        license: 'MIT License (change this to your license of choice)',
        version: null,
        input: null,
        saveid: null
      },
      output: {
        path: './',
        extension: 'js',
        name: 'build'
      },
      files: [],
      assets: [],
      after: null
    },
    'creates valid default config'
  );

  t.end();
});
