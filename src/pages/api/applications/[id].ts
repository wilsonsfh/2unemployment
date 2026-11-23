import type {APIRoute} from 'astro';
import {env} from 'cloudflare:workers';
import {getIdentity} from '../../../lib/server-identity';
import {applicationApi} from '../../../lib/application-api.mjs';
import {getJob} from '../../../lib/catalog.mjs';

export const ALL:APIRoute=({request,params})=>applicationApi(request,{db:env.DB,auth:getIdentity(),jobById:id=>getJob(env.DB,id)},params.id);
