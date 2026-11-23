const appleId='apple-online-store-early';
const appleUrl='https://jobs.apple.com/en-sg/details/200654019-3278/software-engineer-apple-online-store-early-careers?team=SFTWR';

// Explicit restrictions from the source-use review; this is not a general rights engine.
export function restrictPublicJob(job) {
  const result={...job};
  if(result.id===appleId) Object.assign(result,{
    description:'',requirements:[],tags:['Software'],workplace:'Not specified',
    eligibilityNote:'Early-career wording in the listing title. Role text is omitted pending reuse permission; follow the Apple link to check requirements and availability.',
    workRights:'Not confirmed. Check the employer posting.',
    sourceName:'Apple listing link · text omitted',sourceType:'indexed',sourceUrl:appleUrl,applyUrl:appleUrl,detailStatus:'unavailable',
  });
  if(result.salary?.kind!=='advertised'&&(/^levels\.fyi$/i.test(result.salary?.sourceName||'')||/^https?:\/\/(?:www\.)?levels\.fyi(?:\/|$)/i.test(result.salary?.source||''))) delete result.salary;
  return result;
}
