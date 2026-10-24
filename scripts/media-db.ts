import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, readFileSync, existsSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import {welcome,meditation,grounding} from '../src/content.ts';
const path=resolve(process.env.MEDIA_DB_PATH||'../banco-audios.sqlite');mkdirSync(dirname(path),{recursive:true});
export const mediaDb=new DatabaseSync(path);
mediaDb.exec(`PRAGMA journal_mode=WAL;
CREATE TABLE IF NOT EXISTS audio_assets(id TEXT PRIMARY KEY,cue_id TEXT NOT NULL,text_hash TEXT NOT NULL,text TEXT NOT NULL,provider TEXT NOT NULL,model TEXT NOT NULL,voice TEXT NOT NULL,mime TEXT NOT NULL,duration_seconds REAL NOT NULL,bytes INTEGER NOT NULL,audio BLOB NOT NULL,created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS current_audio(cue_id TEXT PRIMARY KEY,text_hash TEXT NOT NULL,asset_id TEXT NOT NULL REFERENCES audio_assets(id));
CREATE TABLE IF NOT EXISTS audio_jobs(cue_id TEXT PRIMARY KEY,desired_model TEXT NOT NULL,status TEXT NOT NULL,updated_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS automation_runs(id INTEGER PRIMARY KEY,started_at INTEGER NOT NULL,finished_at INTEGER,status TEXT NOT NULL,details TEXT);
CREATE TABLE IF NOT EXISTS automation_locks(name TEXT PRIMARY KEY,expires_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS idx_audio_text ON audio_assets(cue_id,text_hash,model);`);
export const cues=[...welcome,...meditation,...grounding];
export const digest=(s:string|Buffer)=>createHash('sha256').update(s).digest('hex');
export const quality=(model:string)=>model==='gemini-3.8-flash-tts'?4:model==='gemini-3.8-flash-lite-tts'?3:model==='gemini-3.1-flash-tts-preview'?2:1;
export function importManifest(){
 if(!existsSync('work/gemini-manifest.json'))return {assets:0,pending:cues.length};
 const manifest=JSON.parse(readFileSync('work/gemini-manifest.json','utf8'));
 mediaDb.exec('BEGIN IMMEDIATE');try{
 for(const cue of cues){const item=manifest.cues[cue.id];if(!item||!existsSync(item.path))continue;
  const audio=readFileSync(item.path),id=digest(audio),textHash=digest(cue.text);let bytes=0,rate=24000;
  for(let p=12;p+8<audio.length;){const chunk=audio.toString('ascii',p,p+4),len=audio.readUInt32LE(p+4);if(chunk==='fmt ')rate=audio.readUInt32LE(p+12);if(chunk==='data'){bytes=len;break;}p+=8+len+len%2;}
  mediaDb.prepare('INSERT OR IGNORE INTO audio_assets VALUES(?,?,?,?,?,?,?,?,?,?,?,?)').run(id,cue.id,textHash,cue.text,'Gemini TTS',item.model,manifest.voice,'audio/wav',bytes/(rate*2),audio.length,audio,Date.now());
  const old=mediaDb.prepare('SELECT a.model FROM current_audio c JOIN audio_assets a ON a.id=c.asset_id WHERE c.cue_id=? AND c.text_hash=?').get(cue.id,textHash) as {model:string}|undefined;
  if(!old||quality(item.model)>=quality(old.model))mediaDb.prepare('INSERT OR REPLACE INTO current_audio VALUES(?,?,?)').run(cue.id,textHash,id);
 }
 for(const cue of cues){const row=mediaDb.prepare('SELECT a.model FROM current_audio c JOIN audio_assets a ON a.id=c.asset_id WHERE c.cue_id=? AND c.text_hash=?').get(cue.id,digest(cue.text)) as {model:string}|undefined;mediaDb.prepare('INSERT OR REPLACE INTO audio_jobs VALUES(?,?,?,?)').run(cue.id,'gemini-3.8-flash-tts',!row?'pending':row.model==='gemini-3.8-flash-tts'?'complete':'upgrade_pending',Date.now());}
 mediaDb.exec('COMMIT');}catch(e){mediaDb.exec('ROLLBACK');throw e;}
 return status();
}
export function status(){return {ready:Number((mediaDb.prepare('SELECT count(*) n FROM current_audio').get() as {n:number}).n),total:cues.length,assets:Number((mediaDb.prepare('SELECT count(*) n FROM audio_assets').get() as {n:number}).n),complete:Number((mediaDb.prepare("SELECT count(*) n FROM audio_jobs WHERE status='complete'").get() as {n:number}).n),pending:Number((mediaDb.prepare("SELECT count(*) n FROM audio_jobs WHERE status!='complete'").get() as {n:number}).n)}};
export function exportBest(){
 if(cues.some(c=>!mediaDb.prepare('SELECT 1 FROM current_audio WHERE cue_id=? AND text_hash=?').get(c.id,digest(c.text))))return false;
 const manifest:{voice:string;provider:string;models:string[];cues:Record<string,unknown>}={voice:'Sulafat',provider:'Gemini TTS',models:[],cues:{}};
 mkdirSync('work/db-audio',{recursive:true});
 for(const c of cues){const row=mediaDb.prepare('SELECT a.* FROM current_audio c JOIN audio_assets a ON a.id=c.asset_id WHERE c.cue_id=? AND c.text_hash=?').get(c.id,digest(c.text)) as {id:string;model:string;voice:string;audio:Uint8Array};const p='work/db-audio/'+c.id+'-'+row.id.slice(0,16)+'.wav';writeFileSync(p,row.audio);manifest.cues[c.id]={path:p,model:row.model,hash:row.id,textHash:digest(c.text)};manifest.models.push(row.model);manifest.voice=row.voice;}
 manifest.models=[...new Set(manifest.models)];writeFileSync('work/gemini-manifest.json',JSON.stringify(manifest,null,2));return true;
}
if(process.argv.includes('--sync'))console.log(JSON.stringify(importManifest()));
