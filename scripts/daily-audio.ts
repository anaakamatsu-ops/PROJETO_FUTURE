import {existsSync,readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {execFileSync,spawn} from 'node:child_process';
import {mediaDb,cues,digest,importManifest,status,exportBest} from './media-db.ts';
import {TTS_STYLE} from './tts-config.ts';
const best='gemini-3.8-flash-tts',voice='Sulafat';
const secretPath=resolve('../../work/secrets/gemini.dpapi');
const dry=process.argv.includes('--dry-run');
function secret(){return process.env.GEMINI_API_KEY||execFileSync('C:/Windows/System32/WindowsPowerShell/v1.0/powershell.exe',['-NoProfile','-NonInteractive','-ExecutionPolicy','Bypass','-File','scripts/windows-secret.ps1','-Mode','Read','-SecretPath',secretPath],{windowsHide:true,encoding:'utf8'}).replace(/^\uFEFF/,'').trim();}
if(process.argv.includes('--check-secret')){const value=secret();console.log(JSON.stringify({credentialAvailable:value.length>15}));process.exit(value.length>15?0:1);}
const before=importManifest();
if(dry){console.log(JSON.stringify({mode:'dry-run',database:status(),credentialProtected:existsSync(secretPath),modelPriority:best}));process.exit(0);}
const locked=mediaDb.prepare('SELECT expires_at FROM automation_locks WHERE name=?').get('daily') as {expires_at:number}|undefined;
if(locked&&locked.expires_at>Date.now()){console.log(JSON.stringify({status:'already-running'}));process.exit(0);}
mediaDb.prepare('INSERT OR REPLACE INTO automation_locks VALUES(?,?)').run('daily',Date.now()+3600000);
const runId=mediaDb.prepare('INSERT INTO automation_runs(started_at,status) VALUES(?,?)').run(Date.now(),'running').lastInsertRowid;
async function child(args:string[],env:NodeJS.ProcessEnv=process.env){return new Promise<{code:number;output:string}>(resolve=>{const task=spawn(process.execPath,args,{windowsHide:true,env,stdio:['ignore','pipe','pipe']});let output='';task.stdout.on('data',b=>{output+=b.toString();process.stdout.write(b)});task.stderr.on('data',b=>{output+=b.toString();process.stderr.write(b)});task.on('exit',code=>resolve({code:code||0,output}));task.on('error',()=>resolve({code:1,output:'Falha ao iniciar processo filho.'}))});}
let key='';
try{
 if(before.pending===0){mediaDb.prepare('UPDATE automation_runs SET finished_at=?,status=? WHERE id=?').run(Date.now(),'complete',runId);console.log(JSON.stringify({status:'unchanged',...status()}));}
 else {
  const quotas=existsSync('work/gemini-quotas.json')?JSON.parse(readFileSync('work/gemini-quotas.json','utf8')):{};
  if((quotas[best]||0)>Date.now()){mediaDb.prepare('UPDATE automation_runs SET finished_at=?,status=?,details=? WHERE id=?').run(Date.now(),'waiting_quota','Cota diária do modelo prioritário ainda não liberou.',runId);console.log(JSON.stringify({status:'waiting_quota',nextEligibleAt:new Date(quotas[best]).toISOString(),...status()}));}
  else {
   key=secret();if(!key)throw Error('Credencial protegida indisponível.');
   const manifest=existsSync('work/gemini-manifest.json')?JSON.parse(readFileSync('work/gemini-manifest.json','utf8')):{voice,provider:'Gemini TTS',models:[],cues:{}};
   mkdirSync('work/gemini-snippets',{recursive:true});
   // Reusar os trechos que já foram produzidos pelo modelo prioritário.
   for(const c of cues){const asset=mediaDb.prepare('SELECT * FROM audio_assets WHERE cue_id=? AND text_hash=? AND model=? ORDER BY created_at DESC LIMIT 1').get(c.id,digest(c.text),best) as {audio:Uint8Array}|undefined;if(!asset)continue;const hash=digest(JSON.stringify({model:best,voice,style:TTS_STYLE,text:c.text}));const path='work/gemini-snippets/'+c.id+'-'+hash.slice(0,16)+'.wav';writeFileSync(path,asset.audio);manifest.cues[c.id]={path,model:best,hash,textHash:digest(c.text)};}
   writeFileSync('work/gemini-manifest.json',JSON.stringify(manifest,null,2));
   const generated=await child(['scripts/generate-gemini.ts'],{...process.env,GEMINI_API_KEY:key,GEMINI_TTS_MODEL:best,GEMINI_ONLY_PRIMARY:'1',GEMINI_REQUEST_LIMIT:'15',GEMINI_REQUEST_INTERVAL_MS:'22000'});key='';
   const after=importManifest();const changed=after.assets>before.assets;
   if(changed&&exportBest()){
    for(const args of [['scripts/assemble-media.ts','--gemini'],['scripts/encode-audio.mjs'],['--test','tests/media.test.ts'],['node_modules/typescript/bin/tsc','--noEmit'],['node_modules/vite/bin/vite.js','build'],['scripts/precache.mjs']]){const check=await child(args);if(check.code)throw Error('Verificação não passou: '+args.join(' '));}
   }
   const state=after.pending===0?'complete':generated.code&& !/cota|quota|limite/i.test(generated.output)?'needs_attention':'waiting_quota';
   mediaDb.prepare('UPDATE automation_runs SET finished_at=?,status=?,details=? WHERE id=?').run(Date.now(),state,JSON.stringify({before,after,changed}),runId);
   console.log(JSON.stringify({status:state,changed,...after}));if(state==='needs_attention')process.exitCode=1;
  }
 }
}catch(e){mediaDb.prepare('UPDATE automation_runs SET finished_at=?,status=?,details=? WHERE id=?').run(Date.now(),'failed',(e as Error).message,runId);console.error((e as Error).message);process.exitCode=1;}finally{key='';mediaDb.prepare('DELETE FROM automation_locks WHERE name=?').run('daily');mediaDb.close();}
