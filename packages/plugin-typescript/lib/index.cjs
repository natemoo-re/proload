module.exports = {
    name: '@proload/plugin-typescript',
    extensions: ['ts', 'tsx'],
    async register(fileName) {
        if (/\.tsx?$/.test(fileName)) {
            const { register } = require('@swc-node/register/lib/register.js');
            register({ format: 'esm', extensions: ['.ts', '.tsx'] });
        }
    }
}
