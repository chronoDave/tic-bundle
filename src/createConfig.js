const get = require('lodash.get');

/**
 * Create config file
 * @param {object} config - Config
 */
module.exports = config => {
  const normalize = validate => (key, valueDefault) => {
    if (typeof config !== 'object') return valueDefault;

    const valueConfig = get(config, key);
    if (validate(valueConfig)) return valueConfig;
    if (valueConfig !== undefined) console.error(`[tic-bundle] Invalid property: ${key}`);

    return valueDefault;
  };

  const normalizeString = normalize(x => typeof x === 'string');
  const normalizeNumber = normalize(x => typeof x === 'number');
  const normalizeArray = normalize(x => Array.isArray(x) && x.every(y => typeof y === 'string'));
  const normalizeFunc = normalize(x => typeof x === 'function');

  return ({
    root: normalizeString('root', 'src'),
    wait: normalizeNumber('wait', 200),
    metadata: {
      title: normalizeString('metadata.title', null),
      author: normalizeString('metadata.author', null),
      desc: normalizeString('metadata.desc', null),
      script: normalizeString('metadata.script', 'js'),
      site: normalizeString('metadata.site', null),
      license: normalizeString('metadata.license', 'MIT License (change this to your license of choice)'),
      version: normalizeString('metadata.version', null),
      input: normalizeString('metadata.input', null),
      saveid: normalizeString('metadata.saveid', null),
    },
    output: {
      path: normalizeString('output.path', './'),
      extension: normalizeString('output.extension', 'js'),
      name: normalizeString('output.name', 'build')
    },
    files: normalizeArray('files', []),
    assets: normalizeArray('assets', []),
    after: normalizeFunc('after', null)
  });
};
