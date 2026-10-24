export const MEDIA_BASE='/media/gemini-v1';
export type User={id:string;name:string;email:string};
export async function api<T>(path:string,body?:unknown,method=body?'POST':'GET'):Promise<T>{
 const r=await fetch('/api'+path,{method,credentials:'same-origin',headers:body?{'Content-Type':'application/json'}:undefined,body:body?JSON.stringify(body):undefined,cache:'no-store'});
 const data=await r.json().catch(()=>({error:'O serviço não está disponível agora.'}));if(!r.ok)throw new Error(data.error||'Não foi possível continuar.');return data;
}
export type MediaData={duration:number;cues:import('./content').Cue[];url:string;voice:string;provider?:string;models?:string[]};
export async function mediaData(id:string):Promise<MediaData>{const r=await fetch(MEDIA_BASE+'/'+id+'.json');if(!r.ok)throw new Error('A narração ainda não está disponível. Você pode acompanhar o roteiro em texto.');return r.json();}
export async function saveOffline(id:string){
 if(!('serviceWorker' in navigator)||!('caches' in window))throw new Error('Este navegador não permite salvar a prática offline.');
 const data=await mediaData(id);const cache=await caches.open('aqui-media-v1');
 const urls=[MEDIA_BASE+'/'+id+'.json',data.url,MEDIA_BASE+'/trilha.mp3'];
 // Só anunciar sucesso depois de todos os arquivos integrais estarem disponíveis.
 for(const url of urls){const r=await fetch(url,{cache:'reload'});if(!r.ok)throw new Error('O download foi interrompido. Tente de novo com conexão.');await cache.put(url,r);}
 return data;
}
