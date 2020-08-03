const glob = require('fast-glob');
const Babel = require('@babel/standalone');
const deepmerge = require('deepmerge');
const path = require('path');
const fs = require('fs');

/**
 * @param {string} file - Config file path where root is `process.cwd()`
 */
const createConfig = file => {
  const defaults = {
    entry: 'src',
    output: {
      path: './',
      name: 'build'
    },
    build: {
      order: {},
      ignore: ['**/ignore.*.js']
    },
    babel: {}
  };

  try {
    const configFile = JSON
      .parse(fs.readFileSync(path.resolve(process.cwd(), file)));
    console.log('\x1b[36m%s\x1b[0m', `[tic-bundle] Using ${file}`);
    return deepmerge(
      defaults,
      configFile,
      { arrayMerge: (a, b) => b }
    );
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', `[tic-bundle] ${err.message || `No file found: ${file}`}`);
    console.log('\x1b[36m%s\x1b[0m', '[tic-bundle] Using default config');
    return defaults;
  }
};

const getFileIndex = (file, list = {}) => {
  const fileName = file.match(/(?=[^/]+$).+?(?=\.[^.]+$)/g)[0];
  if (list && list[fileName]) return list[fileName];
  if (fileName.includes('_')) return parseInt(fileName.split('_').shift(), 10);
  return null;
};

/**
 * @param {string} entry - Root folder
 * @param {object} options
 * @param {string[]} options.ignored - Ignored files & folders (default `[]`)
 * @param {object} options.fileOrder - File build order `{ <filename>: Number }` (default `{}`)
 * @param {object} options.babel - Babel options (default `{}`)
 */
const createBundle = async (entry, {
  ignore = [],
  fileOrder = {},
  babel = {}
} = {}) => {
  try {
    if (!entry) throw new Error(`Invalid entry: ${entry}`);

    const files = await glob('**/*.js', { cwd: entry, ignore, absolute: true });
    const buildFile = files
      .map((file, i) => ({ index: getFileIndex(file, fileOrder) || i, file }))
      .sort((a, b) => a.index - b.index)
      .map(({ file }) => fs.readFileSync(file, { encoding: 'utf-8' }).trim())
      .join('\n\n');
    const { code } = Babel.transform(buildFile, {
      presets: ['env'],
      sourceType: 'script',
      parserOpts: { strictMode: true },
      ...babel
    });

    return Promise.resolve(code);
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = {
  createConfig,
  getFileIndex,
  createBundle
};
