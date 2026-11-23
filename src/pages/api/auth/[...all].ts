import type {APIRoute} from 'astro';
import {getIdentity} from '../../../lib/server-identity';
import {privateJson} from '../../../lib/application-api.mjs';

export const ALL:APIRoute=async({request})=>{
 const auth=getIdentity();
 if(!auth)return privateJson({error:'Sign-in is not configured yet'},503);
 try {
  const response=await auth.handler(request);
  response.headers.set('Cache-Control','private, no-store');
  response.headers.set('Vary','Cookie');
  response.headers.set('X-Robots-Tag','noindex');
  return response;
 }catch{return privateJson({error:'Sign-in is temporarily unavailable'},503)}
};
