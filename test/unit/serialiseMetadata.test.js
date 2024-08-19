const test = require('tape');

const createConfig = require('../../src/createConfig');
const serialiseMetadata = require('../../src/serialiseMetadata');

const testMetadataFormat = (script, expected) => t => {
  const name = 'output';

  const config = createConfig({
    files: ['createConfig.js', 'run.js'],
    metadata: { script },
    output: { path: __dirname, name }
  });

  t.true(serialiseMetadata(config).includes(expected));

  t.end();
};

[
  { lang: 'javascript', script: 'js', expected: '// script:' },
  { lang: 'lua', script: 'lua', expected: '-- script:' },
  { lang: 'moon', script: 'moon', expected: '-- script:' },
  { lang: 'fennel', script: 'fennel', expected: ';; script:' },
  { lang: 'ruby', script: 'ruby', expected: '# script:' },
  { lang: 'python', script: 'python', expected: '# script:' },
  { lang: 'wren', script: 'wren', expected: '// script:' },
  { lang: 'squirrel', script: 'squirrel', expected: '// script:' }
].forEach(({ lang, script, expected }) => test(
  `[serialiseMetadata] formats metadata for ${lang} when 'script' is '${script}'`,
  testMetadataFormat(script, expected)
));
