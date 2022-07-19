"use strict";
import { createRequire } from 'module';
import { pathToFileURL } from 'url';
let require = createRequire(import.meta.url);

/**
 * 
 * @param {string} filePath 
 */
export default async function requireOrImport(filePath, { middleware = [], cacheBust = false } = {}) {
    await Promise.all(middleware.map(plugin => plugin.register(filePath)));

    return new Promise((resolve, reject) => {
        try {
            let mdl = require(filePath);
            if (cacheBust) {
                delete require.cache[filePath]
            }
            resolve(mdl);
        } catch (e) {
            if (e.code === 'ERR_REQUIRE_ESM') {
                const fileUrl = pathToFileURL(filePath).toString();
                if (cacheBust) {
                    return import(`${fileUrl}?t=${Date.now()}`).then(mdl => resolve(mdl));
                } else {
                    return import(fileUrl).then(mdl => resolve(mdl));
                }
            };
            reject(e);
        }
    })
}
