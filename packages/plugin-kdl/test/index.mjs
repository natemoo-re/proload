import { test } from 'uvu';
import { is, type } from 'uvu/assert';
import { resolve } from 'path';
import load from '@proload/core';
import kdl from '@proload/plugin-kdl';

test.before(() => {
    load.use([kdl]);
})

test('sanity', () => {
    type(kdl, 'object');
})

const fixtures = ['kdl', 'kdl-config'];

for (const fixture of fixtures) {
    test(fixture, async () => {
        let mdl = await load('test', { cwd: resolve(`fixtures/${fixture}`) });
        is(mdl.value[0].name, 'value');
        is(mdl.value[0].values[0], fixture);
    });
}

test.run();
