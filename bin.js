#!/usr/bin/env node
const path = require('path');
const minimist = require('minimist');
const chokidar = require('chokidar');

const createConfig = require('./src/createConfig');
const run = require('./src/run');

const args = minimist(process.argv.slice(2), {
  alias: {
    root: 'r',
    config: 'c',
    output: 'o',
    name: 'n',
    script: 's'
  }
});

const config = createConfig(
  args.config ||
  '.ticbundle.js' ||
  '.ticbundle.json'
);

const files = config.files.map(file => path.resolve(config.root, file));
const bundle = () => run(args, config);

chokidar
  .watch(files, { ignoreInitial: true })
  .on('ready', () => {
    console.group('[tic-bundle] watching files');
    files.forEach(file => console.info(file));
    console.groupEnd();

    bundle();
  })
  .on('add', bundle)
  .on('change', bundle);
