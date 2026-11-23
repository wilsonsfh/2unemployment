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

test('unavailable or invalid responses never enter the public cache',async()=>{
 const response=await jsonResponse({error:'Unavailable'},new Request('https://example.com/api/jobs'),{status:503,cache:false});
 assert.equal(response.status,503);
 assert.equal(response.headers.get('Cache-Control'),'no-store');
 assert.equal(response.headers.has('ETag'),false);
});
