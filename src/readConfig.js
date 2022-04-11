const fs = require('fs');
const path = require('path');

/**
 * Read config file
 * @param file - Absolute path to file
 */
module.exports = file => {
  const { ext } = path.parse(file);

  try {
    switch (ext) {
      case '.js':
        return require(file);
      case '.json':
        return JSON.parse(fs.readFileSync(file));
      default:
        return null;
    }
  } catch (err) {
    return null;
  }
};
