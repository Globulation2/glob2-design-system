import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
const bootstrap = readFileSync(new URL('../dist/bootstrap.js', import.meta.url), 'utf8');
const styles = ['tokens','base','components'].map(name => readFileSync(new URL(`../dist/css/${name}.css`,import.meta.url),'utf8')).join('\n');
const pageHtml = '<!doctype html><html lang="en"><head><link rel="stylesheet" href="/style.css"><script src="/theme.js"></script><title>Theme contract</title></head><body class="g2-ui"><h1>Theme contract</h1><button hidden>Hidden decoration control</button></body></html>';
test.beforeEach(async ({context}) => {
 await context.route('https://*.glob2online.com/**', route => {
  const path = new URL(route.request().url()).pathname;
  return route.fulfill({body:path === '/theme.js' ? bootstrap : path === '/style.css' ? styles : pageHtml,contentType:path.endsWith('.js')?'text/javascript':path.endsWith('.css')?'text/css':'text/html',headers:{'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'"}});
 });
});
test('secure parent cookie shares explicit system/light/dark across subdomains before paint', async ({page,context}) => {
 await page.goto('https://app.glob2online.com/');
 await expect(page.getByText('Hidden decoration control')).toBeHidden();
 await page.evaluate(() => { localStorage.setItem('glob2-theme','dark'); location.reload(); });
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 let cookies=await context.cookies();
 expect(cookies.find(c=>c.name==='glob2-theme')).toMatchObject({domain:'.glob2online.com',path:'/',secure:true,sameSite:'Lax',value:'dark'});
 expect(await page.evaluate(()=>localStorage.getItem('glob2-theme'))).toBeNull();
 await page.goto('https://www.glob2online.com/');
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await page.evaluate(()=>window.Glob2Theme.setPreference('system'));
 const app=await context.newPage();await app.goto('https://app.glob2online.com/');
 await expect(app.locator('html')).not.toHaveAttribute('data-theme');
 await app.evaluate(()=>window.Glob2Theme.setPreference('light'));
 await page.evaluate(()=>dispatchEvent(new Event('pageshow')));
 await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 cookies=await context.cookies();expect(cookies.find(c=>c.name==='glob2-theme').expires).toBeGreaterThan(Date.now()/1000+31400000);
});
