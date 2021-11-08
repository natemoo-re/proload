import { test } from 'uvu';
import { is, type } from 'uvu/assert';
import { resolve } from 'path';
import load, { ProloadError } from '@proload/core';
import dotfile from '@proload/plugin-dotfile';

test.before(() => {
    load.use([dotfile]);
})

test('sanity', () => {
    type(dotfile, 'object');
})

const fixtures = ['dotfile', 'dotfile-config'];

for (const fixture of fixtures) {
    test(fixture, async () => {
        let mdl = await load('test', { cwd: resolve(`fixtures/${fixture}`) });
        is(mdl.value.value, fixture)
    });
}

test('dotfile-not-wildcard', async () => {
    let throws = false;
    try {
        await load('test', { cwd: resolve(`fixtures/dotfile-not-wildcard`) });
    } catch (e) {
        if (e instanceof ProloadError && e.code === 'ERR_PROLOAD_NOT_FOUND') {
            throws = true;
        }
    }
    is(throws, true, 'dotfile leading dot is treated as RegExp wildcard character')
});

test.run();
