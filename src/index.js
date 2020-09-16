const glob = require('fast-glob');
const deepmerge = require('deepmerge');
const path = require('path');
const fs = require('fs');

/**
 * @param {string} file - Config file path where root is `process.cwd()`
 */
const createConfig = file => {
  const defaults = {
    entry: 'src',
    metadata: ['// script: js'],
    output: {
      path: './',
      name: 'build'
    },
    build: {
      order: {},
      ignore: ['**/ignore.*.js']
    },
    babel: null
  };

  try {
    const configFile = path.resolve(process.cwd(), file);
    const fileType = configFile.split('.').pop();

    let config = null;
    switch (fileType) {
      case 'js':
        config = require(configFile);
        break;
      case 'json':
        config = JSON.parse(fs.readFileSync(configFile));
        break;
      default:
        throw new Error(`Invalid file type: ${fileType}`);
    }

    console.log(`[tic-bundle] Using ${file}`);
    return deepmerge(
      defaults,
      config,
      { arrayMerge: (a, b) => b }
    );
  } catch (err) {
    console.log('\x1b[31m%s\x1b[0m', `[tic-bundle] ${err.message || `No file found: ${file}`}`);
    console.log('[tic-bundle] Using default config');
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
  babel = null
} = {}) => {
  try {
    if (!entry) throw new Error(`Invalid entry: ${entry}`);

    const files = await glob('**/*.js', { cwd: entry, ignore, absolute: true });
    const buildFile = files
      .map((file, i) => ({ index: getFileIndex(file, fileOrder) || i, file }))
      .sort((a, b) => a.index - b.index)
      .map(({ file }) => fs.readFileSync(file, { encoding: 'utf-8' }).trim())
      .join('\n\n');

    if (babel) {
      const Babel = require('@babel/standalone');
      const { code } = Babel.transform(buildFile, babel);

      return Promise.resolve(code);
    }

    return Promise.resolve(buildFile);
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = {
  createConfig,
  getFileIndex,
  createBundle
};
