/** Geração editorial offline; credenciais somente em memória. */
import {mkdirSync,readFileSync,writeFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {welcome,meditation,grounding} from '../src/content.ts';
const primary=process.env.GEMINI_TTS_MODEL||'gemini-3.8-flash-lite-tts';
const allowed=['gemini-3.8-flash-lite-tts','gemini-3.8-flash-tts','gemini-3.1-flash-tts-preview','gemini-2.5-flash-preview-tts'];
if(!allowed.includes(primary))throw Error('Modelo TTS não autorizado.');
const voice=process.env.GEMINI_TTS_VOICE||'Sulafat';
import {TTS_STYLE as style} from './tts-config.ts';
const interval=Number(process.env.GEMINI_REQUEST_INTERVAL_MS||22000),requestLimit=Number(process.env.GEMINI_REQUEST_LIMIT||50);
const sample=process.argv.includes('--sample'),manifestPath='work/gemini-manifest'+(sample?'-sample':'')+'.json';
mkdirSync('work/gemini-snippets',{recursive:true});
const previous=existsSync(manifestPath)?JSON.parse(readFileSync(manifestPath,'utf8')):null;
const quotas:Record<string,number>=existsSync('work/gemini-quotas.json')?JSON.parse(readFileSync('work/gemini-quotas.json','utf8')):{};
// Limite diário informado pela API na primeira execução, preservado para não repetir chamadas.
if(!quotas['gemini-3.8-flash-lite-tts']&&process.env.GEMINI_SKIP_LITE_UNTIL)quotas['gemini-3.8-flash-lite-tts']=Number(process.env.GEMINI_SKIP_LITE_UNTIL);
let key=process.env.GEMINI_API_KEY||'';
if(!key){if(process.stdin.isTTY)process.stdin.setRawMode(true);console.log('Aguardando chave Gemini por stdin sem eco (não será salva).');key=await new Promise<string>(resolve=>{let text='';const fn=(chunk:Buffer)=>{if(chunk.includes(3))process.exit(0);text+=chunk.toString();if(/[\r\n]/.test(text)){process.stdin.off('data',fn);process.stdin.pause();resolve(text.trim())}};process.stdin.on('data',fn)})}
if(!key)throw Error('Credencial ausente.');
let requests=0,last=0;const wait=(ms:number)=>new Promise(r=>setTimeout(r,ms));
function wav(bytes:Buffer,mime='audio/wav'){if(bytes.toString('ascii',0,4)==='RIFF')return bytes;if(!/audio\/(l16|pcm)/i.test(mime))throw Error('Formato de áudio inesperado.');const rate=Number(/rate=(\d+)/.exec(mime)?.[1]||24000),h=Buffer.alloc(44);h.write('RIFF');h.writeUInt32LE(36+bytes.length,4);h.write('WAVEfmt ',8);h.writeUInt32LE(16,16);h.writeUInt16LE(1,20);h.writeUInt16LE(1,22);h.writeUInt32LE(rate,24);h.writeUInt32LE(rate*2,28);h.writeUInt16LE(2,32);h.writeUInt16LE(16,34);h.write('data',36);h.writeUInt32LE(bytes.length,40);return Buffer.concat([h,bytes])}
async function request(model:string,text:string){
 if(++requests>requestLimit)throw Error('Limite local de requisições atingido. Cache preservado.');
 await wait(Math.max(0,interval-(Date.now()-last)));last=Date.now();
 const modern=model.startsWith('gemini-3.8-');
 const body=modern?{model,input:[{type:'user_input',content:[{type:'text',text,annotations:[{type:'speech_metadata',style}]}]}],response_format:{type:'audio'},generation_config:{speech_config:[{voice}]},store:false}:{contents:[{parts:[{text:style+'\nLeia somente o texto abaixo, sem anunciar instruções:\n'+text}]}],generationConfig:{responseModalities:['AUDIO'],speechConfig:{voiceConfig:{prebuiltVoiceConfig:{voiceName:voice}}}}};
 const url=modern?'https://generativelanguage.googleapis.com/v1beta/interactions':'https://generativelanguage.googleapis.com/v1beta/models/'+model+':generateContent';
 const response=await fetch(url,{method:'POST',headers:{'x-goog-api-key':key,'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(90000)});const data=await response.json();
 if(!response.ok){const message=String(data.error?.message||data.message||'').replaceAll(key,'[omitido]');const error=new Error('HTTP '+response.status+': '+message.slice(0,450)) as Error&{status:number;daily:boolean;retry:number;shared:boolean};error.status=response.status;error.daily=/per day|perday|daily/i.test(message+JSON.stringify(data.error?.details||[]));error.shared=/across all models|project-wide|per project across/i.test(message);const m=/retry in\s+(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/i.exec(message);error.retry=m?(Number(m[1]||0)*3600+Number(m[2]||0)*60+Number(m[3]||0))*1000:30000;throw error;}
 if(modern){const blocks=data.steps?.filter((s:{type:string})=>s.type==='model_output').flatMap((s:{content?:unknown[]})=>s.content||[])||[];const audio=blocks.filter((b:{type:string;data?:string})=>b.type==='audio'&&b.data).at(-1);if(!audio?.data)throw Error('Resposta sem áudio.');return wav(Buffer.from(audio.data,'base64'))}
 const part=data.candidates?.flatMap((c:{content?:{parts?:{inlineData?:unknown}[]}})=>c.content?.parts||[]).find((p:{inlineData?:unknown})=>p.inlineData)?.inlineData;if(!part?.data)throw Error('Resposta legada sem áudio.');return wav(Buffer.from(part.data,'base64'),part.mimeType);
}
const manifest:{voice:string;provider:string;models:string[];cues:Record<string,{path:string;model:string;hash:string}>}={voice,provider:'Gemini TTS — voz sintética pré-gravada',models:[],cues:{...(previous?.cues||{})}};
const requestedCues=sample?welcome.slice(0,1):[...welcome,...meditation,...grounding];
if(process.env.GEMINI_ONLY_PRIMARY==='1')requestedCues.sort((a,b)=>(previous?.cues[a.id]?1:0)-(previous?.cues[b.id]?1:0));
try{for(const cue of requestedCues){
 const digest=createHash('sha256').update(JSON.stringify({model:primary,voice,style,text:cue.text})).digest('hex');const path='work/gemini-snippets/'+cue.id+'-'+digest.slice(0,16)+'.wav';let used=previous?.cues[cue.id]?.hash===digest?previous.cues[cue.id].model:primary;
 if(!existsSync(path)){
  let output:Buffer|undefined;const route=(process.env.GEMINI_ONLY_PRIMARY==='1'?[primary]:[primary,...allowed.filter(m=>m!==primary)]).filter(m=>(quotas[m]||0)<Date.now());
  for(const model of route){used=model;for(let attempt=0;attempt<2;attempt++){try{output=await request(model,cue.text);break}catch(e){const err=e as Error&{status?:number;daily?:boolean;retry?:number;shared?:boolean};if(err.status===429&&err.shared)throw Error('Cota compartilhada do projeto esgotada. Cache preservado.');if(err.status===429&&err.daily){quotas[model]=Date.now()+Math.max(err.retry||0,3600000);writeFileSync('work/gemini-quotas.json',JSON.stringify(quotas));console.log('Cota diária deste modelo indisponível: '+model+'. Usando somente outras cotas TTS autorizadas.');break;}if(err.status===429){if(attempt===1)throw err;const delay=Math.min(60000,Math.max(22000,err.retry||30000));console.log('Aguardando limite temporário: '+Math.round(delay/1000)+' s.');await wait(delay);continue;}if([404,503].includes(err.status||0)){console.log('Modelo TTS indisponível: '+model);break;}throw err;}}if(output)break;}
  if(!output)throw Error('Nenhum modelo TTS autorizado com cota disponível. Cache preservado.');writeFileSync(path,output);
 }
 manifest.cues[cue.id]={path,model:used,hash:digest};manifest.models=[...new Set([...manifest.models,used])];writeFileSync(manifestPath,JSON.stringify(manifest,null,2));console.log('Áudio pronto: '+cue.id+' ('+Object.keys(manifest.cues).length+'/'+(sample?1:41)+')');
}console.log('Trechos concluídos.');}catch(e){console.error((e as Error).message);process.exitCode=1}finally{key='';process.stdin.destroy()}
