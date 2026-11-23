import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import guideLinks,{guideUrl} from '../scripts/guide-links.mjs';

const file=fileURLToPath(new URL('../docs/build-your-own-board.md',import.meta.url));
test('guide links keep Markdown sources portable while resolving web routes and assets',()=>{
 assert.equal(guideUrl('pipeline.md#flow',file),'/guides/pipeline#flow');
 assert.equal(guideUrl('pipeline.md?view=source#flow',file),'/guides/pipeline?view=source#flow');
 assert.equal(guideUrl('../public/brand/logo.svg',file),'/brand/logo.svg');
 assert.equal(guideUrl('../progress.md',file),'https://github.com/wilsonsfh/2unemployment/blob/main/progress.md');
 for(const url of ['https://example.com/a.md','mailto:owner@example.com','#flow','/api/jobs','//example.com'])assert.equal(guideUrl(url,file),url);
});
test('Markdown visitors rewrite links, definitions and images only in project guides',()=>{
 const plugin=guideLinks({fileURL:new URL(`file://${file}`)});
 const context={setField:(node,key,value)=>{node[key]=value}};
 for(const type of ['link','definition','image']) {
  const node={url:'pipeline.md#flow'};
  plugin[type](node,context);
  assert.equal(node.url,'/guides/pipeline#flow');
 }
 assert.equal(plugin.code,undefined);
 assert.equal(guideLinks({fileURL:new URL(`file://${file.replace('/docs/','/src/')}`)}),false);
});
