import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { mountTabs } from '../dist/browser.js';
test('HTML tabs select panels and preserve roving keyboard focus without React', () => {
 const {window:w}=new JSDOM('<div id="tabs"><button role="tab" id="one" aria-controls="a" aria-selected="true">One</button><button role="tab" id="two" aria-controls="b">Two</button></div><section id="a"></section><section id="b"></section>');
 const root=w.document.getElementById('tabs'), changes=[];
 const cleanup=mountTabs(root,{onChange:id=>changes.push(id)});
 const first=w.document.getElementById('one'),second=w.document.getElementById('two');
 assert.equal(w.document.getElementById('b').hidden,true);
 first.dispatchEvent(new w.KeyboardEvent('keydown',{key:'End',bubbles:true}));
 assert.equal(w.document.activeElement,second);assert.equal(first.tabIndex,-1);assert.equal(w.document.getElementById('a').hidden,true);assert.deepEqual(changes,['two']);
 cleanup();first.click();assert.equal(second.getAttribute('aria-selected'),'true');w.close();
});
