import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
export function assetPath(name) {
 if (!/^[\w-]+\.(webp|png|jpg|woff2|mp4|svg|txt|js|css)$/.test(name)) throw new TypeError('Invalid design asset name');
 const relative = name === 'bootstrap.js' ? 'dist/bootstrap.js' : name.endsWith('.css') ? `dist/css/${name}` : `assets/${name}`;
 const path = fileURLToPath(new URL(relative, root));
 if (!existsSync(path)) throw new Error(`Unknown design asset: ${name}`);
 return path;
}
export function cssText(name, assetBase) {
 if (!/^[\w-]+$/.test(name)) throw new TypeError('Invalid stylesheet name');
 return readFileSync(assetPath(`${name}.css`), 'utf8').replaceAll('../../assets/', `${assetBase.replace(/\/$/,'')}/`);
}
