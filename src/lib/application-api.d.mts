import type {createIdentity} from './identity.mjs';
import type {Job} from '../types';
export function privateJson(data:unknown,status?:number):Response;
export function applicationApi(request:Request,services:{db:D1Database;auth:ReturnType<typeof createIdentity>|null;jobById:(id:string)=>Promise<Job|null>},id?:string):Promise<Response>;
