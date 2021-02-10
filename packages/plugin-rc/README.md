# `@proload/plugin-rc`

Enables the loading of `[namespace]rc` files with any extension using [`@proload/core`](https://github.com/natemoo-re/proload).

```js
import load from '@proload/core';
import rc from '@proload/plugin-rc';

load.use([rc]);
await load('namespace');
```
