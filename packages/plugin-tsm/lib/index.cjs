module.exports = {
    name: '@proload/plugin-tsm',
    extensions: ['ts', 'tsx'],
    async register(fileName) {
        if (/\.([cm]ts|tsx?)$/.test(fileName)) {
            require('tsm');
        }
    }
}
