const objectGet = require('lodash.get');

/**
 * Create config file
 * @param {object} config - Config
 */
module.exports = config => {
  const defaultConfig = {
    root: 'src',
    metadata: {
      title: null,
      author: null,
      desc: null,
      script: 'js',
      input: null,
      saveid: null
    },
    output: {
      path: './',
      extension: 'js',
      name: 'build'
    },
    files: [],
    after: bundle => bundle
  };

  try {
    const normalizeString = key => {
      const value = objectGet(config, key);
      if (typeof value !== 'string') return objectGet(defaultConfig, key);
      return value;
    };

    const normalizeArray = (key, filter) => {
      const value = objectGet(config, key);
      if (!Array.isArray(value) || value.some(filter)) return objectGet(defaultConfig, key);
      return value;
    };

    const normalizeFunc = key => {
      const value = objectGet(config, key);
      if (typeof value !== 'function') return objectGet(defaultConfig, key);
      return value;
    };

    return ({
      root: normalizeString('root'),
      ignore: normalizeArray('ignore', value => typeof value !== 'string'),
      metadata: {
        title: normalizeString('metadata.title'),
        author: normalizeString('metadata.author'),
        description: normalizeString('metadata.description'),
        script: normalizeString('metadata.script'),
        input: normalizeString('metadata.input'),
        saveid: normalizeString('metadata.saveid')
      },
      output: {
        path: normalizeString('output.path'),
        extension: normalizeString('output.extension'),
        name: normalizeString('output.name')
      },
      files: normalizeArray('files', value => typeof value !== 'string'),
      after: normalizeFunc('after')
    });
  } catch (err) {
    console.error(`[tic-bundle] ${err.message}`);
    console.info('[tic-bundle] Using default config');

    return defaultConfig;
  }
};
