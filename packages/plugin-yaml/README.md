# `@proload/plugin-yaml`

Enables the loading of `[namespace].config.yaml` or `[namespace].config.yml` files using [`@proload/core`](https://github.com/natemoo-re/proload).

```js
import load from '@proload/core';
import yaml from '@proload/plugin-yaml';

load.use([yaml]);
await load('namespace');
```
