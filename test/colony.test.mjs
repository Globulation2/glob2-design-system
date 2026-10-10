import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { mountColony } from '../dist/colony.js';
test('colony does not request video under reduced motion and cleans up listeners', async () => {
 const dom = new JSDOM('<div><video data-src="/colony.mp4"></video><button></button></div>',{url:'https://glob2online.com/',pretendToBeVisual:true});
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
