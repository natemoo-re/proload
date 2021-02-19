module.exports = {
    name: '@proload/plugin-kdl',
    extensions: ['kdl'],
    async register(fileName) {
        if (/\.kdl$/.test(fileName)) {
            const { register } = require('kdl-register');
            register();
        }
    }
}
