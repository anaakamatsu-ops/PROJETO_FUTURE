import {readdir,readFile,writeFile} from 'node:fs/promises';
import fs from 'node:fs';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const binDir=resolve('../../work/ffmpeg-runtime/imageio_ffmpeg/binaries');
const ffmpeg=process.env.FFMPEG_PATH||resolve(binDir,(await readdir(binDir)).find(x=>/^ffmpeg.*\.exe$/.test(x))||'ffmpeg');
const directory='public/media/gemini-v1';
for(const id of ['welcome','meditation','grounding','trilha']){
 const wav=directory+'/'+id+'.wav',mp3=directory+'/'+id+'.mp3';
 if(!fs.existsSync(wav))continue;
 execFileSync(ffmpeg,['-hide_banner','-loglevel','error','-y','-i',wav,'-c:a','libmp3lame','-b:a','32k','-ar','22050','-ac','1','-map_metadata','-1','-id3v2_version','3',mp3],{windowsHide:true});
 if(id!=='trilha'){const data=JSON.parse(await readFile(directory+'/'+id+'.json','utf8'));data.url='/media/gemini-v1/'+id+'.mp3';await writeFile(directory+'/'+id+'.json',JSON.stringify(data,null,2));}
 console.log('Áudio otimizado: '+id);
}
