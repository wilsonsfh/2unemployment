import {betterAuth as MutliAuth} from 'better-auth';
export type IdentityConfig={secret:string;baseURL:string;googleId?:string;googleSecret?:string;githubId?:string;githubSecret?:string;resendKey?:string;emailFrom?:string};
export function identityProviders(config:Partial<IdentityConfig>):{google:boolean;github:boolean;email:boolean};
export function createIdentity(database:D1Database,config:IdentityConfig,options?:{fetcher?:typeof fetch}):ReturnType<typeof MutliAuth>;
