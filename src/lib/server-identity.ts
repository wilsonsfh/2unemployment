import {env} from 'cloudflare:workers';
import {createIdentity,identityProviders} from './identity.mjs';

function optionalSecret(name:string):string|undefined {
 const value:unknown=Reflect.get(env,name);
 return typeof value==='string'&&value?value:undefined;
}
export function identityConfig() {
 return {secret:env.BETTER_AUTH_SECRET,baseURL:env.AUTH_BASE_URL,googleId:optionalSecret('GOOGLE_CLIENT_ID'),googleSecret:optionalSecret('GOOGLE_CLIENT_SECRET'),githubId:optionalSecret('GITHUB_CLIENT_ID'),githubSecret:optionalSecret('GITHUB_CLIENT_SECRET'),resendKey:optionalSecret('RESEND_API_KEY'),emailFrom:env.EMAIL_FROM};
}
export function getIdentity() {
 const config=identityConfig();
 return config.secret?createIdentity(env.DB,config):null;
}
export function enabledProviders() {
 const config=identityConfig();
 return identityProviders(config.secret?config:{});
}
