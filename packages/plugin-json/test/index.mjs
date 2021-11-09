import { test } from 'uvu';
import { is, type } from 'uvu/assert';
import { resolve } from 'path';
import load from '@proload/core';
import json from '@proload/plugin-json';

test.before(() => {
    load.use([json]);
})

test('sanity', () => {
    type(json, 'object');
})

const fixtures = ['json', 'json-config', 'jsonc'];

for (const fixture of fixtures) {
    test(fixture, async () => {
        let mdl = await load('test', { cwd: resolve(`fixtures/${fixture}`) });
        is(mdl.value.value, fixture)
    });
}

test.run();
