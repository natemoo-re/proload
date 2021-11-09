const { addHook } = require('pirates');

const DEFAULT_EXTENSIONS = ['.json', '.jsonc']

function compile(sourcecode) {
    if (sourcecode.startsWith('module.exports')) return sourcecode;
    return `module.exports = ${sourcecode}`;
}

function register() {
    addHook((code) => compile(code), {
        exts: DEFAULT_EXTENSIONS,
    })
}

module.exports.register = register;
