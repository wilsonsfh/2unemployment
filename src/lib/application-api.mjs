import {ApplicationInputError,listApplications,saveApplication,addExternalApplication,updateApplication,deleteApplication} from './applications.mjs';

export function privateJson(data,status=200) {
 return Response.json(data,{status,headers:{'Cache-Control':'private, no-store','Vary':'Cookie','X-Robots-Tag':'noindex'}});
}
async function jsonBody(request) {
 const reader=request.body?.getReader();let size=0;const chunks=[];
 if(!reader)throw new ApplicationInputError('Request body is required');
 while(true) {
  const {done,value}=await reader.read();if(done)break;
  size+=value.byteLength;
  if(size>24000){await reader.cancel();throw new ApplicationInputError('Application request is too large')}
  chunks.push(value);
 }
 const bytes=new Uint8Array(size);let offset=0;
 for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength}
 try{return JSON.parse(new TextDecoder().decode(bytes))}catch{throw new ApplicationInputError('Enter valid application data')}
}

export async function applicationApi(request,{db,auth,jobById},id) {
 try {
  const session=auth&&await auth.api.getSession({headers:request.headers});
  if(!session)return privateJson({error:'Sign in to track applications'},401);
  const userId=session.user.id,method=request.method;
  if(method!=='GET') {
   if(request.headers.get('Origin')!==new URL(request.url).origin)return privateJson({error:'Invalid request origin'},403);
   if(['POST','PATCH'].includes(method)&&!request.headers.get('Content-Type')?.startsWith('application/json'))return privateJson({error:'Use JSON application data'},415);
  }
  if(!id&&method==='GET')return privateJson(await listApplications(db,userId,new URL(request.url).searchParams));
  if(!id&&method==='POST') {
   const input=await jsonBody(request);
   if(input&&typeof input==='object'&&Object.keys(input).length===1&&typeof input.jobId==='string') {
    if(!/^[A-Za-z0-9_-]{1,160}$/.test(input.jobId))throw new ApplicationInputError('Invalid job ID');
    const job=await jobById(input.jobId);
    if(!job)return privateJson({error:'Job not found'},404);
    return privateJson(await saveApplication(db,userId,job),201);
   }
   return privateJson(await addExternalApplication(db,userId,input),201);
  }
  if(id&&method==='PATCH') {
   const application=await updateApplication(db,userId,id,await jsonBody(request));
   return application?privateJson(application):privateJson({error:'Application not found'},404);
  }
  if(id&&method==='DELETE')return await deleteApplication(db,userId,id)?privateJson({deleted:true}):privateJson({error:'Application not found'},404);
  return privateJson({error:'Method not allowed'},405);
 }catch(error) {
  if(error instanceof ApplicationInputError)return privateJson({error:error.message},400);
  console.error('Private application request failed');
  return privateJson({error:'Applications are temporarily unavailable'},503);
 }
}
