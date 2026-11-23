import type {Job, Source} from '../types';

export type JobSummary = Omit<Job, 'description'|'requirements'> & {requirementsCount: number};
export type CatalogMeta = {
  version: string;
  generatedAt: string;
  sources: Source[];
  stats: {total:number; graduate:number; review:number; closed:number; companies:number; employerGraduate:number};
  cohorts: string[];
  salaryBenchmarks: JobSummary[];
};
export type JobPage = {jobs:JobSummary[]; total:number; limit:number; offset:number; hasMore:boolean; generatedAt:string|null; version:string|null};
export type CatalogDatabase = Pick<D1Database,'prepare'|'batch'>;
export class CatalogQueryError extends Error {}
export function listJobs(db:CatalogDatabase, params?:URLSearchParams): Promise<JobPage>;
export function getJob(db:CatalogDatabase, id:string): Promise<Job|null>;
export function getCatalogMeta(db:CatalogDatabase): Promise<CatalogMeta|null>;
