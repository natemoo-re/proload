function load(...args) {
    return import('../esm/index.mjs').then(({ default: loader }) => loader(...args));
}

load.default = load;
module.exports = load;
