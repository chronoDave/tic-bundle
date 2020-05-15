# tic-bundle

Imagine not being able to use multiple files for development in 2020.

## Installation

```
// Yarn
yarn

// Npm
npm install
```

## Usage

Simply write your js code in the `src` folder and run `yarn start`, it'll automatically bundle your code for you.

The order the files are bundled are dictated by the file name. Simply add `_<number>` to indicate the order.

Babel is included as well, meaning modern JS syntax is supported.

<b>Example:</b>

`src/main_2.js`

```
const TIC = () => {

};
```

`src/ui_1.js`

```
function ui() {
  return 'ui';
};
```

<b>Output:</b>

`build.js`

```
// script: js

function ui() {
  return 'ui';
};

var TIC = function TIC() {

};
```
