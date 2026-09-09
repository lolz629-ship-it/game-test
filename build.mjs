import {mkdir,copyFile,cp,writeFile,readFile,unlink} from 'node:fs/promises';import path from 'node:path';import {spawnSync} from 'node:child_process';
const files=['index.html','app.mjs','engine.mjs','legacy-engine.mjs','garden.mjs','board-view.mjs','music.mjs','style.css','sanctuary.png','desktop.cjs','preload.cjs','package.json','README.md','tests.mjs','build.mjs'];
for(const f of files.filter(f=>/\.(cjs|mjs)$/.test(f))){const p=spawnSync(process.execPath,['--check',f],{stdio:'inherit'});if(p.status)process.exit(p.status);}
const dest=process.env.VERDANT_BUILD_DIR||path.resolve('..','VerdantEngine-v3-Desktop');await mkdir(path.join(dest,'resources','app'),{recursive:true});
const runtime=process.env.ELECTRON_RUNTIME||path.resolve('..','..','work','electron-runtime');await cp(runtime,dest,{recursive:true});
for(const f of files)await copyFile(f,path.join(dest,'resources','app',f));
await copyFile(path.join(dest,'electron.exe'),path.join(dest,'Verdant Engine.exe'));
await unlink(path.join(dest,'electron.exe'));
await writeFile(path.join(dest,'READ ME.txt'),'VERDANT ENGINE 3.0 — THE LITTLE WILD\r\n\r\nOpen Verdant Engine.exe to play. No browser or installation needed.\r\nSaves live in the adjacent VerdantEngine-saves folder. Keep it when updating.\r\nImport your version 1 or 2 backup in Settings if your previous groves are elsewhere.\r\n');
console.log('Desktop built at '+dest);
