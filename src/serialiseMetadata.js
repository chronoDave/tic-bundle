const { EOL } = require('os');

const { getCommentStyle } = require('./utils');

/**
 * Serialise config for insertion at top of output file
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
module.exports = config => Object
  .entries(config.metadata)
  .filter(([, value]) => value)
  .map(([key, value]) => `${getCommentStyle(config.metadata.script)} ${key}: ${value}`)
  .join(EOL);
