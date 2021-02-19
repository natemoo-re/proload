const { addHook } = require('pirates');
const parse = require('kdljs');

const DEFAULT_EXTENSIONS = ['.kdl']

function compile(sourcecode) {
    if (sourcecode.startsWith('module.exports')) return sourcecode;
    const { errors, output } = parse(sourcecode);
    if (errors.length > 0) {
        throw new Error(errors[0].message);
    }
    
    return `module.exports = ${JSON.stringify(output)}`;
}

function register() {
    addHook((code) => compile(code), {
        exts: DEFAULT_EXTENSIONS,
    })
}

module.exports.register = register;
