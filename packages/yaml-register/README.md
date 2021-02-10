# `yaml-register`

`yaml-register` hooks into Node's `require` function to load `.yaml` and `.yml` files.

```js
const { register } = require('yaml-register');

register();
const data = require('/path/to/my-file.yaml');
```
