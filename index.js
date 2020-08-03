#!/usr/bin/env node
const minimist = require('minimist');
const chokidar = require('chokidar');
const { performance } = require('perf_hooks');
const path = require('path');
const fs = require('fs');

const {
  createConfig,
  createBundle
} = require('./src/index');

const args = minimist(process.argv.slice(2), {
  alias: {
    entry: 'e',
    config: 'c',
    output: 'o',
    name: 'n'
  }
});
const config = createConfig(args.config || '.ticbundle.json');
const glob = `${args.entry || config.entry}/**/*.js`;

const run = async () => {
  try {
    const ts = performance.now();
    const bundle = await createBundle(args.entry || config.entry, {
      ignore: config.ignore,
      fileOrder: config.build.order,
      babel: config.babel
    });

    fs.writeFileSync(
      path.resolve(
        args.output || config.output.path,
        `${args.name || config.output.name}.js`
      ),
      `// script: js\n\n${bundle}`
    );

    console.log(`[tic-bundle] generated build file (${Math.round(performance.now() - ts)}ms)`);
  } catch (err) {
    console.error(err);
  }
};

chokidar
  .watch(glob, { ignored: config.ignore, ignoreInitial: true })
  .on('ready', () => {
    console.log(`[tic-bundle] watching ${glob}`);
    run();
  })
  .on('all', event => {
    if (event === 'add' || event === 'change') run();
  });
