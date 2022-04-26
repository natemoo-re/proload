# `yaml-register`

`yaml-register` hooks into Node's `require` function to load `.yaml` and `.yml` files.

## Install

```
npm i yaml-register -D
```

## Basic Usage

```
node -r yaml-register index.js
```

## Programmatic Usage

```js
const { register } = require('yaml-register/lib');

register();

// now you can require yaml files
const data = require('/path/to/my-file.yaml');
```
