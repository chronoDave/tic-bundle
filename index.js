const glob = require('glob');
const fs = require('fs');
const Babel = require('@babel/standalone');

const bundle = async (path, name) => {
  const files = glob.sync(path);

  const outputFile = files
    .filter(file => !file.includes('ignore'))
    .map(file => ({
      order: file.split('_').shift(),
      body: fs.readFileSync(file, 'utf-8')
    }))
    .sort((a, b) => a.order - b.order)
    .map(({ body }) => body.trim())
    .join('\n\n');

  const { code } = Babel.transform(outputFile, {
    presets: ['env'],
    sourceType: 'script',
    retainLines: true
  });

  fs.writeFileSync(`${name}.js`, `// script: js\n\n${code}`);
};

bundle('src/*.js', 'build');
