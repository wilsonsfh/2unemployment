import test from 'node:test';
import assert from 'node:assert/strict';
import {jsonResponse} from '../src/lib/http.mjs';

test('public JSON uses a representation ETag and revalidates changed content',async()=>{
 const request=new Request('https://example.com/api/jobs');
 const first=await jsonResponse({jobs:[{id:'a'}]},request);
 const tag=first.headers.get('ETag');
 assert.match(tag,/^"[a-f0-9]{64}"$/);
 const revalidation=new Request(request,{headers:{'If-None-Match':tag}});
 const unchanged=await jsonResponse({jobs:[{id:'a'}]},revalidation);
 assert.equal(unchanged.status,304);
 assert.equal(await unchanged.text(),'');
 const changed=await jsonResponse({jobs:[{id:'b'}]},revalidation);
 assert.equal(changed.status,200);
 assert.notEqual(changed.headers.get('ETag'),tag);
 assert.match(changed.headers.get('Cache-Control'),/s-maxage=60/);
});

test('compressed response revalidation accepts weak ETags and matching tag lists',async()=>{
 const url='https://example.com/api/jobs';
 const data={jobs:[{id:'a'}]};
 const first=await jsonResponse(data,new Request(url));
 const tag=first.headers.get('ETag');
 for(const value of [`W/${tag}`,`"other", W/${tag}`,'*']) {
  const response=await jsonResponse(data,new Request(url,{headers:{'If-None-Match':value}}));
  assert.equal(response.status,304);
  assert.equal(await response.text(),'');
 }
 const changed=await jsonResponse({jobs:[{id:'b'}]},new Request(url,{headers:{'If-None-Match':`W/${tag}`}}));
 assert.equal(changed.status,200);
});

test('unavailable or invalid responses never enter the public cache',async()=>{
 const response=await jsonResponse({error:'Unavailable'},new Request('https://example.com/api/jobs'),{status:503,cache:false});
 assert.equal(response.status,503);
 assert.equal(response.headers.get('Cache-Control'),'no-store');
 assert.equal(response.headers.has('ETag'),false);
});
