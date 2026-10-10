import { readFile, writeFile, mkdir, copyFile, rm } from 'node:fs/promises';
import { readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import postcss from 'postcss';
const root = fileURLToPath(new URL('..', import.meta.url));
process.chdir(root);
await rm('dist', {recursive: true, force: true});
await mkdir('dist/css', { recursive: true });
const read = path => readFile(path, 'utf8');
const portable = async name => JSON.parse(await read(`tokens/${name}.json`));
const web = JSON.parse(await read('tokens/web.json'));
const cssValue = token => {
  const v = token.$value;
  if (token.$type === 'color') return v.hex;
  if (['dimension', 'duration'].includes(token.$type)) return `${v.value}${v.unit}`;
  if (token.$type === 'shadow') return v.map(layer => {
    const c = layer.color;
    return `${layer.offsetX.value}px ${layer.offsetY.value}px ${layer.blur.value}px ${layer.spread.value}px rgba(${c.components.map(n => Math.round(n * 255)).join(', ')}, ${c.alpha})`;
  }).join(', ');
  if (token.$type === 'fontFamily') return v.map(x => x.includes(' ') ? `'${x}'` : x).join(', ');
  if (token.$type === 'cubicBezier') return `cubic-bezier(${v.join(', ')})`;
  return String(v);
};
const values = {};
for (const name of ['foundation','light','dark']) values[name] = {...Object.fromEntries(Object.entries(await portable(name)).map(([key,t])=>[key,cssValue(t)])),...web[name]};
const declarations = name => Object.entries(values[name]).map(([key,v]) => `  --${key}: ${v};`).join('\n');
await writeFile('dist/css/tokens.css', `/* Generated from tokens/. */\n:root {\n${declarations('foundation')}\n}\n:root, :root[data-theme='light'] {\n  color-scheme: light;\n${declarations('light')}\n}\n@media (prefers-color-scheme: dark) {\n :root:not([data-theme='light']) {\n  color-scheme: dark;\n${declarations('dark')}\n }\n}\n:root[data-theme='dark'] {\n color-scheme: dark;\n${declarations('dark')}\n}\n`);
await writeFile('dist/tokens.js', `// Generated from tokens/.\nexport const tokens = ${JSON.stringify(values,null,2)};\nexport const chartBackground = {light: tokens.light["chart-bg"], dark: tokens.dark["chart-bg"]};\n`);
await writeFile('dist/tokens.d.ts', `export declare const tokens: ${JSON.stringify(values,null,2)};\nexport declare const chartBackground: Record<'light' | 'dark', string>;\n`);
for (const name of ['base','components','brand']) {
 const tree = postcss.parse(await read(`src/css/${name}.css`));
 if (name !== 'base') tree.walkRules(rule => {
  if (rule.parent?.type === 'atrule' && rule.parent.name.endsWith('keyframes')) return;
  rule.selectors = rule.selectors.map(selector => `:where(.g2-ui) ${selector}`);
 });
 tree.walkAtRules('keyframes', rule => { rule.params = `g2-${rule.params}`; });
 tree.walkDecls(/^animation/, declaration => { declaration.value = declaration.value.replace(/\b(pulse|glob-roll)\b/g, 'g2-$1'); });
 await writeFile(`dist/css/${name}.css`, tree.toString());
}
await writeFile('dist/css/fonts.css', `@font-face { font-family: 'Glob2 Sans'; src: url('../../assets/glob2-sans.woff2') format('woff2'); font-display: swap; }\n@font-face { font-family: 'Nunito Variable'; src: url('../../assets/nunito.woff2') format('woff2-variations'); font-weight: 200 1000; font-style: normal; font-display: swap; }\n`);
const manifest = JSON.parse(await read('assets/icons/manifest.json'));
const bodies = {};
for (const icon of manifest.icons) bodies[icon.name] = /<svg[^>]*>([\s\S]*)<\/svg>/.exec(await read(`assets/icons/${icon.name}.svg`))[1].trim();
await writeFile('src/icons.ts', `// Generated from the pinned asset catalog.\nexport const ICON_BODIES = ${JSON.stringify(bodies,null,2)} as const;\nexport type IconName = keyof typeof ICON_BODIES;\nexport const ICON_NAMES = Object.keys(ICON_BODIES) as IconName[];\n`);
await build({entryPoints:['src/theme.js','src/react.tsx','src/icons.ts','src/colony.js','src/browser.js'],outdir:'dist',format:'esm',platform:'neutral',target:'es2022',bundle:false,jsx:'automatic'});
await build({entryPoints:['src/bootstrap.js'],outfile:'dist/bootstrap.js',format:'iife',target:'es2022',bundle:true,minify:true});
execFileSync('node',['node_modules/typescript/bin/tsc','-p','tsconfig.json'],{stdio:'inherit'});
await copyFile('src/theme.d.ts','dist/theme.d.ts');
await copyFile('src/colony.d.ts','dist/colony.d.ts');
await copyFile('src/browser.d.ts','dist/browser.d.ts');
// Never copy generated browser bootstrap to downstream source: consumers copy it at build time.

await mkdir('examples/html/public', {recursive: true});
await copyFile('dist/bootstrap.js', 'examples/html/public/theme.js');
