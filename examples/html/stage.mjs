import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { syncDesignSystem } from '@glob2/design-system/install';
const manifest = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
// file: is the checked-out design-system gallery. Copied Git consumers use main
// once per build, or the explicit revision used by verification and rollback.
const metadata = manifest.dependencies['@glob2/design-system'].startsWith('file:')
  ? { source: 'local design-system checkout' }
  : syncDesignSystem();
mkdirSync(new URL('./public', import.meta.url), { recursive: true });
copyFileSync(fileURLToPath(import.meta.resolve('@glob2/design-system/bootstrap')), new URL('./public/theme.js', import.meta.url));
writeFileSync(new URL('./public/design-system.json', import.meta.url), JSON.stringify(metadata, null, 2) + '\n');
