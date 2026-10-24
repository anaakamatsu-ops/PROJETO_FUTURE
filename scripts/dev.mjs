import { spawn } from 'node:child_process';
const children = [spawn(process.execPath, ['server/index.ts'], {stdio:'inherit'}), spawn(process.execPath, ['node_modules/vite/bin/vite.js'], {stdio:'inherit'})];
function stop() { children.forEach(p=>p.kill()); }
process.on('SIGINT',stop); process.on('SIGTERM',stop);
children.forEach(p=>p.on('exit',code=>{stop();process.exitCode=code||0;}));
