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
To make sure it's bundled in the right order, the first two lines are dedicated to "metadata". Simply add a digit to indicate what order the file should be loaded.

<b>Example:</b>

`src/main.js`

```
1

function main() {
  return 'main'
}
```

`src/ui.js`

```
2

function ui() {
  return 'ui'
}
```

<b>Output:</b>

`main.js`

```
function main() {
  return 'main'
}

function ui() {
  return 'ui'
}
```
