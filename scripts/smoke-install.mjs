// Verify independent consumers against the committed Git package, never source aliases.
import { mkdtempSync, cpSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const sha = process.env.GLOB2_DESIGN_SYSTEM_SHA ?? execFileSync('git', ['rev-parse', 'HEAD'], {cwd:root,encoding:'utf8'}).trim();
const source = process.env.GLOB2_DESIGN_SYSTEM_SHA ? 'https://github.com/Globulation2/glob2-design-system.git' : `file://${root}`;
const workspace = mkdtempSync(join(tmpdir(), 'glob2-consumers-'));
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
for (const example of ['html','astro','react']) {
 const dir = join(workspace, example); mkdirSync(dir);
 cpSync(join(root,'examples',example),dir,{recursive:true,filter:path=>!/(node_modules|dist|\.astro|public\/theme\.js)(\/|$)/.test(path)});
 const manifest = JSON.parse(readFileSync(join(dir,'package.json'),'utf8'));
 manifest.dependencies['@glob2/design-system'] = `git+${source}#${sha}`;
 writeFileSync(join(dir,'package.json'),JSON.stringify(manifest,null,2));
 execFileSync(npm,['install','--ignore-scripts','--no-audit','--no-fund'],{cwd:dir,stdio:'inherit'});
 if(example !== 'react' && existsSync(join(dir,'node_modules/react'))) throw new Error(`${example} unexpectedly installed React`);
 // Explicit consumer prebuild stages the already-distributed bootstrap; dependency
 // installation itself runs no lifecycle hooks and requires no theme dev tools.
 execFileSync(npm,['run','build'],{cwd:dir,stdio:'inherit'});
 if(!existsSync(join(dir,'dist/theme.js'))) throw new Error(`${example} lacks bootstrap`);
 console.log(`Verified ${example}: ${sha}`);
}
console.log(`Independent consumers: ${workspace}`);
