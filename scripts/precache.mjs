import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const entries=[];
async function walk(dir) {for(const e of await readdir('dist'+dir,{withFileTypes:true})) {const p=dir+'/'+e.name;if(e.isDirectory())await walk(p);else if(!p.startsWith('/media/')&&p!='/sw.js'&&p!='/manifest.webmanifest')entries.push(p);}}
await walk('');
const digest=createHash('sha256');
for(const p of entries.sort()) digest.update(await readFile('dist'+p));
const sw=(await readFile('public/sw.js','utf8')).replace('__VERSION__',digest.digest('hex').slice(0,14)).replace('/*__PRECACHE__*/[]',JSON.stringify(entries));
await writeFile('dist/sw.js',sw); console.log('Service Worker: '+entries.length+' arquivos estáticos. Mídias são baixadas por escolha da pessoa.');
