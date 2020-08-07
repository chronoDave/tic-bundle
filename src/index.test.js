const test = require('tape');
const fs = require('fs');
const path = require('path');

const {
  createConfig,
  getFileIndex,
  createBundle
} = require('./index');

const configFile = path.resolve(__dirname, 'test.json');
const testPath = path.resolve(__dirname, 'files');
const testFiles = [
  { name: '0_file.js', content: '// 0_file.js' },
  { name: 'file.b.js', content: '// file.b.js' },
  { name: '2_file.js', content: '// 2_file.js' },
  { name: 'ignore.file.js', content: '// ignore.file.js' }
];

const createTestFolder = () => {
  fs.mkdirSync(testPath);
  testFiles.forEach(({ name, content }) => {
    fs.writeFileSync(path.resolve(testPath, name), content);
  });
};

const deleteTestFolder = () => {
  fs.rmdirSync(testPath, { recursive: true });
};

test('createConfig()', async t => {
  t.true(typeof createConfig() === 'object', 'should return default config if no file is found');

  fs.writeFileSync(configFile, JSON.stringify({ build: { order: { test: 1 } } }));

  t.equal(createConfig(configFile).build.order.test, 1, 'should use config file');

  fs.unlinkSync(configFile);

  t.end();
});

test('getFileIndex()', async t => {
  const list = { test: 3, 'te.st': 4 };

  t.equal(getFileIndex('test.js', list), list.test, 'should return index from list (file name)');
  t.equal(getFileIndex('path/to/file/test.js', list), list.test, 'should return index from list (file path)');
  t.equal(getFileIndex('te.st.js', list), list['te.st'], 'should return index from list (dot)');
  t.equal(getFileIndex('1_file.js'), 1, 'should return index based on file name');
  t.equal(getFileIndex('file.js'), null, 'should return null if index is not found');

  t.end();
});

test('createBundle()', async t => {
  try {
    await createBundle();
    t.fail('expected rejection');
  } catch (err) {
    t.pass('rejects if invalid entry is provided');
  }

  createTestFolder();

  try {
    await createBundle(testPath);
    t.pass('resolves if valid entry is provided');
  } catch (err) {
    t.fail(err.message);
  }

  try {
    const code = await createBundle(testPath, { ignore: ['**/ignore.*.js'] });
    t.false(code.includes('ignore.file.js'), 'should ignore files');
  } catch (err) {
    t.fail(err.message);
  }

  try {
    await createBundle(testPath, { babel: null });
    t.pass('resolves if babel is null');
  } catch (err) {
    t.fail(err.message);
  }

  try {
    const code = await createBundle(testPath, { fileOrder: { 'file.b': 1 } });
    code.split('\n\n').forEach((entry, i) => {
      t.equal(entry, testFiles[i].content, 'should be in correct order');
    });
  } catch (err) {
    t.fail(err.message);
  }

  deleteTestFolder();

  t.end();
});
