# tic-bundle

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

`tic-bundle` accepts the following configuration options in the `package.json`:

```
"ticbundle": {
  "dir": "src", // folder tic-bundle should watch, 'src' by default
  "output": "output" // generated output file name, 'build' by default
}
```

## Usage

1) Create `src` folder
2) Write JavaScript code
3) Run `yarn start` for a single build, `yarn watch` for building on save

The order in which `tic-bundle` places the files is determined by a `<number>_` prefix (e.g. `1_index.js`). Files can be ignored by using `ignore` in the filename.

<b>Example:</b>

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
