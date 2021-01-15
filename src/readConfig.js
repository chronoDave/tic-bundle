const fs = require('fs');

/**
 * Read config file
 * @param filePath - Absolute path
 */
module.exports = path => {
  const fileType = path.split('.').pop();

  switch (fileType) {
    case 'js':
      return require(path);
    case 'json':
      return JSON.parse(fs.readFileSync(path));
    default:
      return null;
  }
};
