const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const Babel = require('@babel/standalone');

const getConfig = () => new Promise(resolve => (
  fs.readFile('config.json', (err, file) => {
    const defaultConfig = {
      src: 'src',
      output: './',
      ignore: ['ignore'],
      name: 'build'
    };

    if (err || !file) {
      resolve(defaultConfig);
    } else {
      resolve({
        ...defaultConfig,
        ...JSON.parse(file)
      });
    }
  })
));

const bundle = async () => {
  const config = await getConfig();
  const srcFiles = path.resolve(config.src, '*.js');

  chokidar
    .watch(srcFiles, { ignored: new RegExp(config.ignore.join('|')) })
    .on('all', () => {
      console.log(`[${new Date().toISOString()}] Folder change detected`);

      const files = glob.sync(srcFiles);
      const buildFile = files
        .filter(file => config.ignore
          .map(item => file.includes(item))
          .filter(item => item)
          .length === 0)
        .map(file => ({
          order: file.split('_').shift(),
          body: fs.readFileSync(file, 'utf-8')
        }))
        .sort((a, b) => a.order - b.order)
        .map(({ body }) => body.trim())
        .join('\n\n');

      const { code } = Babel.transform(buildFile, {
        presets: ['env'],
        sourceType: 'script',
        retainLines: true
      });

      fs.writeFileSync(
        path.resolve(config.output, `${config.name}.js`),
        `// script: js\n\n${code}`
      );

      console.log(`[${new Date().toISOString()}] Build file generated`);
    });
};

bundle();
