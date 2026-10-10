import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./test',testMatch:'browser.spec.mjs',outputDir:'artifacts/browser-results',projects:[{name:'chromium',use:{browserName:'chromium'}},{name:'firefox',use:{browserName:'firefox'}},{name:'webkit',use:{browserName:'webkit'}}]});
