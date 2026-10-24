import { meditation,welcome,grounding } from '../src/content.ts';
import { mkdirSync,writeFileSync } from 'node:fs';
mkdirSync('work/audio-snippets',{recursive:true});
writeFileSync('work/voice-cues.json',JSON.stringify([...welcome,...meditation,...grounding]));
for(const [id,cues] of Object.entries({welcome,meditation,grounding}))console.log(id,cues.map(c=>c.text.split(/\s+/).length).reduce((a,b)=>a+b,0),'palavras',cues.reduce((s,c)=>s+c.pause,0),'s de pausas');
