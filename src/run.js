const path = require('path');
const fs = require('fs');
const { EOL } = require('os');

const createBundle = require('./createBundle');
const serialiseMetadata = require('./serialiseMetadata');

/**
 * Bundle
 * @param {object} config - Config
 * @param {string} config.root
 * @param {string[]} config.files
 * @param {function} config.after
 * @param {object} config.output
 * @param {string} config.output.path
 * @param {string} config.output.name
 * @param {string} config.output.extension
 * @param {object} config.metadata
 * @param {string} config.metadata.title
 * @param {string} config.metadata.author
 * @param {string} config.metadata.desc
 * @param {string} config.metadata.script
 * @param {string} config.metadata.input
 * @param {string} config.metadata.saveid
 */
module.exports = config => {
  const bundle = createBundle(config);

  fs.writeFileSync(
    path.resolve(
      config.output.path,
      `${config.output.name}.${config.output.extension}`
    ),
    [
      serialiseMetadata(config),
      typeof config.after === 'function' ?
        config.after(bundle) :
        bundle
    ].join(`${EOL}${EOL}`)
  );
};
