import {load} from 'cheerio';

export function document(input='') {
  const decoded=/&lt;\/?(?:p|div|h[1-6]|ul)\b/i.test(input)?load(input).text():input;
  return load(decoded);
}
export function text(input='') {
  const $=document(input);
  $('script,style,nav,footer').remove();
  $('br').replaceWith('\n');$('p,li,h1,h2,h3,h4').append('\n');
  return $.root().text().replace(/[\t ]+/g,' ').replace(/ *\n */g,'\n').replace(/\n{3,}/g,'\n\n').trim();
}
export function requirementsFrom(input='') {
  const $=document(input);
  const heading=$('h1,h2,h3,h4,strong,b').filter((_,e)=>/^(minimum requirements|minimum qualifications|requirements|what you(?:.ll)? bring|what (?:we|you) (?:require|need)|what you.ll need|skills you.ll need|what we.re looking for|what we look for|qualifications|who you are)[: ]*$/i.test($(e).text().trim())).first();
  const scope=heading.length?(heading.parent().is('h1,h2,h3,h4')?heading.parent():heading).nextUntil('h1,h2,h3,h4'):null;
  const lines=scope?.length?scope.find('li').addBack('li').map((_,e)=>$(e).text().trim()).get():[];
  if(lines.length)return lines.slice(0,14);
  const plain=text(input);const start=plain.search(/minimum (?:requirements|qualifications)|requirements|what you(?:.ll)? bring|what we require|skills you.ll need|qualifications/i);
  return start<0?[]:plain.slice(start).split('\n').map(s=>s.replace(/^[-•]\s*/, '').trim()).filter(s=>s.length>30&&!/^(preferred|minimum|requirements|qualifications)/i.test(s)).slice(0,14);
}
export function experienceNote(input='') {
  const plain=text(input).replace(/\n/g,' ');
  return plain.match(/(?:no more than|less than|at least|minimum(?: of)?)\s+\d+\s+(?:months?|years?)[^.\n]{0,125}(?:experience)[^.;\n]{0,80}/i)?.[0]
    || plain.match(/\b\d+\s*(?:\+|[-–]\s*\d+)?\s+years?\s+(?:of\s+)?(?:relevant\s+|professional\s+|working\s+|software development\s+)?experience[^.;\n]{0,100}/i)?.[0];
}
export function workRightsNote(input='') {
  const line=text(input).split(/\n|(?<=[.!?])\s+/).find(s=>/visa sponsorship|right to work|work authori[sz]|singapore citizen|singaporean citizen|permanent resident/i.test(s));
  return line?.slice(0,650)||'Not stated in the employer content. Confirm with the recruiter.';
}
export function advertisedSalary(raw,url,now) {
  const c=raw.compensation?.summaryComponents?.find(c=>c.compensationType==='Salary'&&c.currencyCode==='SGD'&&c.interval==='1 YEAR'&&Number.isFinite(c.minValue)&&Number.isFinite(c.maxValue));
  if(!c)return undefined;
  const equity=raw.compensation.summaryComponents.some(x=>x.compensationType?.startsWith('Equity'));
  return {annual:c.minValue,annualMax:c.maxValue,currency:'SGD',basis:'salary',kind:'advertised',source:url,sourceName:'Employer posting',level:'Advertised range',note:`Employer-published annual salary range. ${equity?'Equity is offered separately; its value is not specified.':'Bonus and equity values are not specified.'}`,checkedAt:now};
}
function findApple(x) {
  if(!x||typeof x!=='object')return null;
  if(x.jobNumber&&x.jobSummary&&x.postingTitle)return x;
  for(const value of Object.values(x)){const found=findApple(value);if(found)return found}
  return null;
}
export function parseEmployerPage(html,source) {
  const $=load(html);let title,location,description,requirements,employment;
  const host=new URL(source.url).hostname;
  if(host==='joinbytedance.com'){
    title=$('h2').first().text().trim();
    const fields=$('p').map((_,e)=>$(e).text().trim()).get();
    location=fields[fields.indexOf('Location:')+1]==='Singapore'?'Singapore':'';
    employment=fields[fields.indexOf('Employment Type:')+1]==='Regular'?'full-time':'';
    const block=name=>$('p').filter((_,e)=>$(e).text().trim()===name).first().next('p').text().trim();
    const responsibilities=block('Responsibilities'),qualifications=block('Qualifications');
    description=`Responsibilities\n${responsibilities}\n\nQualifications\n${qualifications}`;
    requirements=qualifications.split('\n').map(s=>s.replace(/^[-•]\s*/, '').trim()).filter(s=>s.length>30);
    if(!responsibilities||!qualifications)throw new Error('Employer page sections missing');
  }else if(host==='jobs.apple.com'){
    const script=$('script').map((_,e)=>$(e).text()).get().find(s=>s.startsWith('window.__staticRouterHydrationData'));
    const literal=script?.match(/JSON\.parse\(("(?:\\.|[^"\\])*")\)/s)?.[1];
    if(!literal)throw new Error('Apple role data missing');
    const role=findApple(JSON.parse(JSON.parse(literal)));
    if(!role)throw new Error('Apple role record missing');
    title=role.postingTitle;
    location=JSON.stringify(role.locations).includes('Singapore')?'Singapore':'';
    employment=/full/i.test(role.employmentType||'')||(role.employmentType==='Standard'&&role.jobType==='CORPORATE')?'full-time':'';
    description=[role.jobSummary,role.description,'Minimum qualifications',role.minimumQualifications,'Preferred qualifications',role.preferredQualifications].map(s=>text(s||'')).join('\n\n');
    requirements=text(role.minimumQualifications||'').split('\n').filter(Boolean);
  }else throw new Error('No supported primary-page parser');
  if(!title||!location||!description||description.length<200)throw new Error('Primary page could not confirm title, Singapore location and description');
  return {title,location,employment,description:description.slice(0,18000),requirements:requirements.slice(0,18)};
}
