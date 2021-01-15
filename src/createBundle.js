const path = require('path');
const fs = require('fs');

/**
 * Create bundled file
 * @param {string} root
 * @param {string[]} files
 */
module.exports = (root, files) => files
  .map(file => {
    try {
      const fileData = fs.readFileSync(
        path.resolve(root, file),
        { encoding: 'utf-8' }
      );

      return fileData.trim();
    } catch (err) {
      console.error(`[tic-bundle] ${err.message}`);
      return null;
    }
  })
  .join('\n\n');
