# tic80-bundle

![tic80-bundle logo](https://i.imgur.com/HqfxnMH.png)

Simple file bundler for JavaScript development in [TIC-80](https://tic.computer/).

`tic80-bundle` comes with [Babel](https://babeljs.io/docs/en/babel-preset-env) pre-installed. Please note that polyfills are not supported.

## Installation

```
// Yarn
yarn

// Npm
npm install
```

## Usage

```
yarn start
```

## Configuration

Configuration is optional, `tic80-bundle` will watch `src` by default and output `build.js` in the current directory. `ignore` directory and files containing `ignore` are ignored by default.

`config.json`:

```
{
  entry: 'src', // Folder to watch for change
  output: {
    path: './', // Output path
    filename: 'build' // Build file name
  },
  build: {
    order: {} // Build order { <number>: <filename> }, e.g. { 3: 'main' },
    ignore: ['ignore'] // Array of file / folders to ignore
  },
  babel: {} // Babel options
}
```

<b>Example:</b>

`src/2_main.js`

```
const TIC = () => {

};
```

`src/3_ignore.js`

```
// This is ignored
```

`src/1_ui.js`

```
function ui() {
  return 'ui';
};
```

<b>Output:</b>

`build.js`

```
// script: js

var TIC = function TIC() {

};

function ui() {
  return 'ui';
};
```
