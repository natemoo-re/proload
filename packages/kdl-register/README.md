# `kdl-register`

`kdl-register` hooks into Node's `require` function to load `.kdl` files.

```js
const { register } = require('kdl-register');

register();
const data = require('/path/to/my-file.kdl');
```
