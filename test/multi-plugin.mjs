import { test } from 'uvu';
import { is, type } from 'uvu/assert';
import { resolve } from 'path';
import load from '@proload/core';
import json from '@proload/plugin-json';
import rc from '@proload/plugin-rc';

test.before(() => {
    load.use([json, rc]);
})

test('sanity', () => {
    type(json, 'object');
    type(rc, 'object');
})

const fixtures = ['json-rc'];

for (const fixture of fixtures) {
    test(fixture, async () => {
        let mdl = await load('test', { cwd: resolve(`fixtures/${fixture}`) });
        is(mdl.value.value, fixture)
    });
}

test.run();
