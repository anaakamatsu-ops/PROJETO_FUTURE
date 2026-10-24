import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
if(process.stdin.isTTY)process.stdin.setRawMode(true);
console.log('Aguardando credencial sem eco para proteger com Windows DPAPI.');
let secret=await new Promise(resolve=>{let s='';const fn=b=>{if(b.includes(3))process.exit(0);s+=b.toString();if(/[\r\n]/.test(s)){process.stdin.off('data',fn);process.stdin.pause();resolve(s.trim())}};process.stdin.on('data',fn)});
const child=spawn('C:/Windows/System32/WindowsPowerShell/v1.0/powershell.exe',['-NoProfile','-NonInteractive','-ExecutionPolicy','Bypass','-File','scripts/windows-secret.ps1','-Mode','Store','-SecretPath',resolve('../../work/secrets/gemini.dpapi')],{windowsHide:true,stdio:['pipe','pipe','pipe']});
let error='';child.stderr.on('data',b=>error+=b.toString());child.stdin.end(secret+'\n');secret='';
await new Promise(resolve=>child.on('exit',code=>{if(code){console.error('Não foi possível proteger a credencial.');process.exitCode=1;}else console.log('Credencial protegida pelo usuário Windows. Nenhuma chave em texto foi salva.');resolve()}));process.stdin.destroy();
