import escalade from "escalade";
import { join, dirname, extname } from "path";
import deepmerge from 'deepmerge';

import { readdir, readFile, stat } from "fs";
import { promisify } from "util";
import { createRequire } from "module";
import requireOrImport from "./requireOrImport.mjs";
import { assert } from "../assert.cjs";

const toStats = promisify(stat);
const toRead = promisify(readdir);
const toReadFile = promisify(readFile);
const require = createRequire(import.meta.url);

let merge = deepmerge;
const defaultExtensions = ['js', 'cjs', 'mjs'];
const defaultFileNames = ['[name].config'];

const validNames = (namespace) => {
  const extensionPlugins = load.plugins.filter(p => Array.isArray(p.extensions));
  const fileNamePlugins = load.plugins.filter(p => Array.isArray(p.fileNames));
  const validExtensions = [...defaultExtensions].concat(...extensionPlugins.map(p => p.extensions));
  const validFileNames = [...defaultFileNames].concat(...fileNamePlugins.map(p => p.fileNames));

  const result = validFileNames
    .map(fileName => fileName.replace('[name]', namespace))
    .reduce((acc, fileName) => {
      return [...acc].concat(...validExtensions.map(ext => `${fileName}${ext ? '.' + ext.replace(/^\./, '') : ''}`))
    }, []);

  return result;
}

/**
 * @param {any} val
 * @returns {val is Record<any, any>}
 */
const isObject = (val) =>
  val != null && typeof val === "object" && Array.isArray(val) === false;

const requireOrImportWithMiddleware = (filePath) => {
  let registerPlugins = load.plugins.filter(
    (plugin) => typeof plugin.register !== "undefined"
  );
  let transformPlugins = load.plugins.filter(
    (plugin) => typeof plugin.transform !== "undefined"
  );
  return requireOrImport(filePath, { middleware: registerPlugins }).then(
    async (mdl) => Promise.all(
      transformPlugins.map((plugin) => {
        Promise.resolve(plugin.transform(mdl)).then((result) => {
          if (result) mdl = result;
        });
      })
    ).then(() => mdl)
  );
};

/**
 *
 * @param {string} namespace
 * @param {{ filePath: string, extension: string }} opts
 * @returns {Promise<{ filePath: string, value: string }>}
 */
async function resolveExtension(namespace, { filePath, extension }) {
  let resolvedPath;
  if (extname(extension) === "") {
    if (extension.startsWith("./") || extension.startsWith("../")) {
      resolvedPath = require.resolve(`${extension}${extname(filePath)}`, {
        paths: [dirname(filePath)],
      });
    }
    const accepted = validNames(namespace);
    for (const config of accepted) {
      try {
        resolvedPath = require.resolve(`${extension}/${config}`, {
          paths: [dirname(filePath)],
        });
        break;
      } catch (e) {}
    }
  }
  resolvedPath =
    resolvedPath || require.resolve(extension, { paths: [dirname(filePath)] });
  const value = await requireOrImportWithMiddleware(resolvedPath);

  return { filePath: resolvedPath, value };
}

async function resolveExtensions(
  namespace,
  { filePath, value: raw, context },
  acc = {}
) {
  let value = typeof raw === "function" ? await raw(context) : raw;
  if (Array.isArray(value)) return value;

  assert(
    isObject(value),
    `${namespace} configuration expects an "object" but encountered ${value}`
  );
  acc = merge(acc, value);
  if (!("extends" in value)) return acc;

  assert(
    Array.isArray(value.extends),
    `${namespace} "extends" must be an array`
  );

  const configs = await Promise.all(
    value.extends.map((extension) =>
      resolveExtension(namespace, { filePath, extension }).then((config) =>
        resolveExtensions(namespace, { ...config, context }, acc)
      )
    )
  );

  for (const config of configs) {
    acc = merge(acc, config);
  }

  delete acc.extends;

  return acc;
}

/**
 * 
 * @param {string} namespace 
 * @param {import('../index').LoadOptions} opts
 */
async function load(namespace, opts = {}) {
  const accepted = validNames(namespace);
  const { context, accept } = opts;
  const input = opts.cwd || process.cwd();

  if (typeof opts.merge === 'function') {
    merge = opts.merge;
  }

  const filePath = await escalade(input, async (dir, names) => {
    if (accept) {
      for (const n of names) {
        if (accept(n, { directory: dir }) === true) return n;
      }
    }

    for (const n of accepted) {
      if (names.includes(n)) return n;
    }

    if (names.includes("config")) {
      let d = join(dir, "config");
      let _,
        stats = await toStats(d);
      let entries = [];
      if (stats.isDirectory()) {
        entries = await toRead(d);
        for (const n of accepted) {
          if (entries.includes(n)) return join("config", n);
        }
      }
    }

    if (names.includes("package.json")) {
      let file = join(dir, "package.json");
      let _, contents = await toReadFile(file).then((r) => JSON.parse(r.toString()));
      if (contents[namespace]) return "package.json";
    }
  });

  if (!filePath) throw new Error(`Unable to resolve`);

  let rawValue = await requireOrImportWithMiddleware(filePath);
  if (filePath.endsWith('package.json')) rawValue = rawValue[namespace];
  const resolvedValue = await resolveExtensions(namespace, {
    filePath,
    value: rawValue,
    context,
  });

  return {
    filePath,
    raw: rawValue,
    value: resolvedValue,
  };
}

const defaultPlugins = [
  {
    name: "@proload/extract-default",
    transform(mdl) {
      if (mdl.default && Object.keys(mdl).length === 1) {
        return mdl.default;
      };

      return mdl;
    },
  },
];
/** @type import('../index').Plugin[] */
load.plugins = defaultPlugins;
load.use = (plugins) => {
  load.plugins = [...load.plugins, ...plugins];
};
export default load;
