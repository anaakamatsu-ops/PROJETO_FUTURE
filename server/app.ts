import express from 'express';
import type { DatabaseSync } from 'node:sqlite';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import nodemailer from 'nodemailer';
import { meditation, welcome, grounding } from '../src/content.ts';
const hash=(value:string)=>createHash('sha256').update(value).digest('hex');
export type Config={origin:string;production:boolean;smtp?:{host:string;port:number;secure:boolean;user:string;pass:string;from:string}};
export function createApp(db:DatabaseSync,config:Config) {
 const app=express(); app.disable('x-powered-by');
 app.use('/api',(_req,res,next)=>{res.set({'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'});next();});
 app.use(express.json({limit:'8kb'}));
 app.use('/api',(req,res,next)=>{
  if(req.method!=='GET'&&req.method!=='HEAD'){
   if(req.get('origin')!==config.origin||req.get('sec-fetch-site')==='cross-site')return res.status(403).json({error:'Origem não autorizada.'});
   if(!req.is('application/json'))return res.status(415).json({error:'Envie JSON.'});
  }next();
 });
 function cleanup(){const now=Date.now();for(const table of ['login_tokens','sessions','attempts'])db.prepare(`DELETE FROM ${table} WHERE expires_at < ?`).run(now);}
 function limited(key:string,max:number){const k=hash(key),now=Date.now();const row=db.prepare('SELECT count,expires_at FROM attempts WHERE key=?').get(k) as {count:number;expires_at:number}|undefined;
  if(row&&row.expires_at>now){if(row.count>=max)return true;db.prepare('UPDATE attempts SET count=count+1 WHERE key=?').run(k);}else db.prepare('INSERT OR REPLACE INTO attempts VALUES(?,1,?)').run(k,now+900000);return false;
 }
 function identity(req:express.Request){const token=req.headers.cookie?.split(';').map(s=>s.trim()).find(s=>s.startsWith('aqui_session='))?.slice(13);if(!token)return;return db.prepare('SELECT u.id,u.name,u.email,u.created_at FROM users u JOIN sessions s ON u.id=s.user_id WHERE s.hash=? AND s.expires_at>?').get(hash(token),Date.now()) as {id:string;name:string;email:string;created_at:number}|undefined;}
 const cookie=(res:express.Response,token:string,maxAge:number)=>res.cookie('aqui_session',token,{httpOnly:true,secure:config.production,sameSite:'strict',path:'/api',maxAge});
 app.get('/api/health',(_req,res)=>res.json({ok:true,mode:config.production?'production':'local-demo'}));
 app.get('/api/content',(_req,res)=>res.json({meditation,welcome,grounding}));
 app.post('/api/auth/request',async(req,res)=>{
  cleanup();const {email,name=''}=req.body||{};
  if(typeof email!=='string'||email.length>254||!/^\S+@[^\s@]+\.[^\s@]+$/.test(email)||typeof name!=='string'||name.length>60||/[\r\n<>]/.test(name))return res.status(400).json({error:'Confira seu e-mail e use até 60 caracteres no nome.'});
  const normalized=email.trim().toLowerCase();
  if(limited('ip:'+req.socket.remoteAddress,20)||limited('email:'+normalized,5))return res.status(429).json({error:'Muitos pedidos. Aguarde 15 minutos para tentar novamente.'});
  if(config.production&&!config.smtp)return res.status(503).json({error:'O envio de acesso ainda não foi configurado. Tente novamente mais tarde.'});
  const token=randomBytes(32).toString('base64url');const digest=hash(token);const link=config.origin+'/#acesso='+token;
  // Invalidar links anteriores, sem expor se a conta já existe.
  db.prepare('DELETE FROM login_tokens WHERE email=?').run(normalized);
  db.prepare('INSERT INTO login_tokens VALUES(?,?,?,?)').run(digest,normalized,name.trim(),Date.now()+900000);
  if(config.production&&config.smtp){try{const s=config.smtp;const transport=nodemailer.createTransport({host:s.host,port:s.port,secure:s.secure,requireTLS:!s.secure,auth:{user:s.user,pass:s.pass}});await transport.sendMail({from:s.from,to:normalized,subject:'Seu acesso ao Aqui e Agora',text:'Use este link para entrar no Aqui e Agora. Ele vale por 15 minutos e pode ser usado uma vez.\n\n'+link+'\n\nSe não solicitou, ignore esta mensagem.'});}catch{db.prepare('DELETE FROM login_tokens WHERE hash=?').run(digest);return res.status(503).json({error:'Não foi possível enviar o link agora. Tente novamente em instantes.'});}}
  return res.json({message:'Link de acesso solicitado.',...(!config.production?{devLink:link,mode:'local-demo'}:{})});
 });
 app.post('/api/auth/verify',(req,res)=>{
  cleanup();if(limited('verify:'+req.socket.remoteAddress,30))return res.status(429).json({error:'Aguarde para tentar novamente.'});
  const token=req.body?.token;if(typeof token!=='string'||! /^[A-Za-z0-9_-]{43}$/.test(token))return res.status(400).json({error:'Link inválido ou expirado. Solicite outro.'});
  const digest=hash(token);db.exec('BEGIN IMMEDIATE');
  try{const row=db.prepare('SELECT * FROM login_tokens WHERE hash=? AND expires_at>?').get(digest,Date.now()) as {email:string;name:string}|undefined;
   if(!row){db.exec('ROLLBACK');return res.status(400).json({error:'Link inválido, já utilizado ou expirado. Solicite outro.'});}
   db.prepare('DELETE FROM login_tokens WHERE hash=?').run(digest);
   let user=db.prepare('SELECT id,name,email FROM users WHERE email=?').get(row.email) as {id:string;name:string;email:string}|undefined;
   if(!user){user={id:randomUUID(),email:row.email,name:row.name};db.prepare('INSERT INTO users VALUES(?,?,?,?)').run(user.id,user.email,user.name,Date.now());}
   const session=randomBytes(32).toString('base64url');db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(hash(session),user.id,Date.now()+7*86400000);db.exec('COMMIT');cookie(res,session,7*86400000);return res.json({user});
  }catch{db.exec('ROLLBACK');return res.status(500).json({error:'Não foi possível entrar agora.'});}
 });
 app.get('/api/me',(req,res)=>{const user=identity(req);return user?res.json({user}):res.status(401).json({error:'Entre para acessar sua conta.'});});
 app.post('/api/logout',(req,res)=>{const token=req.headers.cookie?.split(';').map(s=>s.trim()).find(s=>s.startsWith('aqui_session='))?.slice(13);if(token)db.prepare('DELETE FROM sessions WHERE hash=?').run(hash(token));cookie(res,'',0);res.json({ok:true});});
 app.delete('/api/account',(req,res)=>{const user=identity(req);if(!user)return res.status(401).json({error:'Entre novamente para excluir sua conta.'});db.exec('BEGIN IMMEDIATE');try{db.prepare('DELETE FROM login_tokens WHERE email=?').run(user.email);db.prepare('DELETE FROM users WHERE id=?').run(user.id);db.exec('COMMIT');cookie(res,'',0);return res.json({ok:true});}catch{db.exec('ROLLBACK');return res.status(500).json({error:'Não foi possível excluir. Tente novamente.'});}});
 app.get('/api/export',(req,res)=>{const user=identity(req);if(!user)return res.status(401).json({error:'Entre para exportar seus dados.'});res.set('Content-Disposition','attachment; filename="meus-dados-aqui.json"').json({user,history:'O histórico opcional fica somente neste navegador. Nenhuma avaliação emocional é armazenada.'});});
 app.use((err:unknown,_req:express.Request,res:express.Response,_next:express.NextFunction)=>{res.status((err as {type?:string}).type==='entity.too.large'?413:400).json({error:'Não foi possível processar o pedido.'});});
 return app;
}
