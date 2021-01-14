const test = require('tape');

const createBundle = require('../src/createBundle');

test('[createBundle] creates valid bundle', t => {
  const bundle = createBundle(__dirname, [
    'createConfig.test',
    '../src/createBundle'
  ], 'js');

  t.true(bundle.includes('[createConfig]'), 'reads current dir');
  t.true(bundle.includes(createBundle.toString()), 'reads relative');

  t.end();
});
