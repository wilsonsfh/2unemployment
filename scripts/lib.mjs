export const strip = text => text.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&#\d+;/g,' ').replace(/\s+/g,' ').trim();
export function canonical(url) {
  const u = new URL(url);
  for (const key of [...u.searchParams.keys()]) if (/^(utm_|source$|ref$|lever-source$)/i.test(key)) u.searchParams.delete(key);
  u.hash=''; u.searchParams.sort();
  return u.toString().replace(/\/$/,'');
}
export function classify(title, location, description='') {
  if (!/singapore/i.test(location)) return null;
  if (/intern(ship)?\b|co-?op|working student/i.test(title)) return null;
  if (/\b(senior|staff|principal|lead|manager|director|architect)\b/i.test(title)) return null;
  if (!/software|full[ -]?stack|back[ -]?end|front[ -]?end|developer|development engineer|site reliability engineer/i.test(title)) return null;
  const text=strip(description);
  // Explicit requirements take precedence over recruitment boilerplate about graduates.
  if (/(?:minimum|at least)\s+(?:[3-9]|\d{2,})(?:\+)?\s+years?|(?:[3-9]|\d{2,})\+\s+years?(?:\s+of)?\s+(?:professional|relevant|industry|work)/i.test(text)) return 'review';
  if (/new[ -]?grad|graduate|early career|entry[ -]?level|junior/i.test(title)) return 'explicit';
  return 'review';
}
export function normalize(raw, source, now) {
  const lever=source.adapter==='lever';
  const ashby=source.adapter==='ashby';
  const shopee=source.adapter==='shopee';
  const title=lever?raw.text:shopee?raw.job_name:raw.title;
  const location=lever?raw.categories?.location:ashby?[raw.location,...(raw.secondaryLocations||[]).map(x=>x.location)].filter(Boolean).join(', '):shopee?source.locationNames?.[raw.city_id]:raw.location?.name;
  const content=lever?raw.descriptionPlain||raw.description||'':ashby?raw.descriptionHtml||raw.descriptionPlain||'':shopee?`${raw.sub_team_description||''}<h3>Responsibilities</h3>${raw.job_description||''}<h3>Requirements</h3>${raw.requirements||''}`:raw.content||'';
  const lists=lever?(raw.lists||[]).map(x=>`<h3>${x.text}</h3>${x.content}`).join(''):'';
  const description=text(content+'\n'+lists);
  if (!title || !location) return null;
  if (ashby && (!raw.isListed || raw.employmentType!=='FullTime')) return null;
  if (shopee && raw.employment_id!==source.entryLevelId) return null;
  if (lever && raw.categories?.commitment && !/full[ -]?time|regular/i.test(raw.categories.commitment)) return null;
  const eligibility=classify(title,location,description);
  if (!eligibility) return null;
  const url=lever?raw.hostedUrl:ashby?raw.jobUrl:shopee?`https://careers.shopee.sg/job-detail/${raw.job_id}/1`:raw.absolute_url;
  if (!url || !/^https:\/\//.test(url)) return null;
  return {id:source.idAliases?.[raw.job_id]||`${source.id}-${shopee?raw.job_id:raw.id}`,company:source.name,title,location,category:'swe',employment:'full-time',eligibility,
    eligibilityNote:experienceNote(content+' '+lists)||(eligibility==='explicit'?'Graduate or early-career wording in the employer title. Check the full requirements.':'Full-time software role; graduate eligibility needs manual review.'),
    cohort:[...new Set(title.match(/202[6-9]/g)||[])],tags:[/c\+\+/i.test(title)?'C++':/backend|back-end/i.test(title)?'Backend':/full.stack/i.test(title)?'Full-stack':'Software'],
    workplace:lever||ashby?({OnSite:'On-site',onsite:'On-site',hybrid:'Hybrid',remote:'Remote'}[raw.workplaceType]||raw.workplaceType||'Not specified'):'Not specified',status:'listed',sourceName:source.name+' careers',sourceType:'employer-api',sourceUrl:canonical(url),applyUrl:canonical(url),
    checkedAt:now,firstSeen:now,managedBy:source.id,description:description.slice(0,18000),requirements:requirementsFrom(content+'\n'+lists),detailStatus:'verified',detailCheckedAt:now,workRights:workRightsNote(description),salary:advertisedSalary(raw,canonical(url),now)};
}
export function deduplicate(jobs) {
  const byUrl=new Map();
  for (const job of jobs) {
    const key=canonical(job.applyUrl);
    const previous=byUrl.get(key);
    if (!previous || (job.sourceType==='employer-api' && previous.sourceType!=='employer-api')) byUrl.set(key,job);
  }
  return [...byUrl.values()];
}
export function mergeFeed(previous, seeds, results, now) {
  const old=new Map(previous.map(j=>[j.id,j]));
  const jobs=[...seeds];
  for(const {source,jobs:fresh,error} of results) {
    const prior=previous.filter(j=>j.managedBy===source.id);
    if(error) {jobs.push(...prior);continue;}
    const seen=new Set(fresh.map(j=>j.id));
    for(const j of fresh) {const p=old.get(j.id); jobs.push({...j,firstSeen:p?.firstSeen||now,salary:j.salary||p?.salary});}
    for(const j of prior) if(!seen.has(j.id)) {
      const missingChecks=(j.missingChecks||0)+1;
      jobs.push({...j,missingChecks,status:missingChecks>=2?'closed':j.status,checkedAt:missingChecks>=2?now:j.checkedAt});
    }
  }
  return deduplicate(jobs);
}
import {text,requirementsFrom,experienceNote,workRightsNote,advertisedSalary} from './details.mjs';
