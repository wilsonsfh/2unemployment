import {env} from 'cloudflare:workers';
import {createIdentity,identityProviders} from './identity.mjs';

export function identityConfig() {
 return {secret:env.BETTER_AUTH_SECRET,baseURL:env.AUTH_BASE_URL,googleId:env.GOOGLE_CLIENT_ID,googleSecret:env.GOOGLE_CLIENT_SECRET,githubId:env.GITHUB_CLIENT_ID,githubSecret:env.GITHUB_CLIENT_SECRET,resendKey:env.RESEND_API_KEY,emailFrom:env.EMAIL_FROM};
}
export function getIdentity() {
 const config=identityConfig();
 return config.secret?createIdentity(env.DB,config):null;
}
export function enabledProviders() {
 const config=identityConfig();
 return identityProviders(config.secret?config:{});
}
