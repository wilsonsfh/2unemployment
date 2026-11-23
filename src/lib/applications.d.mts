import type {Job} from '../types';
export type ApplicationStatus='saved'|'applied';
export type Application={id:string;jobId:string|null;company:string;title:string;applyUrl:string;status:ApplicationStatus;notes:string;appliedOn:string|null;createdAt:string;updatedAt:string};
export type ApplicationPage={applications:Application[];total:number;limit:number;offset:number;hasMore:boolean};
export const applicationStatuses:ApplicationStatus[];
export class ApplicationInputError extends Error {}
export function listApplications(db:D1Database,userId:string,params?:URLSearchParams):Promise<ApplicationPage>;
export function saveApplication(db:D1Database,userId:string,job:Pick<Job,'id'|'company'|'title'|'applyUrl'>):Promise<Application>;
export function addExternalApplication(db:D1Database,userId:string,input:unknown):Promise<Application>;
export function updateApplication(db:D1Database,userId:string,id:string,input:unknown):Promise<Application|null>;
export function deleteApplication(db:D1Database,userId:string,id:string):Promise<boolean>;
