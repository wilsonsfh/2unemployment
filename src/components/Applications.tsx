import {useEffect,useRef,useState} from 'react';
import type {Application,ApplicationPage,ApplicationStatus} from '../lib/applications.mjs';
import {applicationStatuses} from '../lib/applications.mjs';

type Account={user:{id:string;name:string;email:string}|null;providers:{google:boolean;github:boolean;email:boolean}};
const labels:Record<ApplicationStatus,string>={saved:'Saved',applied:'Applied',interviewing:'Interviewing',offer:'Offer',rejected:'Rejected',withdrawn:'Withdrawn'};
async function api<T>(path:string,method='GET',body?:unknown):Promise<T> {
 const response=await fetch(path,{method,credentials:'same-origin',cache:'no-store',...(body!==undefined?{headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}:{})});
 const data=await response.json() as {error?:string|{message?:string};message?:string};
 if(!response.ok)throw Error((typeof data.error==='string'?data.error:data.error?.message)||data.message||'This request could not be completed');
 return data as T;
}
export default function Applications() {
 const [account,setAccount]=useState<Account>(),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 const [result,setResult]=useState<ApplicationPage>(),[status,setStatus]=useState('all'),[offset,setOffset]=useState(0),[refresh,setRefresh]=useState(0);
 const [selectedId,setSelectedId]=useState(''),[draft,setDraft]=useState({status:'saved' as ApplicationStatus,notes:'',appliedOn:''});
 const [email,setEmail]=useState(''),[otp,setOtp]=useState(''),[codeRequested,setCodeRequested]=useState(false);
 const [adding,setAdding]=useState(false),[external,setExternal]=useState({company:'',title:'',applyUrl:''}),[removing,setRemoving]=useState(false);
 const [bookmarks,setBookmarks]=useState<string[]>([]),[notice,setNotice]=useState('');
 const pendingSaved=useRef(false);
 const selected=result?.applications.find(row=>row.id===selectedId);
 const pendingJob=typeof window==='undefined'?'':new URLSearchParams(window.location.search).get('job')||'';
 const callbackURL=`/applications${/^[A-Za-z0-9_-]{1,160}$/.test(pendingJob)?`?job=${encodeURIComponent(pendingJob)}`:''}`;
 const loadAccount=()=>api<Account>('/api/account').then(setAccount).catch(e=>setError(e.message));
 useEffect(()=>{void loadAccount();try{const ids:unknown=JSON.parse(localStorage.getItem('2unemployment-saved')||localStorage.getItem('gradsg-saved')||'[]');if(Array.isArray(ids))setBookmarks([...new Set(ids.filter((id):id is string=>typeof id==='string'&&/^[A-Za-z0-9_-]{1,160}$/.test(id)))])}catch{/* Browser bookmarks may be unavailable. */}},[]);
 useEffect(()=>{
  if(!account?.user)return;
  const controller=new AbortController();setResult(undefined);setError('');
  fetch(`/api/applications?status=${status}&offset=${offset}`,{signal:controller.signal,cache:'no-store'}).then(async response=>{if(!response.ok)throw Error('Applications could not load');return response.json() as Promise<ApplicationPage>}).then(data=>{if(!controller.signal.aborted){setResult(data);setSelectedId(previous=>data.applications.some(row=>row.id===previous)?previous:data.applications[0]?.id||'')}}).catch(e=>{if(!controller.signal.aborted)setError(e.message)});
  return()=>controller.abort();
 },[account?.user?.id,status,offset,refresh]);
 useEffect(()=>{if(selected)setDraft({status:selected.status,notes:selected.notes,appliedOn:selected.appliedOn||''});setRemoving(false)},[selected]);
 useEffect(()=>{
  if(!account?.user||pendingSaved.current||!/^[A-Za-z0-9_-]{1,160}$/.test(pendingJob))return;
  pendingSaved.current=true;setBusy(true);
  api<Application>('/api/applications','POST',{jobId:pendingJob}).then(saved=>{setSelectedId(saved.id);setNotice('Role saved to your applications.');setRefresh(value=>value+1);window.history.replaceState(null,'','/applications')}).catch(e=>setError(e.message)).finally(()=>setBusy(false));
 },[account?.user?.id,pendingJob]);
 async function action(task:()=>Promise<void>) {setBusy(true);setError('');setNotice('');try{await task()}catch(e){setError(e instanceof Error?e.message:'Please try again')}finally{setBusy(false)}}
 const changed=!!selected&&(draft.status!==selected.status||draft.notes!==selected.notes||draft.appliedOn!==(selected.appliedOn||''));
 const signIn=(provider:'google'|'github')=>action(async()=>{const data=await api<{url:string}>('/api/auth/sign-in/social','POST',{provider,callbackURL});window.location.assign(data.url)});

 return <>
  <div className="application-heading"><div><div className="eyebrow">YOUR JOB SEARCH</div><h1>Applications</h1><p>Save a role. Track the next step. Keep your notes in one place.</p></div>{account?.user&&<button className="secondary" disabled={busy} onClick={()=>void action(async()=>{await api('/api/auth/sign-out','POST',{});setAccount({...account,user:null});setResult(undefined);setSelectedId('')})}>Sign out</button>}</div>
  {error&&<div className="application-message error" role="alert">{error}<button onClick={()=>{setRefresh(value=>value+1);void loadAccount()}}>Try again</button></div>}
  {notice&&<p className="application-message" role="status">{notice}</p>}
  {!account&&!error&&<p role="status">Loading your account…</p>}
  {account&&!account.user&&<section className="application-login" aria-labelledby="sign-in-title">
   <div><h2 id="sign-in-title">Sign in to keep your progress.</h2><p>Your applications are private to your account and available across devices. Add roles from this board or any job URL.</p><ul><li>Saved → applied → interviewing → offer</li><li>Application dates and private notes</li><li>Import the roles saved in this browser</li></ul><p className="application-muted">Signing in with Google or GitHub shares your profile and email address with 2unemployment. Email codes are delivered through Resend.</p><a href="/guides/privacy">Privacy and account data →</a></div>
   <div className="application-login-form"><div className="social-signin"><button className="secondary" disabled={busy||!account.providers.google} onClick={()=>void signIn('google')}>Continue with Google{!account.providers.google&&' · unavailable'}</button><button className="secondary" disabled={busy||!account.providers.github} onClick={()=>void signIn('github')}>Continue with GitHub{!account.providers.github&&' · unavailable'}</button></div>
    <form onSubmit={event=>{event.preventDefault();void action(async()=>{if(codeRequested){await api('/api/auth/sign-in/email-otp','POST',{email,otp});setOtp('');await loadAccount()}else{await api('/api/auth/email-otp/send-verification-otp','POST',{email,type:'sign-in'});setCodeRequested(true)}})}}>
     <label>Email address<input type="email" autoComplete="email" required value={email} disabled={busy||codeRequested||!account.providers.email} onChange={e=>setEmail(e.target.value)}/></label>
     {codeRequested&&<><p>Enter the six-digit code from your email. It expires in five minutes.</p><label>Verification code<input autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required value={otp} disabled={busy} onChange={e=>setOtp(e.target.value)}/></label></>}
     <button className="primary" disabled={busy||!account.providers.email}>{busy?'Please wait…':codeRequested?'Verify and sign in':'Email me a sign-in code'}</button>
     {codeRequested&&<button type="button" className="text-button" disabled={busy} onClick={()=>{setCodeRequested(false);setOtp('')}}>Use another email or request a new code</button>}
    </form>
    {!Object.values(account.providers).some(Boolean)&&<p className="application-muted">Sign-in is being set up. Your existing browser bookmarks still work on the job board.</p>}
   </div>
  </section>}
  {account?.user&&<>
   <div className="application-account"><span>Signed in as <strong>{account.user.email}</strong></span><span>Private · saved to your account</span></div>
   <div className="application-toolbar"><label>Stage<select value={status} disabled={busy} onChange={e=>{setStatus(e.target.value);setOffset(0)}}><option value="all">All applications</option>{applicationStatuses.map(value=><option key={value} value={value}>{labels[value]}</option>)}</select></label><button className="primary" disabled={busy} onClick={()=>setAdding(!adding)}>{adding?'Cancel':'Add a job URL'}</button>{bookmarks.length>0&&<button className="secondary" disabled={busy} onClick={()=>void action(async()=>{let imported=0;for(const jobId of bookmarks){const response=await fetch('/api/applications',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jobId})});if(response.ok)imported++;else if(response.status!==404)throw Error('Import paused. Retry to import the remaining roles; existing progress is preserved.')}setNotice(`Imported ${imported} browser bookmarks. Existing application progress was preserved.`);setRefresh(value=>value+1);setBookmarks([])})}>Import {bookmarks.length} browser bookmarks</button>}</div>
   {adding&&<form className="external-application" onSubmit={event=>{event.preventDefault();void action(async()=>{const saved=await api<Application>('/api/applications','POST',external);setSelectedId(saved.id);setExternal({company:'',title:'',applyUrl:''});setAdding(false);setStatus('all');setOffset(0);setRefresh(value=>value+1);setNotice('Job added to your applications.')})}}><h2>Add a job from anywhere</h2><label>Job URL<input type="url" required maxLength={2048} value={external.applyUrl} onChange={e=>setExternal({...external,applyUrl:e.target.value})}/></label><label>Company<input required maxLength={200} value={external.company} onChange={e=>setExternal({...external,company:e.target.value})}/></label><label>Role title<input required maxLength={300} value={external.title} onChange={e=>setExternal({...external,title:e.target.value})}/></label><p className="application-muted">This creates a private entry. It does not publish or verify the job on this board.</p><button className="primary" disabled={busy}>Save job</button></form>}
   {!result&&!error&&<p role="status">Loading applications…</p>}
   {result&&<><div className="application-workspace"><section className="application-list" aria-label="Saved applications">
    {!result.applications.length?<div className="application-empty"><h2>{status==='all'?'Start with a role worth pursuing.':'No applications at this stage.'}</h2><p>Add a job URL above, import your browser bookmarks, or open a role on the board and choose “Track application”.</p><a href="/">Find a role →</a></div>:result.applications.map(row=><button key={row.id} className={`application-row ${row.id===selectedId?'selected':''}`} aria-pressed={row.id===selectedId} onClick={()=>setSelectedId(row.id)}><span className="application-company">{row.company}</span><strong>{row.title}</strong><span className={`application-stage stage-${row.status}`}>{labels[row.status]}</span><small>{row.appliedOn?`Applied ${row.appliedOn}`:'Not applied yet'}{!row.jobId?' · Added by you':''}</small></button>)}
   </section><section className="application-editor" aria-label="Application details">{selected?<form onSubmit={event=>{event.preventDefault();void action(async()=>{await api(`/api/applications/${selected.id}`,'PATCH',{...draft,appliedOn:draft.appliedOn||null});setNotice('Application updated.');setRefresh(value=>value+1)})}}><span className="application-company">{selected.company}</span><h2>{selected.title}</h2><div className="application-links"><a href={selected.applyUrl} target="_blank" rel="noopener noreferrer">Open job link ↗</a>{selected.jobId&&<a href={`/jobs/${encodeURIComponent(selected.jobId)}`}>View board listing →</a>}</div><label>Status<select value={draft.status} disabled={busy} onChange={e=>setDraft({...draft,status:e.target.value as ApplicationStatus})}>{applicationStatuses.map(value=><option key={value} value={value}>{labels[value]}</option>)}</select></label><label>Application date<input type="date" value={draft.appliedOn} disabled={busy} onChange={e=>setDraft({...draft,appliedOn:e.target.value})}/></label><label>Private notes<textarea rows={8} maxLength={10000} value={draft.notes} disabled={busy} onChange={e=>setDraft({...draft,notes:e.target.value})} placeholder="Next steps, interview preparation, or questions for the recruiter"/></label><div className="application-editor-actions"><button className="primary" disabled={busy||!changed}>{busy?'Saving…':'Save changes'}</button>{changed&&<span>Unsaved changes</span>}</div><div className="application-remove">{removing?<><p>Remove this application and its notes from your account?</p><button type="button" className="secondary" disabled={busy} onClick={()=>void action(async()=>{await api(`/api/applications/${selected.id}`,'DELETE');setRemoving(false);setRefresh(value=>value+1);setNotice('Application removed.')})}>Remove application</button><button type="button" className="text-button" onClick={()=>setRemoving(false)}>Keep it</button></>:<button type="button" className="text-button" disabled={busy} onClick={()=>setRemoving(true)}>Remove from tracker</button>}</div></form>:<p className="application-muted">Choose an application to see its details.</p>}</section></div>
   <div className="application-pagination"><span>{result.total} {result.total===1?'application':'applications'} · {result.total?`${offset+1}–${Math.min(offset+result.limit,result.total)}`:'0'}</span><button className="secondary" disabled={offset===0||busy} onClick={()=>setOffset(Math.max(0,offset-50))}>Previous</button><button className="secondary" disabled={!result.hasMore||busy} onClick={()=>setOffset(offset+50)}>Next</button></div></>}
  </>}
 </>;
}
