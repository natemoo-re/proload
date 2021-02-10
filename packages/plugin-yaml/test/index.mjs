import { test } from 'uvu';
import { is, type } from 'uvu/assert';
import { resolve } from 'path';
import load from '@proload/core';
import yaml from '@proload/plugin-yaml';

test.before(() => {
    load.use([yaml]);
})

test('sanity', () => {
    type(yaml, 'object');
})

const fixtures = ['yaml', 'yml'];

for (const fixture of fixtures) {
    test(fixture, async () => {
        let mdl = await load('test', { cwd: resolve(`fixtures/${fixture}`) });
        is(mdl.value.value, fixture)
    });
}

test.run();
