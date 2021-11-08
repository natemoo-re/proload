module.exports = {
    name: '@proload/plugin-typescript',
    extensions: ['ts', 'tsx'],
    async register(fileName) {
        if (/\.([cm]ts|tsx?)$/.test(fileName)) {
            const { register } = require('@swc-node/register/register');
            register({ format: 'esm', extensions: ['.ts', '.tsx'] });
        }
    }
}
