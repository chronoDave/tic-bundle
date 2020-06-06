const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const deepmerge = require('deepmerge');
const Babel = require('@babel/standalone');

const defaultConfig = {
  entry: 'src',
  output: {
    path: './',
    filename: 'build',
  },
  build: {
    order: {},
    ignore: ['ignore']
  },
  babel: {}
};

const getConfig = () => new Promise(resolve => {
  fs.readFile('config.json', (err, file) => {
    if (err || !file) {
      resolve(defaultConfig);
    } else {
      resolve(deepmerge(defaultConfig, JSON.parse(file), {
        arrayMerge: (a, b) => b
      }));
    }
  });
});

const bundle = async () => {
  const config = await getConfig();
  const filePattern = `${path.resolve(config.entry)}/**/*.js`;
  const ignored = config.build.ignore
    .reduce((acc, cur) => ([
      ...acc,
      `**/${cur}`,
      `**/${cur}.js`
    ]), [`**/${config.output.filename}.js`]);

  const getFileOrder = filePath => {
    const fileName = filePath.split('/').pop().split('.').shift();
    if (config.build.order && config.build.order[fileName]) {
      return config.build.order[fileName];
    }
    return parseInt(fileName.split('_').shift(), 10);
  };

  const createBuildFile = files => files
    .map(file => [getFileOrder(file), file])
    .sort((a, b) => a[0] - b[0])
    .map(([, file]) => fs.readFileSync(file, 'utf-8').trim())
    .join('\n\n');

  chokidar
    .watch(filePattern, { ignored, ignoreInitial: true })
    .on('all', event => {
      if (event === 'add' || event === 'change') {
        const bundleStart = new Date();

        const files = glob.sync(filePattern, {
          ignore: ignored,
          nosort: true
        });
        const buildFile = createBuildFile(files);

        const { code } = Babel.transform(buildFile, {
          presets: ['env'],
          sourceType: 'script',
          parserOpts: {
            strictMode: true
          },
          ...config.babel
        });

        fs.writeFileSync(
          path.resolve(config.output.path, `${config.output.filename}.js`),
          `// script: js\n\n${code}`
        );

        const bundleEnd = new Date();

        console.log(`Generated build file (${bundleEnd.getTime() - bundleStart.getTime()}ms)`);
      }
    });
};

bundle();
