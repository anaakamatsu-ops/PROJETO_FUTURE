import { mkdirSync,readFileSync,writeFileSync } from 'node:fs';
import { meditation,welcome,grounding } from '../src/content.ts';
import type { Cue } from '../src/content.ts';
const gemini=process.argv.includes('--gemini');
const manifest=gemini?JSON.parse(readFileSync('work/gemini-manifest.json','utf8')):null;
const narrator=gemini?'Gemini TTS / '+manifest.voice+' — voz sintética pt-BR gravada':'Microsoft Maria Desktop — voz sintética pt-BR gravada';
const RATE=22050;
const mediaDir=gemini?'public/media/gemini-v1':'public/media';
const mediaUrl=gemini?'/media/gemini-v1':'/media';
mkdirSync(mediaDir,{recursive:true});mkdirSync('docs',{recursive:true});
function wave(pcm:Buffer){const h=Buffer.alloc(44);h.write('RIFF');h.writeUInt32LE(36+pcm.length,4);h.write('WAVEfmt ',8);h.writeUInt32LE(16,16);h.writeUInt16LE(1,20);h.writeUInt16LE(1,22);h.writeUInt32LE(RATE,24);h.writeUInt32LE(RATE*2,28);h.writeUInt16LE(2,32);h.writeUInt16LE(16,34);h.write('data',36);h.writeUInt32LE(pcm.length,40);return Buffer.concat([h,pcm]);}
function pcm(path:string){const b=readFileSync(path);let rate=0,channels=0,bits=0,format=0;for(let p=12;p<b.length;){const id=b.toString('ascii',p,p+4),len=b.readUInt32LE(p+4);if(id==='fmt '){format=b.readUInt16LE(p+8);channels=b.readUInt16LE(p+10);rate=b.readUInt32LE(p+12);bits=b.readUInt16LE(p+22);}if(id==='data'){if(format!==1||bits!==16||channels!==1)throw Error('WAV precisa ser PCM16 mono: '+path);const input=b.subarray(p+8,p+8+len);if(rate===RATE)return Buffer.from(input);const count=Math.floor(input.length/2*RATE/rate),out=Buffer.alloc(count*2);for(let i=0;i<count;i++){const pos=i*rate/RATE,left=Math.min(Math.floor(pos),input.length/2-1),right=Math.min(left+1,input.length/2-1),fraction=pos-left;out.writeInt16LE(Math.round(input.readInt16LE(left*2)*(1-fraction)+input.readInt16LE(right*2)*fraction),i*2)}return out;}p+=8+len+(len%2)}throw Error('WAV sem dados: '+path);}
const stamp=(s:number)=>{const ms=Math.round(s*1000);return String(Math.floor(ms/3600000)).padStart(2,'0')+':'+String(Math.floor(ms/60000)%60).padStart(2,'0')+':'+String(Math.floor(ms/1000)%60).padStart(2,'0')+'.'+String(ms%1000).padStart(3,'0')};
let timeline='# Roteiro e linha do tempo real\n\n'+narrator+'. Tempos medidos nos WAVs, não estimativas. A pausa interrompe voz, música e relógio. A reprodução conduz toda a contagem automaticamente até dez e encerra convidando a abrir os olhos lentamente.\n\n';
for(const [id,source] of Object.entries({welcome,meditation,grounding})){
 const complete=gemini&&source.every(c=>manifest.cues[c.id]);
 if(gemini&&!complete&&!process.argv.includes('--partial'))throw Error('Geração Gemini incompleta: '+id);
 const clips=source.map(c=>pcm(complete?manifest.cues[c.id].path:'work/audio-snippets/'+c.id+'.wav'));
 const groupNarrator=complete?narrator:'Microsoft Maria Desktop — voz provisória sintética pt-BR';
 const spoken=clips.reduce((sum,b)=>sum+b.length/(RATE*2),0);const pauses=source.reduce((sum,c)=>sum+c.pause,0);
 // Ajuste dos silêncios de preparação para manter a meditação próxima de 10 minutos.
 const extra=id==='meditation'?Math.max(0,660-spoken-pauses):0;
 const pauseScale=id==='meditation'&&spoken+pauses>660?Math.max(.3,(660-spoken-10)/(pauses-10)):1;
 const slots=source.filter(c=>!c.count).length;
 let t=0;const buffers:Buffer[]=[],cues:Cue[]=[];let vtt='WEBVTT\n\n';
 timeline+='## '+id+'\n\n';
 for(let i=0;i<source.length;i++){
  const c=source[i],b=clips[i];const start=t,voiceEnd=t+b.length/(RATE*2);let gap=(c.id==='m07'?10:c.pause*pauseScale)+(id==='meditation'&&!c.count?extra/slots:0);
  // Fades curtos nas bordas dos trechos evitam cliques.
  const samples=b.length/2;for(let j=0;j<Math.min(220,samples);j++){b.writeInt16LE(Math.round(b.readInt16LE(j*2)*j/220),j*2);const p=(samples-j-1)*2;b.writeInt16LE(Math.round(b.readInt16LE(p)*j/220),p);}
  const silence=Buffer.alloc(Math.round(gap*RATE)*2);buffers.push(b,silence);t=voiceEnd+silence.length/(RATE*2);
  const result={...c,pause:Number(gap.toFixed(3)),start,voiceEnd,end:t};cues.push(result);
  vtt+=c.id+'\n'+stamp(start)+' --> '+stamp(voiceEnd)+'\n'+c.text+'\n\n';
  timeline+='### '+stamp(start)+' → '+stamp(t)+' — '+c.stage+(c.count?' ('+c.count+'/10)':'')+'\n\n'+c.text+'\n\nPausa: '+gap.toFixed(1)+' s. Visual: '+(c.count?'círculo com '+c.count:'jardim vetorial / círculo de presença')+'. Trilha: volume inicial 16%, ajustável e desligável.\n\n';
 }
 writeFileSync(mediaDir+'/'+id+'.wav',wave(Buffer.concat(buffers)));
 writeFileSync(mediaDir+'/'+id+'.json',JSON.stringify({duration:t,cues,url:mediaUrl+'/'+id+'.wav',voice:groupNarrator,provider:complete?'gemini':'windows',models:complete?manifest.models:[]},null,2));
 writeFileSync(mediaDir+'/'+id+'.vtt',vtt);console.log(id,t.toFixed(2)+'s',Math.round(Buffer.concat(buffers).length/1024/1024)+'MB');
}
// Composição original: pad senoidal de 32 s, afinação de referência Lá=432 Hz.
// Osciladores com número inteiro de ciclos por loop permitem emenda contínua sem batidas.
const seconds=32,samples=seconds*RATE,pad=Buffer.alloc(samples*2);
const frequencies=[108,162,216,288,324,432];
for(let i=0;i<samples;i++){const t=i/RATE;let value=0;for(let j=0;j<frequencies.length;j++)value+=Math.sin(2*Math.PI*frequencies[j]*t)*(.022/(1+j*.45))*(.85+.15*Math.cos(2*Math.PI*t/seconds));pad.writeInt16LE(Math.round(Math.max(-1,Math.min(1,value))*32767),i*2);}
writeFileSync(mediaDir+'/trilha.wav',wave(pad));writeFileSync('docs/05-roteiro-e-timeline.md',timeline);
