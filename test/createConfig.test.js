const test = require('tape');

const createConfig = require('../src/createConfig');

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
  const after = bundle => bundle.trim();
  const root = 0;
  const config = createConfig({ root, test: 'value', after });

  t.equal(
    config.root,
    'src',
    'normalizes invalid value'
  );
  t.false(config.test, 'does not contain invalid key');
  t.equal(config.after, after, 'retains valid value');

  t.end();
});
