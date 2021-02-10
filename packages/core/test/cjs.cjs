const { test } = require('uvu');
const { is, type } = require('uvu/assert');
const { resolve } = require('path');
const load = require('@proload/core');

test('sanity', async () => {
    type(load, 'function');
});

test('loads', async () => {
    let mdl = await load('test', { cwd: resolve(`fixtures/cjs`) });
    is(mdl.value.value, 'cjs')
});

test.run();
