import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tokens, chartBackground } from '../dist/tokens.js';
import { cssText, assetPath } from '../scripts/node.mjs';
const luminance = hex => {
 const rgb = [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
 return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
};
const contrast = (a,b) => (Math.max(luminance(a),luminance(b))+.05)/(Math.min(luminance(a),luminance(b))+.05);
test('both palettes have the same keys and documented text/control contrast', () => {
 assert.deepEqual(Object.keys(tokens.light).sort(),Object.keys(tokens.dark).sort());
 for(const palette of [tokens.light,tokens.dark]) {
  for(const bg of ['bg','surface','surface-2']) for(const ink of ['ink','ink-2']) assert.ok(contrast(palette[ink],palette[bg])>=4.5,`${ink}/${bg}`);
  assert.ok(contrast(palette['accent-ink'],palette.accent)>=4.5);
  assert.ok(contrast(palette.focus,palette.bg)>=3);
  for (let i=1;i<=6;i++) assert.ok(contrast(palette[`chart-${i}`],palette['chart-bg'])>=3,`chart-${i}`);
  assert.ok(contrast(palette['line-strong'],palette.surface)>=3);
 }
 assert.equal(chartBackground.dark,tokens.dark.surface);
});
test('asset and icon provenance is hash checked', () => {
 const manifest = JSON.parse(readFileSync(new URL('../assets/provenance.json',import.meta.url)));
 for(const [name,hash] of Object.entries(manifest.files)) assert.equal(createHash('sha256').update(readFileSync(assetPath(name))).digest('hex'),hash,name);
 const icons = JSON.parse(readFileSync(new URL('../assets/icons/manifest.json',import.meta.url)));
 for(const icon of icons.icons) assert.equal(createHash('sha256').update(readFileSync(new URL(`../assets/icons/${icon.name}.svg`,import.meta.url))).digest('hex'),icon.sha256,icon.name);
});
test('server CSS rebases assets and rejects traversal', () => {
 assert.match(cssText('fonts','/signin/assets'), /url\('\/signin\/assets\/nunito.woff2'\)/);
 assert.throws(()=>assetPath('../LICENSE')); assert.throws(()=>cssText('../tokens','/'));
});
