const { addHook } = require('pirates');
const stripJsonComments = require('strip-json-comments');

const DEFAULT_EXTENSIONS = ['.json', '.jsonc']

function compile(sourcecode) {
    if (sourcecode.startsWith('module.exports')) return sourcecode;
    const value = JSON.parse(stripJsonComments(sourcecode));
    return `module.exports = ${JSON.stringify(value)}`;
}

function register() {
    addHook((code) => compile(code), {
        exts: DEFAULT_EXTENSIONS,
    })
}

module.exports.register = register;
