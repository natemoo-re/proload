# `jsonc-register`

`json-register` hooks into Node's `require` function to load `.json` or `.jsonc` files that support comments.

```js
const { register } = require('jsonc-register');

register();
const a = require('/path/to/my-file.json');
const b = require('/path/to/my-file.jsonc');
```
