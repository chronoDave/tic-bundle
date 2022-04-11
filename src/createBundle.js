const path = require('path');
const fs = require('fs');
const { EOL } = require('os');

const { getCommentStyle } = require('./utils');

/**
 * Create bundled file
 * @param {object} config
 */
module.exports = config => {
  const REGEXP_ASSETS = new RegExp(`${getCommentStyle(config.metadata.script)}\\s<[^/]+[^>]+.`, 'gm');

  const getData = parse => file => {
    try {
      const data = fs.readFileSync(path.resolve(config.root, file), { encoding: 'utf-8' });
      return parse(data);
    } catch (err) {
      console.error(`[tic-bundle] ${err.message}`);
      return null;
    }
  };

  const fileData = config.files
    .map(getData(data => data.replace(REGEXP_ASSETS, '').trim()));
  const assetData = config.assets
    .map(getData(data => data.match(REGEXP_ASSETS).join(`${EOL}${EOL}`)));

  return [
    ...fileData,
    ...assetData
  ].join(`${EOL}${EOL}`);
};
