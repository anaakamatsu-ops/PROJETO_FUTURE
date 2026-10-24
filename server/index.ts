import express from 'express';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { createApp } from './app.ts';
import { openDatabase } from './db.ts';
const production=process.env.NODE_ENV==='production';
const origin=process.env.APP_ORIGIN||'http://127.0.0.1:5173';
if(production&&(!origin.startsWith('https://')||!process.env.SMTP_HOST||!process.env.SMTP_USER||!process.env.SMTP_PASS||!process.env.MAIL_FROM))throw new Error('Produção exige APP_ORIGIN HTTPS e configuração SMTP completa.');
const smtp=process.env.SMTP_HOST?{host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),secure:process.env.SMTP_SECURE==='true',user:process.env.SMTP_USER||'',pass:process.env.SMTP_PASS||'',from:process.env.MAIL_FROM||''}:undefined;
const app=createApp(openDatabase(process.env.DB_PATH||'.data/aqui.sqlite'),{origin,production,smtp});
app.use((_req,res,next)=>{res.set({'X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Permissions-Policy':'camera=(), microphone=(), geolocation=()','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; media-src 'self' blob:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'"});if(production)res.set('Strict-Transport-Security','max-age=31536000');next();});
if(existsSync('dist')){app.use(express.static('dist',{setHeaders(res,path){if(path.endsWith('sw.js')||path.endsWith('index.html'))res.setHeader('Cache-Control','no-cache');}}));app.get('/{*path}',(_req,res)=>res.sendFile(resolve('dist/index.html')));}
const port=Number(process.env.PORT||3001);const host=process.env.HOST||'127.0.0.1';
if(!production&&!['127.0.0.1','localhost','::1'].includes(host))throw new Error('A demonstração com links locais só pode escutar em loopback.');
app.listen(port,host,()=>console.log(`Aqui e Agora: http://${host}:${port} (${production?'produção':'demonstração local; e-mails não são enviados'})`));
