import { copyFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
mkdirSync(new URL('./public',import.meta.url),{recursive:true});
copyFileSync(fileURLToPath(import.meta.resolve('@glob2/design-system/bootstrap')),new URL('./public/theme.js',import.meta.url));
