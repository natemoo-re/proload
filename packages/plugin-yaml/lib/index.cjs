module.exports = {
    name: '@proload/plugin-yaml',
    extensions: ['yaml', 'yml'],
    async register(fileName) {
        if (/\.ya?ml$/.test(fileName)) {
            const { register } = require('yaml-register');
            register();
        }
    }
}
