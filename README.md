# tic-bundle

![screenshot of tic-bundle being used in a terminal](https://i.imgur.com/UVHUMTK.jpg)

Simple file bundler for JavaScript development in TIC-80.

`tic-bundle` comes with [Babel](https://babeljs.io/docs/en/babel-preset-env) pre-installed. Please note that polyfills are not supported.

## Installation

```
// Yarn
yarn

// Npm
npm install
```

## Configuration

`tic-bundle` accepts the following configuration options in `config.json`:

- `src` Folder to watch. Defaults to `src`.
- `output` Output folder. Defaults to `./`.
- `ignore` File(s) to ignore. Defaults to `["ignore"]`.
- `name` Name of build file. Defaults to `build`

If no `config.json` is found, `tic-bundle` will use the default values.

## Usage

1) Create `config.json` (optional)
2) Write JavaScript code in `src` folder
3) Run `yarn start`

The order in which `tic-bundle` places the files is determined by a `<number>_` prefix (e.g. `1_index.js`).

<b>Example:</b>

`config.json`

```
{
  "src": "src",
  "output": "./",
  "name": "build"
}
```

`src/2_main.js`

```
const TIC = () => {

};
```

`src/2_ignore.js`

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
