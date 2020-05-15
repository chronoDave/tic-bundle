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
      const order = file
        .split('_')
        .pop()
        .split('.')
        .shift();
      const body = fs.readFileSync(file, 'utf-8');

      return ({ order, body });
    })
    .sort((a, b) => a.order - b.order)
    .map(({ body }) => body)
    .join('\n');

  const ticFile = ['// script: js', outputFile].join('\n\n');

  const { code } = Babel.transform(ticFile, {
    presets: ['env'],
    sourceType: 'script',
    retainLines: true
  });

  fs.writeFileSync('build.js', code);
};

bundle();
