import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import vm from 'node:vm';
const html=readFileSync('test-v3/v3-candidate.html','utf8');
test('candidate has one coherent buyer and recipient journey',()=>{
 for(const id of ['builder','welcome','memoryScene','detailScene','finalScene','preview','create','backToEdit'])assert.match(html,new RegExp('id="'+id+'"'));
 assert.match(html,/builder\.setAttribute\('hidden',''\)/);
 assert.match(html,/querySelector\('#backToEdit'\)\.remove\(\)/);
 assert.match(html,/window\.levelYouOpen=loadGift/);
});
test('recipient export escapes dangerous inline JSON content',()=>{
 const source=html.match(/function safeJson\(x\)\{.*?\}(?=\s*\$\('preview'\))/s);
 assert.ok(source,'safeJson function found');
 const context={};vm.runInNewContext(source[0]+';this.safeJson=safeJson',context);
 const malicious={dedication:'</script><img src=x onerror=alert(1)> & \u2028'};
 const result=context.safeJson(malicious);
 assert.equal(result.includes('</script>'),false);
 assert.equal(result.includes('<img'),false);
 assert.equal(JSON.parse(result).dedication,malicious.dedication);
});
test('recipient controls have no edit button and gift is self contained',()=>{
 assert.match(html,/data\.type='application\/json'/);
 assert.match(html,/documentCopy\.outerHTML/);
 assert.match(html,/new Blob\(\[html\],\{type:'text\/html;charset=utf-8'\}\)/);
 assert.match(html,/a\.download='LEVEL-YOU-regalo\.html'/);
 assert.doesNotMatch(html,/<script[^>]+src=/);
 assert.doesNotMatch(html,/<link[^>]+href=/);
});
test('file input and navigation have explicit limits',()=>{
 assert.match(html,/file\.size>2\*1024\*1024/);
 assert.match(html,/image\/jpeg/);
 assert.match(html,/image\/webp/);
 assert.match(html,/gift\?\.detail\?'detailScene':'finalScene'/);
});
