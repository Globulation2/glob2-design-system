import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { mountColony } from '../dist/colony.js';
test('colony does not request video under reduced motion and cleans up listeners', async () => {
 const dom = new JSDOM('<div><video data-src="/colony.mp4"></video><button></button></div>',{url:'https://glob2.online/',pretendToBeVisual:true});
 const win = dom.window; const query = new win.EventTarget(); query.matches = true;
 win.matchMedia = () => query; let visible; let disconnected=false;
 win.IntersectionObserver = class { constructor(fn){visible=fn;} observe(){} disconnect(){disconnected=true;} };
 const video = win.document.querySelector('video'), button=win.document.querySelector('button'); let starts=0;
 video.play = async () => {starts++;}; video.pause = () => {};
 const cleanup=mountColony(video,button,{pause:'Pause',resume:'Resume'});
 visible([{isIntersecting:true}]); assert.equal(video.getAttribute('src'),null); assert.equal(starts,0);
 query.matches=false; query.dispatchEvent(new win.Event('change')); await Promise.resolve();
 assert.equal(video.getAttribute('src'),'/colony.mp4'); video.dispatchEvent(new win.Event('playing'));
 assert.equal(button.hidden,false); button.click(); assert.equal(button.textContent,'Resume');
 cleanup(); assert.equal(disconnected,true); dom.window.close();
});

test('colony retries its fallback when the preferred source fails', async () => {
 const dom = new JSDOM('<div><video></video><button></button></div>', {url:'https://glob2.online/',pretendToBeVisual:true});
 const win = dom.window;
 win.matchMedia = () => new win.EventTarget();
 let observe;
 win.IntersectionObserver = class { constructor(fn) { observe = fn; } observe() {} disconnect() {} };
 const video = win.document.querySelector('video'), button = win.document.querySelector('button');
 video.pause = () => {};
 video.canPlayType = () => 'probably';
 const plays = [];
 video.play = () => { const attempt = Promise.withResolvers(); plays.push(attempt); return attempt.promise; };
 const cleanup = mountColony(video, button, {
  pause:'Pause', resume:'Resume',
  chooseSources: () => [{src:'/hero.webm',type:'video/webm'}, {src:'/hero.mp4',type:'video/mp4'}],
 });
 assert.equal(video.getAttribute('src'), null);
 observe([{isIntersecting:true}]);
 assert.equal(video.getAttribute('src'), '/hero.webm');
 video.dispatchEvent(new win.Event('playing'));
 button.click();
 Object.defineProperty(video, 'error', {value:{code:3}, configurable:true});
 video.dispatchEvent(new win.Event('error'));
 assert.equal(video.getAttribute('src'), '/hero.mp4');
 plays[0].reject(new win.DOMException('First source failed', 'NotSupportedError'));
 await Promise.resolve();
 assert.equal(button.hidden, false);
 assert.equal(button.textContent, 'Resume');
 button.click();
 assert.equal(button.textContent, 'Pause');
 cleanup(); dom.window.close();
});
