# tic-bundle

Imagine not being able to use multiple files for development in 2020.

## Installation

```
// Yarn (development)
yarn

// Yarn (production)
yarn --prod

// Npm (development)
npm install

// Npm (production)
npm install --only=prod
```

## Usage

Simply write your js code in the `src` folder and run `yarn start`, it'll  bundle your code for you. If you prefer bundling whilst developing, use `yarn watch`, it'll bundle the code every save.

The order the files are bundled are dictated by the file name. Simply add `<number>_` to indicate the order. Files with `ignore` in the file name will be ignored.

Babel is included as well, meaning modern JS syntax is supported.

<b>Example:</b>

`src/2_main.js`

```
const TIC = () => {

};
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
