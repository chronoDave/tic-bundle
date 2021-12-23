const test = require('tape');
const fs = require('fs');
const path = require('path');

const createConfig = require('../../src/createConfig');
const run = require('../../src/run');

test('[run] creates valid bundle file', t => {
  const name = 'output';
  const type = 'js';

  const config = createConfig({
    files: ['createConfig.js', 'run.js'],
    output: { path: __dirname, name }
  });
  const file = path.resolve(__dirname, `${name}.${type}`);

  run({}, config, type);

  t.true(fs.existsSync(file), 'creates output file');

  const fileData = fs.readFileSync(file, { encoding: 'utf-8' });

  t.true(fileData.includes(createConfig));
  t.true(fileData.includes(run));

  fs.unlinkSync(file);

  t.end();
});

test('[run] accepts metadata', t => {
  const name = 'output';
  const author = 'test';

  const config = createConfig({
    files: ['createConfig.js', 'run.js'],
    metadata: { author },
    output: { path: __dirname, name }
  });
  const file = path.resolve(__dirname, `${name}.js`);

  run({}, config);

  const fileData = fs.readFileSync(file, { encoding: 'utf-8' });

  t.true(fileData.includes(author));

  fs.unlinkSync(file);

  t.end();
});

test('[run] formats metadata for javascript when `script` is `js`', t => {
  testMetadataFormat(t, 'js', '// script:');
});

test('[run] formats metadata for lua when `script` is `lua`', t => {
  testMetadataFormat(t, 'lua', '-- script:');
});

test('[run] formats metadata for moon when `script` is `moon`', t => {
  testMetadataFormat(t, 'moon', '-- script:');
});

test('[run] formats metadata for fennel when `script` is `fennel`', t => {
  testMetadataFormat(t, 'fennel', ';; script:');
})

test('[run] formats metadata for ruby when `script` is `ruby`', t => {
  testMetadataFormat(t, 'ruby', '# script:');
});

test('[run] formats metadata for wren when `script` is `wren`', t => {
  testMetadataFormat(t, 'wren', '// script:');
})

test('[run] formats metadata for squirrel when `script` is `squirrel`', t => {
  testMetadataFormat(t, 'squirrel', '// script:');
})

test('[run] transforms output if `after` is provided', t => {
  const name = 'output';
  const type = 'js';

  const config = createConfig({
    files: ['createConfig.js', 'run.js'],
    output: { path: __dirname, name },
    after: () => ''
  });
  const file = path.resolve(__dirname, `${name}.${type}`);

  run({}, config, type);

  t.true(fs.existsSync(file), 'creates output file');

  const fileData = fs.readFileSync(file, { encoding: 'utf-8' });

  t.equal(fileData, '// script: js\n\n', 'overrides bundle output');

  fs.unlinkSync(file);

  t.end();
});

let testMetadataFormat = (t, script, expectedMetadataSnippet) => {
  const name = 'output';

  const config = createConfig({
    files: ['createConfig.js', 'run.js'],
    metadata: { script },
    output: { path: __dirname, name }
  });
  const file = path.resolve(__dirname, `${name}.js`);

  run({}, config);

  const fileData = fs.readFileSync(file, { encoding: 'utf-8' });

  t.true(fileData.includes(expectedMetadataSnippet));

  fs.unlinkSync(file);

  t.end();
}
