![tic-bundle logo](https://i.imgur.com/YpexCm4.png)

# tic-bundle

Simple CLI tool for bundling JavaScript code for [TIC-80](https://tic.computer/).

`tic-bundle` comes with [Babel](https://babeljs.io/docs/en/babel-preset-env) pre-installed. Please note that polyfills are not supported.

## Installation

```
// Yarn
yarn add tic-bundle --dev

// Npm
yarn install tic-bundle --save-dev
```

## Usage

`package.json`

```
{
  "scripts": {
    "watch": tic-bundle src
  }
}
```

### CLI arguments

 - `-n / --name` Bundled file name.
 - `-o / --output` Bundled file output path.
 - `-c / --config` Path to config file.

## Configuration

`tic-bundle` supports config files. By default, `tic-bundle` looks for a `.ticbundle.json` file in the current directory, but an alternative location can be specified using `-c <file>` or `--config <file>`. 

The specificity is as folows:

 - CLI argument
 - `.ticbundle.json`
 - Default values

<b>Default config</b>

```
{
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
}
```

### Options

 - `entry` (default `src`) - Folder to watch.
 - `output.path` (default `./`) - Bundled file output path.
 - `output.filename` (default `build`) - Bundled file name.
 - `build.order` (default `{}`) - Order to bundle files in. This is an object containing filename and index. For example `{ build: 3 }` would put `build.js` on the 3rd position. If the file is not found in `build.order`, `tic-bundle` sorts on filename, but `_` can be used as a delimiter. For example `2_index.js` would put `index.js` on the 2nd position.
 - `build.ignore` (default `['ignore']`) - Files & folders to ignore. Every values gets globbed into `**/<value>` and `**/<value>.js`. The output file is ignored by default.
 - `babel` (default `{}`) - [Babel options](https://babeljs.io/docs/en/options). 

## Example

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

<b>Output</b>

`build.js`

```
// script: js

var TIC = function TIC() {

};

function ui() {
  return 'ui';
};
```

## Donating

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Y8Y41E23T)

## License

GNU General Public License v3.0, see [LICENSE](./LICENSE) file.
