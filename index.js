#!/usr/bin/env node
const minimist = require('minimist');
const fs = require('fs');
const path = require('path');
const deepmerge = require('deepmerge');
const chokidar = require('chokidar');
const glob = require('glob');
const Babel = require('@babel/standalone');

const argv = minimist(process.argv.slice(2), {
  alias: {
    config: 'c',
    output: 'o',
    name: 'n'
  }
});

const defaultConfig = {
  entry: argv._ || 'src',
  output: {
    path: argv.output || './',
    filename: argv.name || 'build',
  },
  build: {
    order: {},
    ignore: ['ignore']
  },
  babel: {}
};

const getConfigFile = () => new Promise(resolve => {
  const configPath = path.resolve(__dirname, argv.config || '.ticbundle.json');
  fs.readFile(configPath, (err, file) => {
    if (err || !file) {
      if (argv.config) {
        console.error('\x1b[31m', `[tic-bundle] ${err.message || `No file found: ${configPath}`}`, '\x1b[0m');
      }
      console.info(' [tic-bundle] Using default config');
      resolve(defaultConfig);
    } else {
      console.info(` [tic-bundle] Using ${argv.config}`);
      resolve(deepmerge(
        defaultConfig,
        JSON.parse(file),
        { arrayMerge: (a, b) => b }
      ));
    }
  });
});

const bundle = async () => {
  const config = await getConfigFile();
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
    .on('ready', () => {
      console.log('\x1b[32m', `[tic-bundle] watching ${filePattern}`, '\x1b[0m');
    })
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

        console.log(`[tic-bundle] generated build file (${bundleEnd.getTime() - bundleStart.getTime()}ms)`);
      }
    });
};

bundle();
