# `@proload/plugin-dotfile`

Enables the loading of `.[namespace]` files using [`@proload/core`](https://github.com/natemoo-re/proload).

```js
import load from '@proload/core';
import dotfile from '@proload/plugin-dotfile';

load.use([dotfile]);
await load('namespace');
```
