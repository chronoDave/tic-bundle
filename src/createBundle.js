const path = require('path');
const fs = require('fs');

/**
 * Create bundled file
 * @param {string} root
 * @param {string[]} files
 * @param {string} extension
 */
module.exports = (root, files, extension) => files
  .map(file => (fs
    .readFileSync(path.resolve(root, `${file}.${extension}`), { encoding: 'utf-8' })
    .trim()
  ))
  .join('\n\n');
