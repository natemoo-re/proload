module.exports = (...args) => {
    return import('../esm/index.mjs').then(({ default: mdl }) => mdl(...args))
};
