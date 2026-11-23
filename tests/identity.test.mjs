import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {createIdentity,identityProviders} from '../src/lib/identity.mjs';

const config={secret:'test-identity-secret-at-least-thirty-two-characters',baseURL:'https://example.com',resendKey:'test-only-key',emailFrom:'Test <test@example.com>'};
function setup(t,{failSend=false}={}) {
 const db=new DatabaseSync(':memory:');t.after(()=>db.close());
 db.exec(readFileSync(new URL('../migrations/0002_identity.sql',import.meta.url),'utf8'));
 const messages=[];
 const auth=createIdentity(db,config,{fetcher:async(url,options)=>{assert.equal(url,'https://api.resend.com/emails');messages.push(JSON.parse(options.body));return Response.json(failSend?{message:'failed'}:{id:'test-message'},{status:failSend?503:200})}});
 const request=(path,body,cookie)=>auth.handler(new Request(`${config.baseURL}/api/auth/${path}`,{method:body?'POST':'GET',headers:{Origin:config.baseURL,'Content-Type':'application/json','cf-connecting-ip':'127.0.0.1',...(cookie?{Cookie:cookie}:{})},...(body?{body:JSON.stringify(body)}:{})}));
 return {auth,db,messages,request};
}
test('Resend email OTP creates a verified identity, uses a secure session and prevents code reuse',async t=>{
 const {db,messages,request}=setup(t);
 const sent=await request('email-otp/send-verification-otp',{email:'alice@example.com',type:'sign-in'});
 assert.equal(sent.status,200);
 const otp=messages[0].text.match(/\b\d{6}\b/)[0];
 assert.ok(!JSON.stringify(db.prepare('SELECT value FROM verification').all()).includes(otp));
 assert.equal((await request('sign-in/email-otp',{email:'alice@example.com',otp:'wrong'})).status,400);
 const signed=await request('sign-in/email-otp',{email:'alice@example.com',otp});
 assert.equal(signed.status,200);
 const cookies=signed.headers.get('set-cookie');
 assert.match(cookies,/HttpOnly/i);assert.match(cookies,/Secure/);assert.match(cookies,/SameSite=Lax/i);
 const cookie=cookies.split(';')[0];
 const session=await (await request('get-session',undefined,cookie)).json();
 assert.equal(session.user.email,'alice@example.com');assert.equal(session.user.emailVerified,true);
 assert.equal(await (await request('get-session')).json(),null);
 assert.equal((await request('sign-in/email-otp',{email:'alice@example.com',otp})).status,400);
 await request('sign-out',{},cookie);
 assert.equal(await (await request('get-session',undefined,cookie)).json(),null);
});
test('email delivery failure cannot create a session and providers require complete configuration',async t=>{
 const {request}=setup(t,{failSend:true});
 // Better Auth deliberately returns the same send response regardless of delivery.
 assert.equal((await request('email-otp/send-verification-otp',{email:'alice@example.com',type:'sign-in'})).status,200);
 assert.equal(await (await request('get-session')).json(),null);
 assert.deepEqual(identityProviders({}),{google:false,github:false,email:false});
 assert.deepEqual(identityProviders({...config,googleId:'id',googleSecret:'secret',githubId:'id',githubSecret:'secret'}),{google:true,github:true,email:true});
});

test('expired codes, repeated guesses and cross-origin code requests cannot sign in',async t=>{
 const {db,messages,request,auth}=setup(t);
 const email='alice@example.com';
 await request('email-otp/send-verification-otp',{email,type:'sign-in'});
 const otp=messages[0].text.match(/\b\d{6}\b/)[0],wrong=otp==='000000'?'111111':'000000';
 for(let i=0;i<3;i++)assert.equal((await request('sign-in/email-otp',{email,otp:wrong})).status,400);
 assert.ok((await request('sign-in/email-otp',{email,otp})).status>=400);
 db.exec('DELETE FROM "rateLimit"');
 await request('email-otp/send-verification-otp',{email:'expired@example.com',type:'sign-in'});
 const expired=messages.at(-1).text.match(/\b\d{6}\b/)[0];
 db.prepare('UPDATE verification SET expiresAt=0').run();
 assert.ok((await request('sign-in/email-otp',{email:'expired@example.com',otp:expired})).status>=400);
 db.exec('DELETE FROM "rateLimit"');
 const attack=await auth.handler(new Request(`${config.baseURL}/api/auth/email-otp/send-verification-otp`,{method:'POST',headers:{Origin:'https://attacker.example','Content-Type':'application/json'},body:JSON.stringify({email,type:'sign-in'})}));
 assert.equal(attack.status,403);
});

test('Google and GitHub starts use the registered callback origin without creating sessions',async t=>{
 const db=new DatabaseSync(':memory:');t.after(()=>db.close());
 db.exec(readFileSync(new URL('../migrations/0002_identity.sql',import.meta.url),'utf8'));
 const auth=createIdentity(db,{...config,resendKey:undefined,googleId:'google-test-id',googleSecret:'test-secret',githubId:'github-test-id',githubSecret:'test-secret'});
 for(const provider of ['google','github']) {
  const response=await auth.handler(new Request(`${config.baseURL}/api/auth/sign-in/social`,{method:'POST',headers:{Origin:config.baseURL,'Content-Type':'application/json'},body:JSON.stringify({provider,callbackURL:'/applications'})}));
  assert.equal(response.status,200);
  const target=new URL((await response.json()).url);
  assert.equal(target.hostname,provider==='google'?'accounts.google.com':'github.com');
  assert.equal(target.searchParams.get('redirect_uri'),`${config.baseURL}/api/auth/callback/${provider}`);
 }
 assert.equal(db.prepare('SELECT COUNT(*) AS total FROM session').get().total,0);
});
