module.exports = {
    name: '@proload/plugin-json',
    extensions: ['json', 'jsonc'],
    async register(fileName) {
        if (/\.jsonc?$/.test(fileName)) {
            const { register } = require('jsonc-register');
            register();
        }
    }
}
