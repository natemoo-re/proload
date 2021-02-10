# `@proload/core`

Proload searches for and loads your tool's JavaScript configuration files. Users have complex expectations when it comes to configuration files—the goal of Proload is to offer a single, straightforward and extensible API for loading them.

```js
import load from '@proload/core';

await load('namespace');
```

## Resolution

Out of the box, `@proload/core` searches up the directory tree for the following files:

- a `package.json` file with a top-level `[namespace]` key
- a `[namespace].config.js`, `[namespace].config.cjs`, `[namespace].config.mjs` file
- any of the `js/cjs/mjs` formats inside of `config/` directory

`@proload/core` supports `node@12.20.1` and up. `node` officially supports `.cjs`, `.mjs`, and plain `.js` files in either `CJS` or `ESM` formats, so `@proload/core` does too. However, when loading a configuration file via `@proload/core`, you won't know (or care!) which module format your users choose.

## Load Options

### cwd
`load` searches up the directory tree, beginning from this loaction. Defaults to `process.cwd()`.

```js
import load from '@proload/core';
await load('namespace', { cwd: '/path/to/user/project' });
```

### context

Users may want to dynamically generate a different configuration based on some contextual information passed from your tool. Any `{ context }` passed to the `load` function will be forwarded to configuration "factory" functions.

```js
// Library code
import load from '@proload/core';
await load('namespace', { context: { isDev: true }});

// namespace.config.js
export default ({ isDev }) => {
    return { featureFlag: isDev }
}
```

### merge

To customize `extends` behavior, you may pass a custom `merge` function to the `load` function. By default, [`deepmerge`](https://github.com/TehShrike/deepmerge) is used.

```js
// Library code
import load from '@proload/core';

const shallowMerge = (a, b) => ({ ...a, ...b })
await load('namespace', { merge: shallowMerge });

// namespace.config.js
export default {
    extends: ['./a.js', './b.js']
}

// a.js
export default {
    a: true
}

// b.js
export default {
    b: true
}

// result
{
    a: true,
    b: true
}
```


## Automatic `extends`

Tools like `typescript` and `babel` have popularized the ability to share configuration presets through a top-level `extends` clause. `extends` also allows you to share a local base configuration with other packages, which is extremely useful for monorepo users.

Custom implementation of this behavior can be difficult, so `@proload/core` automatically recognizes top-level `extends` clauses (`string[]`) for you. It recursively resolves and merges all dependent configurations.

```js
// namespace.config.js
export default {
    extends: ['@namespace/preset', '../namespace.base.config.js']
}
```

### Extending local configuration files
In many cases, particularly in monorepos, it's useful to have a base configuration file and use `extends` in any sub-packages to inherit the base configuration. `@proload/core` resolves paths in `extends` relative to the configuration file itself.

### Extending configuration presets
`@proload/core` uses the same strategy to resolve a configuration file from project `dependencies` as it does for user configurations. When publishing a configuration preset, use the same file naming strategy as you would for a local configuration.

For example, assume we're writing a tool named `donut`. Users can create a `donut.config.js` file in their project. In order to support `extends: ['@donut/preset-env']`, we need to publish the `@donut/preset-env` package with a top-level `donut.config.js` file. `@proload/core` will look for `@donut/preset-env/donut.config.[cm]?js`.

## Plugins

In order to support as many use cases as possible, `@proload/core` uses a plugin system. Plugins build on each other and are designed to be combined. For example, to support a `namespacerc.json` file, you could use both `@proload/plugin-json` and `@proload/plugin-rc`.

```js
import load from '@proload/core';
import rc from '@proload/plugin-rc';
import json from '@proload/plugin-json';

load.use([rc, json]);
await load('namespace');
```

### TypeScript
In order to load a `[namespace].config.ts` file, use `@proload/plugin-typescript`.

```js
import load from '@proload/core';
import typescript from '@proload/plugin-typescript';

load.use([typescript]);
await load('namespace');
```

### JSON
In order to load a `[namespace].config.json` file, use `@proload/plugin-json`.

```js
import load from '@proload/core';
import json from '@proload/plugin-json';

load.use([json]);
await load('namespace');
```

### YAML
In order to load a `[namespace].config.yaml` or `[namespace].config.yml` file, use `@proload/plugin-yaml`.

```js
import load from '@proload/core';
import yaml from '@proload/plugin-yaml';

load.use([yaml]);
await load('namespace');
```

### RC files
In order to load a `[namespace]rc` file with any extension, use `@proload/plugin-rc`.

```js
import load from '@proload/core';
import rc from '@proload/plugin-rc';

load.use([rc]);
await load('namespace');
```

## Credit

Proload is heavily inspired by tools like [`cosmiconfig`](https://github.com/davidtheclark/cosmiconfig#readme) and [`rc`](https://github.com/dominictarr/rc).
