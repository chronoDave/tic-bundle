const fs = require('fs');
const path = require('path');
const test = require('tape');

const createBundle = require('../../src/createBundle');

test('[createBundle] creates valid bundle', t => {
  const bundle = createBundle({
    root: __dirname,
    metadata: {
      script: 'js'
    },
    files: [
      'createConfig.test.js',
      '../../src/createBundle.js'
    ],
    assets: []
  });

  t.true(bundle.includes('[createConfig]'), 'reads current dir');
  t.true(bundle.includes(createBundle.toString()), 'reads relative');

  t.end();
});

test('[createBundle] parses files correctly', t => {
  const file = fs.readFileSync(path.resolve(__dirname, '../assets/file.lua'), 'utf-8');

  const bundle = createBundle({
    root: __dirname,
    metadata: {
      script: 'lua'
    },
    files: [path.resolve(__dirname, '../assets/raw.lua')],
    assets: []
  });

  t.equals(
    bundle,
    file,
    'removes assets'
  );

  t.end();
});

test('[createBundle] parses assets correctly', t => {
  const asset = fs.readFileSync(path.resolve(__dirname, '../assets/asset.lua'), 'utf-8');

  const bundle = createBundle({
    root: __dirname,
    metadata: {
      script: 'lua'
    },
    files: [],
    assets: [
      path.resolve(__dirname, '../assets/raw.lua')
    ]
  });

  t.equals(
    bundle,
    asset,
    'removes assets'
  );

  t.end();
});
