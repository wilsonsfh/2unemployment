import type {APIRoute} from 'astro';
import {getIdentity,enabledProviders} from '../../lib/server-identity';
import {privateJson} from '../../lib/application-api.mjs';

export const GET:APIRoute=async({request})=>{
 try {
  const auth=getIdentity(),session=auth&&await auth.api.getSession({headers:request.headers});
  return privateJson({user:session?{id:session.user.id,name:session.user.name,email:session.user.email}:null,providers:enabledProviders()});
 }catch{return privateJson({error:'Your account could not load'},503)}
};
