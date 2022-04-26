const { ProloadError } = require('../error.cjs');
function load(...args) {
    return import('../esm/index.mjs').then(({ default: loader }) => loader(...args));
}
function resolve(...args) {
    return import('../esm/index.mjs').then(({ resolve: resolver }) => resolver(...args));
}

load.resolve = resolve;
load.default = load;
load.ProloadError = ProloadError;
module.exports = load;
