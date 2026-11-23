import {env} from 'cloudflare:workers';
import type {APIRoute} from 'astro';
import {CatalogQueryError,getJob} from '../../../lib/catalog.mjs';
import {jsonResponse} from '../../../lib/http.mjs';

export const GET:APIRoute=async ({request,params})=>{
 try {
  const job=await getJob(env.DB,params.id||'');
  return jsonResponse(job||{error:'Role not found'},request,{status:job?200:404,cache:!!job});
 } catch(error) {
  if(error instanceof CatalogQueryError)return jsonResponse({error:error.message},request,{status:400,cache:false});
  console.error('catalog detail unavailable',error);return jsonResponse({error:'Catalog temporarily unavailable'},request,{status:503,cache:false});
 }
};
