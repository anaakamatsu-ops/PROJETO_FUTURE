const VERSION='aqui-__VERSION__';
const SHELL=VERSION+'-shell', MEDIA='aqui-media-v1';
const PRECACHE=/*__PRECACHE__*/[];
self.addEventListener('install',event=>event.waitUntil(caches.open(SHELL).then(c=>c.addAll(PRECACHE))));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith('aqui-')&&k!==SHELL&&k!==MEDIA)await caches.delete(k);await self.clients.claim();})()));
self.addEventListener('message',e=>{if(e.data==='ACTIVATE')self.skipWaiting();});
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;
 if(url.pathname.startsWith('/media/')){
  event.respondWith((async()=>{const cache=await caches.open(MEDIA);const hit=await cache.match(url.pathname);if(!hit)return fetch(req);
   const range=req.headers.get('range');if(!range)return hit;
   const buf=await hit.arrayBuffer(),m=/^bytes=(\d+)-(\d*)$/.exec(range);
   if(!m)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${buf.byteLength}`}});
   const start=Number(m[1]),end=Math.min(m[2]?Number(m[2]):buf.byteLength-1,buf.byteLength-1);
   if(start>end||start>=buf.byteLength)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${buf.byteLength}`}});
   return new Response(buf.slice(start,end+1),{status:206,headers:{'Content-Type':hit.headers.get('content-type')||'audio/wav','Content-Range':`bytes ${start}-${end}/${buf.byteLength}`,'Accept-Ranges':'bytes','Content-Length':String(end-start+1)}});
  })());return;
 }
 if(req.mode==='navigate'){event.respondWith(fetch(req).catch(async()=>await caches.match('/index.html')||Response.error()));return;}
 if(PRECACHE.includes(url.pathname))event.respondWith(caches.match(req).then(hit=>hit||fetch(req)));
});
