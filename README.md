![tic-bundle logo](https://i.imgur.com/YpexCm4.png)

[![license GPLv3](https://img.shields.io/badge/license-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![npm](https://img.shields.io/npm/v/tic-bundle?label=npm)](https://www.npmjs.com/package/tic-bundle)
[![minzip size](https://img.shields.io/bundlephobia/minzip/tic-bundle.svg)](https://bundlephobia.com/result?p=tic-bundle)

# tic-bundle

Simple CLI tool for bundling JavaScript code for [TIC-80](https://tic.computer/). Initially written for JavaScript, but now supports any language!

By default, `tic-bundle` simply bundels your files together, but [Babel](https://babeljs.io/docs/en/), can be used to transpile / transform your JavaScript code.

 - [Installation](#installation)
 - [Example](#example)
 - [Usage](#usage)
 - [Configuration](#configuration)
   - [Options](#options)
   - [Babel](#babel)
 - [License](./LICENSE)
 - [Donating](#donating)


## Installation

```
// Yarn
yarn add tic-bundle --dev --prod

// Yarn (without Babel)
yarn add tic-bundle --dev --prod --ignore-optional

// Npm
npm install tic-bundle --save-dev

// Npm (without Babel)
npm install tic-bundle --save-dev --no-optional --only=prod
```

## Example

<b>Input</b>

`src/3_ui.js`

```
function ui() {
  return 'ui';
};
```

`src/1_main.js`

```
function TIC() {

};
```

`src/2_ignore.js`

```
// This is ignored
```

<b>Output</b>

`build.js`

```
// script: js

function TIC() {

};

function ui() {
  return 'ui';
};
```

## Usage

`package.json`

```JSON
{
  "scripts": {
    "watch": "tic-bundle"
  }
}
```

<b>CLI options</b>

 - `-e / --entry` Folder to watch.
 - `-n / --name` Bundled file name.
 - `-o / --output` Bundled file output path.
 - `-c / --config` Path to config file.

## Configuration

`tic-bundle` supports config files. By default, `tic-bundle` looks for a `.ticbundle.js` file in the current directory, but an alternative location can be specified using `-c <file>` or `--config <file>`. 

The specificity is as folows:

 - CLI argument
 - `.ticbundle.js`
 - `.ticbundle.json`
 - Default values

<b>Default config</b>

```JSON
{
  "entry": "src",
  "metadata": ["// script: js"],
  "output": {
    "path": "./",
    "name": "build",
  },
  "build": {
    "order": {},
    "ignore": ["**/ignore.*.js"]
  },
  "babel": null
}
```

### Options

 - `entry` (default `src`) - Folder to watch.
 - `metadata` (default `// script: js`) - TIC-80 metadata header.
 - `output.path` (default `./`) - Bundled file output path.
 - `output.name` (default `build`) - Bundled file name.
 - `build.order` (default `{}`) - Order to bundle files in. This is an object containing filename and index. For example `{ build: 3 }` would put `build.js` on the 3rd position. If the file is not found in `build.order`, `tic-bundle` sorts on filename, but `_` can be used as a delimiter. For example `2_index.js` would put `index.js` on the 2nd position.
 - `build.ignore` (default `['**/ignore.*.js']`) - Array of globs to ignore.
 - `babel` (default `null`) - [Babel options](https://babeljs.io/docs/en/options).

### Babel

`tic-bundle` supports [Babel](https://babeljs.io/docs/en/), which can be used to transpile / transform your code. For example, Babel can be used to remove comments from your code or [transform arrow functions](https://babeljs.io/docs/en/babel-plugin-transform-arrow-functions).

Babel plugins require a `.js` config file.

<b>Example</b>

`.ticbundle.js`

```JS
const pluginTransformArrowFunctions = require('@babel/plugin-transform-arrow-functions');

module.exports = {
  babel: {
    sourceType: 'script',
    plugins: [
      pluginTransformArrowFunctions
    ],
    comments: false
  }
};

```

## Donating

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Y8Y41E23T)
