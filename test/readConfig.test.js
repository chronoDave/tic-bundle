const test = require('tape');
const fs = require('fs');
const path = require('path');

const readConfig = require('../src/readConfig');

test('[readConfig] should read .js config file', t => {
  const file = path.resolve(__dirname, 'config.js');

  fs.writeFileSync(file, 'module.exports = { debug: "value" }');

  try {
    t.equal(
      readConfig(file).debug,
      'value',
      'reads js config file'
    );
  } catch (err) {
    t.fail(err);
  }

  fs.unlinkSync(file);

  t.end();
});

test('[readConfig] should read .json config file', t => {
  const file = path.resolve(__dirname, 'config.json');

  fs.writeFileSync(file, JSON.stringify({ debug: 'value' }));

  try {
    t.equal(
      readConfig(file).debug,
      'value',
      'reads json config file'
    );
  } catch (err) {
    t.fail(err);
  }

  fs.unlinkSync(file);

  t.end();
});

test('[readConfig] should return null on invalid config', t => {
  t.equal(
    readConfig(path.resolve(__dirname, 'config.yml')),
    null,
    'returns null'
  );

  t.end();
});
