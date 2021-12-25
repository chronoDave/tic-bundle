const path = require('path');
const fs = require('fs');

const createBundle = require('./createBundle');
const serialiseMetadata = require('./serialiseMetadata');

/**
 * Bundle
 * @param {object} args - Cli
 * @param {string} args.root
 * @param {string} args.output
 * @param {string} args.name
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
 * @param {string} fileType - File extension
 */
module.exports = (args, config) => {
  const bundle = createBundle(
    args.root || config.root,
    config.files,
    config.output.extension
  );

  fs.writeFileSync(
    path.resolve(
      args.output || config.output.path,
      `${args.name || config.output.name}.${args.file || config.output.extension}`
    ),
    [
      serialiseMetadata(config),
      config.after ?
        config.after(bundle) :
        bundle
    ].join('\n\n')
  );
};
