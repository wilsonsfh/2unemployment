export const applicationStatuses=['saved','applied','interviewing','offer','rejected','withdrawn'];
export class ApplicationInputError extends Error {}
const columns='id, job_id AS jobId, company, title, apply_url AS applyUrl, status, notes, applied_on AS appliedOn, created_at AS createdAt, updated_at AS updatedAt';

export async function listApplications(db,userId,params=new URLSearchParams()) {
 const status=params.get('status')||'all',offset=Number(params.get('offset')||0),limit=50;
 if(!['all',...applicationStatuses].includes(status)||!Number.isSafeInteger(offset)||offset<0||offset>10000)throw new ApplicationInputError('Invalid application filter or page');
 const where=status==='all'?'user_id=?':'user_id=? AND status=?';
 const values=status==='all'?[userId]:[userId,status];
 const [rows,count]=await db.batch([
  db.prepare(`SELECT ${columns} FROM applications WHERE ${where} ORDER BY updated_at DESC,id LIMIT ? OFFSET ?`).bind(...values,limit,offset),
  db.prepare(`SELECT COUNT(*) AS total FROM applications WHERE ${where}`).bind(...values)
 ]);
 const total=count.results[0].total;
 return {applications:rows.results,total,limit,offset,hasMore:offset+limit<total};
}

export async function saveApplication(db,userId,job) {
 const now=new Date().toISOString();
 await db.prepare('INSERT INTO applications (id,user_id,job_id,company,title,apply_url,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(user_id,job_id) DO NOTHING').bind(crypto.randomUUID(),userId,job.id,job.company,job.title,job.applyUrl,now,now).run();
 return db.prepare(`SELECT ${columns} FROM applications WHERE user_id=? AND job_id=?`).bind(userId,job.id).first();
}

export async function addExternalApplication(db,userId,input) {
 if(!input||typeof input!=='object'||typeof input.company!=='string'||typeof input.title!=='string'||typeof input.applyUrl!=='string'||Object.keys(input).some(key=>!['company','title','applyUrl'].includes(key)))throw new ApplicationInputError('Enter company, job title and application URL');
 const company=input.company.trim(),title=input.title.trim();
 let url;try{url=new URL(input.applyUrl)}catch{throw new ApplicationInputError('Enter a valid job URL')}
 if(!company||company.length>200||!title||title.length>300||!['https:','http:'].includes(url.protocol)||url.username||url.password||url.href.length>2048)throw new ApplicationInputError('Check company, job title and URL');
 const id=crypto.randomUUID(),now=new Date().toISOString();
 await db.prepare('INSERT INTO applications (id,user_id,job_id,company,title,apply_url,created_at,updated_at) VALUES (?,?,NULL,?,?,?,?,?)').bind(id,userId,company,title,url.href,now,now).run();
 return db.prepare(`SELECT ${columns} FROM applications WHERE user_id=? AND id=?`).bind(userId,id).first();
}

export async function updateApplication(db,userId,id,input) {
 if(!input||typeof input!=='object'||Array.isArray(input)||!Object.keys(input).length||Object.keys(input).some(key=>!['status','notes','appliedOn'].includes(key)))throw new ApplicationInputError('Choose status, notes or application date');
 const fields=[],values=[];
 if('status' in input) {
  if(!applicationStatuses.includes(input.status))throw new ApplicationInputError('Invalid application status');
  fields.push('status=?');values.push(input.status);
 }
 if('notes' in input) {
  if(typeof input.notes!=='string'||input.notes.length>10000)throw new ApplicationInputError('Notes must contain at most 10,000 characters');
  fields.push('notes=?');values.push(input.notes);
 }
 if('appliedOn' in input) {
  const date=input.appliedOn;
  if(date!==null&&(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date))throw new ApplicationInputError('Enter a valid application date');
  fields.push('applied_on=?');values.push(date);
 }
 return db.prepare(`UPDATE applications SET ${fields.join(',')},updated_at=? WHERE user_id=? AND id=? RETURNING ${columns}`).bind(...values,new Date().toISOString(),userId,id).first();
}

export async function deleteApplication(db,userId,id) {
 const result=await db.prepare('DELETE FROM applications WHERE user_id=? AND id=?').bind(userId,id).run();
 return result.meta.changes>0;
}
