import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';

const digest=bytes=>createHash('sha256').update(bytes).digest('hex');

export async function verifyDeployment(baseUrl,{feed,assets=[],fetcher=fetch}) {
 const version=digest(JSON.stringify(feed));
 const get=async(path,revision=version)=>{
  const url=new URL(path,baseUrl);url.searchParams.set('verification',revision);
  const response=await fetcher(url,{headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(10000)});
  if(!response.ok)throw Error(`${url.pathname}: HTTP ${response.status}`);
  return response;
 };
 const meta=await (await get('/api/catalog')).json();
 if(meta.version!==version||meta.generatedAt!==feed.generatedAt)throw Error('Deployed catalog revision does not match the imported snapshot');
 const page=await (await get('/api/jobs?limit=1')).json();
 if(page.version!==version||!Array.isArray(page.jobs))throw Error('Deployed list revision does not match the imported snapshot');
 const recovery=await (await get('/data/jobs.json')).json();
 if(digest(JSON.stringify(recovery))!==version)throw Error('Public recovery snapshot does not match the imported snapshot');
 const sample=feed.jobs.find(job=>job.status==='listed'&&job.eligibility==='explicit')||feed.jobs[0];
 if(sample) {
  const job=await (await get(`/api/jobs/${encodeURIComponent(sample.id)}`)).json();
  if(job.id!==sample.id||job.title!==sample.title)throw Error('Deployed role does not match the snapshot');
 }
 for(const asset of assets) {
  const expected=digest(asset.bytes);
  const bytes=Buffer.from(await (await get(asset.path,expected)).arrayBuffer());
  if(digest(bytes)!==expected)throw Error(`Deployed asset does not match: ${asset.path}`);
 }
 return {version,generatedAt:meta.generatedAt,jobId:sample?.id??null,assets:assets.length};
}

async function main() {
 const args=process.argv.slice(2);
 if(args.length!==2||args[0]!=='--url')throw Error('Usage: node scripts/verify-deployment.mjs --url https://your-site.example');
 const feed=JSON.parse(await readFile('public/data/jobs.json','utf8'));
 const assets=await Promise.all(['logo.svg','logo-original.jpeg'].map(async name=>({path:`/brand/${name}`,bytes:await readFile(`public/brand/${name}`)})));
 // A newly deployed Worker can take a short time to become visible everywhere.
 for(let attempt=1;attempt<=3;attempt++) {
  try {
   const result=await verifyDeployment(args[1],{feed,assets});
   console.log(`Verified deployed catalog ${result.version}, generated ${result.generatedAt}, role ${result.jobId}, ${result.assets} brand assets`);
   return;
  } catch(error) {
   if(attempt===3)throw error;
   console.error(`Deployment verification attempt ${attempt}: ${error.message}`);
   await new Promise(resolve=>setTimeout(resolve,5000));
  }
 }
}

if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {
 main().catch(error=>{console.error(error.message);process.exitCode=1});
}
