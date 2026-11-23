export async function jsonResponse(data, request, {status=200, cache=true}={}) {
 const body=JSON.stringify(data);
 const headers=new Headers({'Content-Type':'application/json; charset=utf-8','Cache-Control':cache?'public, max-age=0, s-maxage=60, must-revalidate':'no-store','X-Content-Type-Options':'nosniff'});
 if (cache) {
   const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(body));
   const etag=`"${Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('')}"`;
   headers.set('ETag',etag);
   return new Response(request.headers.get('If-None-Match')===etag?null:body,{status:request.headers.get('If-None-Match')===etag?304:status,headers});
 }
 return new Response(body,{status,headers});
}
