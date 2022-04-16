#!/usr/bin/env node
const path = require('path');
const minimist = require('minimist');
const chokidar = require('chokidar');
const { performance } = require('perf_hooks');

const readConfig = require('./src/readConfig');
const createConfig = require('./src/createConfig');
const run = require('./src/run');

const args = minimist(process.argv.slice(2), {
  alias: {
    root: 'r',
    config: 'c',
    output: 'o',
    name: 'n',
    script: 's',
    file: 'f',
    wait: 'w',
    build: 'b'
  }
});

const config = createConfig(
  readConfig(path.resolve(process.cwd(), (args.config || ''))) ||
  readConfig(path.resolve(process.cwd(), '.ticbundle.js')) ||
  readConfig(path.resolve(process.cwd(), '.ticbundle.json')) ||
  {
    root: args.root,
    wait: typeof args.wait === 'string' && args.wait.length > 0 ?
      +args.wait :
      undefined,
    metadata: {
      script: args.script
    },
    output: {
      path: args.output,
      extension: args.file,
      name: args.name,
    }
  }
);

const files = config.files.map(file => path.resolve(config.root, file));
const bundle = () => {
  const ts = performance.now();
  run(config);
  console.info(`Generated bundle in: ${Math.round(performance.now() - ts)}ms`);
};

if (args.build) {
  console.info('[tic-bundle] creating bundle');
  bundle();
} else {
  chokidar
    .watch(files, {
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: config.wait
      }
    })
    .on('ready', () => {
      console.group('[tic-bundle] watching files');
      files.forEach(file => console.info(file));
      console.groupEnd();

      bundle();
    })
    .on('add', bundle)
    .on('change', bundle);
}
