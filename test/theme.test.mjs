import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM, CookieJar } from 'jsdom';
import { createThemeController, readPreference, writePreference } from '../dist/theme.js';
import { readFileSync } from 'node:fs';
const make = (url = 'https://app.glob2online.com/', cookieJar) => {
 const dom = new JSDOM('<!doctype html><html><body></body></html>', { url, cookieJar, runScripts: 'outside-only' });
 const query = new dom.window.EventTarget(); query.matches = false;
 dom.window.matchMedia = () => query;
 return { win: dom.window, query };
};
test('shared cookie survives navigation between domains and explicit system wins over legacy', () => {
 const jar = new CookieJar(); const app = make(undefined, jar); const site = make('https://glob2online.com/', jar);
 const a = createThemeController(app.win); const b = createThemeController(site.win);
 a.setPreference('dark'); b.refresh(); assert.equal(b.getSnapshot().theme, 'dark');
 assert.match(app.win.document.cookie, /glob2-theme=dark/);
 b.setPreference('system'); app.win.localStorage.setItem('glob2-theme','light'); a.refresh();
 assert.equal(a.getSnapshot().preference,'system'); assert.equal(app.win.localStorage.getItem('glob2-theme'),null);
 a.destroy(); b.destroy();
});
test('legacy migration, first paint and system changes share one controller', () => {
 const { win, query } = make(); win.localStorage.setItem('glob2-theme','dark');
 win.eval(readFileSync(new URL('../dist/bootstrap.js',import.meta.url),'utf8'));
 const controller = win.Glob2Theme;
 assert.equal(win.document.documentElement.dataset.theme,'dark'); assert.equal(win.localStorage.getItem('glob2-theme'),null);
 controller.setPreference('system'); query.matches = true; query.dispatchEvent(new win.Event('change'));
 assert.equal(controller.getSnapshot().theme,'dark'); assert.equal(win.document.documentElement.hasAttribute('data-theme'),false);
 controller.destroy();
});
test('preview persistence is local and invalid preferences are rejected', () => {
 const { win } = make('http://localhost:4322/'); writePreference(win,'light');
 assert.equal(readPreference(win),'light'); assert.equal(win.document.cookie,'');
 assert.throws(() => writePreference(win,'nope'),TypeError);
});
test('blocked storage does not hide a valid cookie; blocked persistence keeps an in-memory choice', () => {
 const { win } = make(); writePreference(win,'dark');
 Object.defineProperty(win,'localStorage',{get() { throw new Error('blocked'); }});
 assert.equal(readPreference(win),'dark');
 const local = make('http://localhost/').win;
 Object.defineProperty(local,'localStorage',{get() { throw new Error('blocked'); }});
 const controller = createThemeController(local); controller.setPreference('light'); controller.refresh();
 assert.equal(controller.getSnapshot().preference,'light'); controller.destroy();
});
test('controller destroys listeners and refreshes on focus, pageshow and storage', () => {
 const { win } = make(); const controller = createThemeController(win);
 for (const event of ['focus','pageshow','storage']) {
  writePreference(win,'dark'); win.dispatchEvent(new win.Event(event)); assert.equal(controller.getSnapshot().theme,'dark');
  controller.setPreference('light');
 }
 controller.destroy(); writePreference(win,'dark'); win.dispatchEvent(new win.Event('focus'));
 assert.equal(controller.getSnapshot().theme,'light');
});
test('blocked cookie writes preserve legacy migration across focus', () => {
 const { win } = make(); Object.defineProperty(win.document,'cookie',{get:()=>'',set:()=>{}});
 win.localStorage.setItem('glob2-theme','dark'); const controller = createThemeController(win);
 controller.refresh(); assert.equal(controller.getSnapshot().preference,'dark');
 assert.equal(win.localStorage.getItem('glob2-theme'),'dark'); controller.destroy();
});
