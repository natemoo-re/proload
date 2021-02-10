# `@proload/plugin-typescript`

Enables the loading of `[namespace].config.ts` files using [`@proload/core`](https://github.com/natemoo-re/proload).

```js
import load from '@proload/core';
import typescript from '@proload/plugin-typescript';

load.use([typescript]);
await load('namespace');
```
