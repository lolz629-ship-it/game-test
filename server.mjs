import http from 'node:http';
import {readFile,writeFile,mkdir,rename,copyFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {validate} from './engine.mjs';
const root=path.dirname(fileURLToPath(import.meta.url)),port=Number(process.env.PORT||47831),origin=`http://127.0.0.1:${port}`;
const savedir=process.env.VERDANT_SAVE_DIR||path.resolve(root,'..','VerdantEngine-saves');
const savepath=path.join(savedir,'groves.json');
const assets=new Map([['/','index.html'],...['index.html','app.mjs','engine.mjs','style.css','sanctuary.png'].map(x=>['/'+x,x])]);
const mime={'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png'};
let queue=Promise.resolve();
const server=http.createServer(async(req,res)=>{res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Cache-Control','no-store');if(req.headers.host!==`127.0.0.1:${port}`&&req.headers.host!==`localhost:${port}`){res.writeHead(403).end();return;}
try{const url=new URL(req.url,origin);if(url.pathname==='/api/quit'&&req.method==='POST'&&req.headers.origin===origin){await queue.catch(()=>{});res.end('Stopped');server.close();return;}if(url.pathname==='/api/saves'){
if(req.method==='GET'){for(const file of [savepath,savepath+'.bak']){try{const data=await readFile(file);const parsed=JSON.parse(data);if(parsed.schema!==1||parsed.slots?.length!==3)throw Error();parsed.slots.forEach(s=>{if(s)validate(s)});res.setHeader('Content-Type','application/json');res.end(data);return;}catch{}}res.writeHead(404).end('{}');return;}
if(req.method!=='POST'||(req.headers.origin!==origin&&req.headers.origin!==`http://localhost:${port}`)){res.writeHead(403).end();return;}
let body='';for await(const chunk of req){body+=chunk;if(body.length>2e6){res.writeHead(413).end();return;}}const b=JSON.parse(body);if(b.schema!==1||!Array.isArray(b.slots)||b.slots.length!==3||!Number.isFinite(b.savedAt))throw Error('Invalid archive');b.slots.forEach(s=>{if(s)validate(s)});
const operation=queue.catch(()=>{}).then(async()=>{await mkdir(savedir,{recursive:true});try{await copyFile(savepath,savepath+'.bak');}catch{}await writeFile(savepath+'.tmp',JSON.stringify(b,null,2));await rename(savepath+'.tmp',savepath);});queue=operation;await operation;res.setHeader('Content-Type','application/json');res.end('{"saved":true}');return;}
if(req.method!=='GET'){res.writeHead(405).end();return;}const file=assets.get(url.pathname);if(!file){res.writeHead(404).end('Not found');return;}res.setHeader('Content-Type',mime[path.extname(file)]);res.end(await readFile(path.join(root,file)));}catch{res.writeHead(400).end('{"error":"Request could not be saved or read"}');}});
server.listen(port,'127.0.0.1',()=>console.log(`Verdant Engine is ready: ${origin}`));server.on('error',err=>{console.error(err.code==='EADDRINUSE'?`The game may already be running. Open ${origin}`:err.message);process.exitCode=1;});
