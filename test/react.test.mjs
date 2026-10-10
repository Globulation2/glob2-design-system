import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { createElement as h, act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { Field, Tabs, Icon } from '../dist/react.js';
test('field retains external descriptions and validation while adding shared error text', () => {
 const output = renderToStaticMarkup(h(Field,{label:'Password','aria-describedby':'rules','aria-invalid':true,error:'Too short',id:'password'}));
 assert.match(output,/aria-describedby="rules password-description"/); assert.match(output,/aria-invalid="true"/);
 const plain = renderToStaticMarkup(h(Field,{label:'Password','aria-describedby':'rules','aria-invalid':true}));
 assert.match(plain,/aria-describedby="rules"/); assert.match(plain,/aria-invalid="true"/);
});
test('tabs support roving focus, Home/End and explicit panel relationships', async () => {
 const dom = new JSDOM('<div id="root"></div>'); const previous = {window:global.window,document:global.document};
 global.window = dom.window; global.document = dom.window.document; global.IS_REACT_ACT_ENVIRONMENT = true;
 const root = createRoot(document.getElementById('root')); let selected;
 await act(()=>root.render(h(Tabs,{label:'Views',value:'one',onChange:value=>{selected=value;},items:[{id:'one',label:'One',tabId:'tab-one',panelId:'panel-one'},{id:'two',label:'Two',tabId:'tab-two',panelId:'panel-two'}]})));
 const [one,two] = document.querySelectorAll('button'); assert.equal(one.id,'tab-one'); assert.equal(two.getAttribute('aria-controls'),'panel-two');
 await act(()=>one.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'End',bubbles:true})));
 assert.equal(selected,'two'); assert.equal(document.activeElement,two);
 await act(()=>two.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Home',bubbles:true})));
 assert.equal(document.activeElement,one); assert.equal(selected,'one');
 document.documentElement.dir = 'rtl';
 document.querySelector('[role=tablist]').style.direction = 'ltr';
 await act(()=>one.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true})));
 assert.equal(selected,'two'); assert.equal(document.activeElement,two);
 document.querySelector('[role=tablist]').style.direction = 'rtl';
 await act(()=>one.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true})));
 assert.equal(selected,'two'); assert.equal(document.activeElement,two);
 await act(()=>root.unmount()); Object.assign(global,previous); dom.window.close();
});
test('icons distinguish decorative and named uses', () => {
 assert.match(renderToStaticMarkup(h(Icon,{name:'robot'})),/aria-hidden="true"/);
 assert.match(renderToStaticMarkup(h(Icon,{name:'robot',label:'AI player'})),/role="img" aria-label="AI player"/);
});
