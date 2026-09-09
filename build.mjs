import {readFile,mkdir,copyFile,writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {VERSION} from './engine.mjs';
const files=['index.html','style.css','app.mjs','engine.mjs','server.mjs','sanctuary.png','Play.cmd','Stop.cmd','launch.ps1','README.md','package.json','build.mjs','tests.mjs','server-tests.mjs'];
for(const f of ['app.mjs','engine.mjs','server.mjs']){const p=spawnSync(process.execPath,['--check',f],{stdio:'inherit'});if(p.status)process.exit(p.status);}
await mkdir('dist/VerdantEngine',{recursive:true});
for(const f of files)await copyFile(f,'dist/VerdantEngine/'+f);
await writeFile('dist/release.json',JSON.stringify({version:VERSION,files},null,2));
console.log(`Built Verdant Engine ${VERSION}: ${files.length} game files. No external dependencies.`);
