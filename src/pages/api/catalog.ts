import {env} from 'cloudflare:workers';
import type {APIRoute} from 'astro';
import {getCatalogMeta} from '../../lib/catalog.mjs';
import {jsonResponse} from '../../lib/http.mjs';

export const GET:APIRoute=async ({request})=>{
 try {
  const meta=await getCatalogMeta(env.DB);
  if(!meta)throw Error('Catalog has not been published');
  return await jsonResponse(meta,request);
 }
 catch(error) {console.error('catalog metadata unavailable',error);return jsonResponse({error:'Catalog temporarily unavailable'},request,{status:503,cache:false})}
};
