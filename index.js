const glob = require('glob');
const fs = require('fs');
const Babel = require('@babel/standalone');

const globPromise = (path, options = {}) => new Promise((resolve, reject) => (
  glob(path, options, (err, files) => {
    if (err) return reject(err);
    return resolve(files);
  })));

const bundle = async () => {
  const files = await globPromise('src/*.js');

  const outputFile = files
    .map(file => {
      const rawFile = fs.readFileSync(file, 'utf-8');

      const header = rawFile.split('\n').shift();
      const body = rawFile.split('\n').slice(2).join('\n');

      return ({ header, body });
    })
    .sort((a, b) => a.header - b.header)
    .map(({ body }) => body)
    .join('\n');

  const { code } = Babel.transform(outputFile, {
    presets: ['env'],
    sourceType: 'script',
    retainLines: true
  });

  fs.writeFileSync('build.js', code);
};

bundle();
