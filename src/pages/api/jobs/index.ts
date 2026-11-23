import {env} from 'cloudflare:workers';
import type {APIRoute} from 'astro';
import {CatalogQueryError,listJobs} from '../../../lib/catalog.mjs';
import {jsonResponse} from '../../../lib/http.mjs';

export const GET:APIRoute=async ({request,url})=>{
 try {return await jsonResponse(await listJobs(env.DB,url.searchParams),request)}
 catch(error) {
  const invalid=error instanceof CatalogQueryError;
  if(!invalid)console.error('catalog query failed',error);
  return jsonResponse({error:invalid?error.message:'Catalog temporarily unavailable'},request,{status:invalid?400:503,cache:false});
 }
};
