require('vite')

module.exports = {
    name: '@proload/plugin-vite',
    extensions: ['js', 'mjs', 'cjs', 'ts', 'tsx', 'cts', 'mts'],
    async register(fileName) {
        if (/\.([cm]ts|tsx?)$/.test(fileName)) {
            const { register } = require('@swc-node/register/register');
            if (fileName.endsWith('.cts')) {
                register({ format: 'cjs', extensions: ['.cts'] });
            } else {
                register({ format: 'esm', extensions: ['.ts', '.tsx', '.mts'] });
            }
        }
    }
}
