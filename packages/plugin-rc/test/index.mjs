import { test } from 'uvu';
import { is, type } from 'uvu/assert';
import { resolve } from 'path';
import load from '@proload/core';
import rc from '@proload/plugin-rc';

test.before(() => {
    load.use([rc]);
})

test('sanity', () => {
    type(rc, 'object');
})

const fixtures = ['cjs-rc', 'esm-rc'];

for (const fixture of fixtures) {
    test(fixture, async () => {
        let mdl = await load('test', { cwd: resolve(`fixtures/${fixture}`) });
        is(mdl.value.value, fixture)
    });
}

test.run();
