import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {verifyDeployment} from '../scripts/verify-deployment.mjs';

const feed={generatedAt:'2026-11-23T05:23:17.489Z',jobs:[{id:'role-1',title:'Graduate developer',status:'listed',eligibility:'explicit'}],sources:[]};
const version=createHash('sha256').update(JSON.stringify(feed)).digest('hex');
const assets=[{path:'/brand/logo.svg',bytes:Buffer.from('<svg>brand</svg>')}];
function responses({stale=false,wrongAsset=false,wrongRole=false,wrongRecovery=false}={}) {
 return async url=>{
  const path=new URL(url).pathname;
  if(path==='/api/catalog')return Response.json({version:stale?'old':version,generatedAt:feed.generatedAt});
  if(path==='/api/jobs')return Response.json({version,jobs:[{id:'role-1'}]});
  if(path==='/data/jobs.json')return Response.json(wrongRecovery?{...feed,generatedAt:'old'}:feed);
  if(path==='/api/jobs/role-1')return Response.json({...feed.jobs[0],title:wrongRole?'Different role':feed.jobs[0].title});
  if(path==='/brand/logo.svg')return new Response(wrongAsset?'old logo':assets[0].bytes);
  return new Response('Not found',{status:404});
 };
}

test('deployment verification confirms the imported revision, API record and exact brand bytes',async()=>{
 const result=await verifyDeployment('https://example.com',{feed,assets,fetcher:responses()});
 assert.equal(result.version,version);
 assert.equal(result.jobId,'role-1');
 assert.equal(result.assets,1);
});

test('a healthy endpoint serving a different snapshot fails verification',async()=>{
 await assert.rejects(verifyDeployment('https://example.com',{feed,assets,fetcher:responses({stale:true})}),/catalog revision/i);
});

test('a catalog match does not hide stale brand files or a wrong role',async()=>{
 await assert.rejects(verifyDeployment('https://example.com',{feed,assets,fetcher:responses({wrongAsset:true})}),/asset.*logo/i);
 await assert.rejects(verifyDeployment('https://example.com',{feed,assets,fetcher:responses({wrongRole:true})}),/role.*match/i);
});

test('HTTP failures fail verification instead of accepting an error representation',async()=>{
 await assert.rejects(verifyDeployment('https://example.com',{feed,assets,fetcher:async()=>new Response('Unavailable',{status:503})}),/503/);
});

test('a current API cannot hide an old publicly downloadable recovery snapshot',async()=>{
 await assert.rejects(verifyDeployment('https://example.com',{feed,assets,fetcher:responses({wrongRecovery:true})}),/recovery snapshot/i);
});
