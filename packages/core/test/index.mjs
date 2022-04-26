import { test } from 'uvu';
import { is, type } from 'uvu/assert';
import { resolve, join } from 'path';
import load from '@proload/core';

const fixtures = ['cjs', 'cjs-config', 'esm', 'esm-config', 'factory', 'js-cjs', 'js-esm', 'package'];

for (const fixture of fixtures) {
    test(fixture, async () => {
        let mdl = await load('test', { cwd: resolve(`fixtures/${fixture}`) });
        is(mdl.value.value, fixture)
    });
}

test('exact filePath', async () => {
    let mdl = await load('test', { filePath: join(resolve('fixtures/exact-filePath'), '.', 'subfolder', 'test.config.cjs') });
    is(mdl.value.value, 'exact-filePath')
});

test('missing but mustExist (default)', async () => {
    let err = 0;
    try {
        let mdl = await load('test', { cwd: resolve(`fixtures/missing`) });
    } catch (e) {
        err += 1;
    }
    is(err, 1);
});

test('missing but not mustExist', async () => {
    let mdl = await load('test', { cwd: resolve(`fixtures/missing`), mustExist: false });
    type(mdl, 'undefined')
});

const throwFixtures = ['ts', 'ts-config', 'json', 'json-config'];

for (const fixture of throwFixtures) {
    test(`cannot load ${fixture}`, async () => {
        let err = 0;
        try {
            await load('test', { cwd: resolve(`fixtures/${fixture}`) })
        } catch (e) {
            err += 1;
        }
        is(err, 1);
    })
}

test('custom-merge', async () => {
    let mdl = await load('test', { 
        cwd: resolve(`fixtures/custom-merge`), 
        merge(a, b) {
            return { ...a, ...b, merged: 'custom' }
        }
    });
    is(mdl.value.value, 'custom-merge');
    is(mdl.value.merged, 'custom');
})

test('custom-accept', async () => {
    let mdl = await load('test', { 
        cwd: resolve(`fixtures/custom-accept`), 
        accept(name) {
            if (name.startsWith('custom')) return true;
        }
    });
    is(mdl.value.value, 'custom');
})

test('factory-context', async () => {
    let mdl = await load('test', { cwd: resolve(`fixtures/factory-context`), context: { __TEST__: true } });
    is(mdl.value.value, 'factory-context')
    is(mdl.value.__TEST__, true);
});

const extendFixtures = ['extends-cjs', 'extends-mjs', 'extends-dependency'];

for (const fixture of extendFixtures) {
    test(fixture, async () => {
        let mdl = await load('test', { cwd: resolve(`fixtures/${fixture}`) });
        is(mdl.value.value, fixture)
        is(mdl.value.extended, true);
    });
}

const extendMultiFixtures = ['extends-multi', 'extends-recursive'];

for (const fixture of extendMultiFixtures) {
    test(fixture, async () => {
        let mdl = await load('test', { cwd: resolve(`fixtures/${fixture}`) });
        is(mdl.value.value, fixture)
        is(mdl.value.extendedA, true);
        is(mdl.value.extendedB, true);
    });
}

test.run();
