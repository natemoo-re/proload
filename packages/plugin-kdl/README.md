# `@proload/plugin-kdl`

Enables the loading of `[namespace].config.kdl` files using [`@proload/core`](https://github.com/natemoo-re/proload).

```js
import load from '@proload/core';
import kdl from '@proload/plugin-kdl';

load.use([kdl]);
await load('namespace');
```
