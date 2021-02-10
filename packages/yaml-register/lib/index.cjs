const { addHook } = require('pirates');
const yaml = require('js-yaml');

const DEFAULT_EXTENSIONS = ['.yml', '.yaml']

function compile(sourcecode, filename) {
    if (sourcecode.startsWith('module.exports')) return sourcecode;
    const doc = yaml.load(sourcecode, { filename });
    return `module.exports = ${JSON.stringify(doc)}`;
}

function register() {
    addHook((code, filename) => compile(code, filename), {
        exts: DEFAULT_EXTENSIONS,
    })
}

module.exports.register = register;
