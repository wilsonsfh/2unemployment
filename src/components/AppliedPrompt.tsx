import {useEffect,useRef,useState} from 'react';
import type {Application,ApplicationStatus} from '../lib/applications.mjs';

type OpenedJob={jobId?:string;applicationId?:string;title:string};
const pendingKey='2unemployment-opened-job';

export default function AppliedPrompt() {
 const dialog=useRef<HTMLDialogElement>(null);
 const [pending,setPending]=useState<OpenedJob>(),[busy,setBusy]=useState(false),[error,setError]=useState(''),[localNotice,setLocalNotice]=useState(false);
 useEffect(()=>{
  const check=()=>{if(document.visibilityState!=='visible')return;try{const job=JSON.parse(sessionStorage.getItem(pendingKey)||'null');if(job&&typeof job.title==='string'&&(typeof job.jobId==='string'||typeof job.applicationId==='string'))setPending(job)}catch{/* Session storage may be unavailable. */}};
  const clicked=(event:MouseEvent)=>{
   if(event.button!==0&&event.button!==1)return;
   const anchor=event.target instanceof Element?event.target.closest<HTMLAnchorElement>('a[data-application-job],a[data-application-id]'):null;
   if(!anchor)return;
   const job:OpenedJob={jobId:anchor.dataset.applicationJob,applicationId:anchor.dataset.applicationId,title:anchor.dataset.applicationTitle||'This job'};
   try{sessionStorage.setItem(pendingKey,JSON.stringify(job))}catch{/* The link still opens if storage is blocked. */}
   setLocalNotice(false);
  };
  document.addEventListener('click',clicked);document.addEventListener('auxclick',clicked);
  window.addEventListener('focus',check);window.addEventListener('pageshow',check);document.addEventListener('visibilitychange',check);check();
  return()=>{document.removeEventListener('click',clicked);document.removeEventListener('auxclick',clicked);window.removeEventListener('focus',check);window.removeEventListener('pageshow',check);document.removeEventListener('visibilitychange',check)};
 },[]);
 useEffect(()=>{if(pending&&!dialog.current?.open)dialog.current?.showModal()},[pending]);
 async function answer(status:ApplicationStatus) {
  if(!pending)return;
  setBusy(true);setError('');
  try {
   let id=pending.applicationId;
   const request=async(path:string,method:string,body:unknown)=>fetch(path,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(body),cache:'no-store'});
   let response=id?undefined:await request('/api/applications','POST',{jobId:pending.jobId});
   if(response?.ok)id=((await response.json()) as Application).id;
   if(id)response=await request(`/api/applications/${encodeURIComponent(id)}`,'PATCH',{status});
   if(response?.status===401) {
    const answers=JSON.parse(sessionStorage.getItem('2unemployment-application-answers')||'{}');
    answers[pending.jobId||pending.applicationId!]=status;
    sessionStorage.setItem('2unemployment-application-answers',JSON.stringify(answers));setLocalNotice(true);
   } else if(!response?.ok)throw Error('Could not save your answer. Please try again.');
   sessionStorage.removeItem(pendingKey);dialog.current?.close();setPending(undefined);window.dispatchEvent(new Event('application-updated'));
  }catch(e){setError(e instanceof Error?e.message:'Could not save your answer. Please try again.')}finally{setBusy(false)}
 }
 return <>
  <dialog className="applied-prompt" ref={dialog} aria-labelledby="applied-question" onCancel={()=>{sessionStorage.removeItem(pendingKey);setPending(undefined)}}>
   <h2 id="applied-question">Applied?</h2><p>{pending?.title}</p>
   {error&&<p role="alert">{error}</p>}
   <div><button className="primary" disabled={busy} onClick={()=>void answer('applied')}>Yes</button><button className="secondary" disabled={busy} onClick={()=>void answer('saved')}>No</button></div>
  </dialog>
  {localNotice&&<div className="applied-session-notice" role="status">Saved for this tab. <a href="/applications">Sign in to track jobs across devices.</a><button aria-label="Dismiss" onClick={()=>setLocalNotice(false)}>×</button></div>}
 </>;
}
