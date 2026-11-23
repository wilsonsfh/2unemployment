// Optional explicit lookup; never runs during ingestion or in the browser.
const key=process.env.LEVELS_API_KEY;
if(!key)throw new Error('Set LEVELS_API_KEY in your shell; do not put it in frontend code.');
const response=await fetch('https://api.levels.fyi/v1/api/benchmark/software-engineer',{
 method:'POST',headers:{'x-api-key':key,'Content-Type':'application/json'},
 body:JSON.stringify({locationSlugs:['singapore'],salaryType:'total_compensation',timeRange:'0-12'}),
 signal:AbortSignal.timeout(20000)
});
if(!response.ok)throw new Error(`Levels.fyi benchmark request failed: HTTP ${response.status}`);
console.log('Singapore software engineering market benchmark; not filtered to new graduates. Preserve response currency and methodology.');
console.log(JSON.stringify(await response.json(),null,2));
