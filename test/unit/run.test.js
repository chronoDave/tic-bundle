const test = require('tape');
const fs = require('fs');
const path = require('path');
const { EOL } = require('os');

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

  run(config);

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

  run(config);

  const fileData = fs.readFileSync(file, { encoding: 'utf-8' });

  t.true(fileData.includes(author));

  fs.unlinkSync(file);

  t.end();
});

test('[run] transforms output if `after` is provided', t => {
  const name = 'output';
  const type = 'js';

  const config = createConfig({
    files: ['createConfig.js', 'run.js'],
    output: { path: __dirname, name },
    after: () => ''
  });
  const file = path.resolve(__dirname, `${name}.${type}`);

  run(config);

  t.true(fs.existsSync(file), 'creates output file');

  const fileData = fs.readFileSync(file, { encoding: 'utf-8' });

  t.equal(fileData, `// script: js${EOL}// license: MIT License (change this to your license of choice)${EOL}${EOL}`, 'overrides bundle output');

  fs.unlinkSync(file);

  t.end();
});
