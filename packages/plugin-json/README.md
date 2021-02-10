# `@proload/plugin-json`

Enables the loading of `[namespace].config.json` files using [`@proload/core`](https://github.com/natemoo-re/proload).

```js
import load from '@proload/core';
import json from '@proload/plugin-json';

load.use([json]);
await load('namespace');
```
