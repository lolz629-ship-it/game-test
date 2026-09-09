const {app,BrowserWindow,ipcMain,shell,dialog}=require('electron');
const fs=require('node:fs/promises'),path=require('node:path');

const base=process.env.VERDANT_DATA_DIR||path.resolve(path.dirname(process.execPath),'..','VerdantEngine-saves');
app.setPath('userData',path.join(base,'desktop-profile'));
if(!app.requestSingleInstanceLock()){app.quit();}else{
let win,queue=Promise.resolve(),engine,closing=false;
const archive=path.join(base,'groves-v3.json');
const check=b=>{if(!b||![1,2,3].includes(b.schema)||!Array.isArray(b.slots)||b.slots.length!==3)throw Error('Invalid save archive');b.slots.forEach(s=>{if(s)engine.validate(s)});b.schema=3;return b;};
const write=b=>{check(b);queue=queue.catch(()=>{}).then(async()=>{await fs.mkdir(base,{recursive:true});try{await fs.copyFile(archive,archive+'.bak')}catch{}await fs.writeFile(archive+'.tmp',JSON.stringify(b));await fs.rename(archive+'.tmp',archive);});return queue;};
app.whenReady().then(async()=>{engine=await import('./engine.mjs');
ipcMain.handle('save:load',async()=>{for(const name of [archive,archive+'.bak',path.join(base,'groves-v2.json'),path.join(base,'groves-v2.json.bak'),path.join(base,'groves.json')])try{return check(JSON.parse(await fs.readFile(name,'utf8')))}catch{}return null;});
ipcMain.handle('save:write',async(e,b)=>{if(e.sender!==win.webContents)throw Error('Invalid sender');await write(b);return true;});
ipcMain.handle('save:export',async(e,b)=>{check(b);const dest=await dialog.showSaveDialog(win,{defaultPath:'VerdantEngine-groves.json',filters:[{name:'Save backup',extensions:['json']}]});if(!dest.canceled){await fs.writeFile(dest.filePath,JSON.stringify(b,null,2));return true;}return false;});
ipcMain.handle('save:import',async()=>{const result=await dialog.showOpenDialog(win,{properties:['openFile'],filters:[{name:'Grove backup',extensions:['json']}]});if(result.canceled)return null;const file=result.filePaths[0];if((await fs.stat(file)).size>2e6)throw Error('Backup is too large');return check(JSON.parse(await fs.readFile(file,'utf8')));});
ipcMain.handle('window:fullscreen',()=>{win.setFullScreen(!win.isFullScreen());return win.isFullScreen();});
win=new BrowserWindow({title:'Verdant Engine — The Living Board',width:1500,height:960,minWidth:1050,minHeight:720,backgroundColor:'#081514',autoHideMenuBar:true,show:false,webPreferences:{preload:path.join(__dirname,'preload.cjs'),contextIsolation:true,nodeIntegration:false,sandbox:true,backgroundThrottling:!process.env.VERDANT_SMOKE,offscreen:!!process.env.VERDANT_SMOKE}});
win.webContents.setWindowOpenHandler(({url})=>{if(/^https:\/\/github\.com\/lolz629-ship-it\/game-test\/releases\//.test(url))shell.openExternal(url);return {action:'deny'};});
win.webContents.on('will-navigate',(e,url)=>{if(!url.startsWith('file:'))e.preventDefault();});
win.webContents.session.setPermissionRequestHandler((wc,p,cb)=>cb(false));
win.once('ready-to-show',()=>{if(!process.env.VERDANT_SMOKE)win.show();});
win.on('close',e=>{if(closing)return;e.preventDefault();win.webContents.send('save:closing');setTimeout(async()=>{await queue.catch(()=>{});closing=true;win.close();},800);});
await win.loadFile(path.join(__dirname,'index.html'));
if(process.env.VERDANT_SMOKE){win.webContents.on('console-message',(_e,_level,message)=>console.log(message));setTimeout(async()=>{try{const result=await win.webContents.executeJavaScript(`(async()=>{const result={title:document.title,menu:document.querySelectorAll('.slot').length,bridge:!!window.desktop};document.querySelector('[data-action="slot"]').click();document.querySelector('[data-action="create"][data-id="warden"]')?.click();await new Promise(r=>setTimeout(r,700));result.board=!!document.querySelector('canvas');result.upgrades=document.querySelectorAll('.upgrade').length;document.querySelector('[data-action="buy"][data-id="drone"]').click();document.querySelector('[data-action="pulse"]').click();document.querySelector('[data-action="save"]').click();await new Promise(r=>setTimeout(r,400));result.saved=!!(await window.desktop.load())?.slots[0];document.querySelector('[data-action="settings"]').click();result.music=!!document.querySelector('#music');document.querySelector('[data-action="close"]').click();await new Promise(r=>setTimeout(r,800));result.fpsOptions=[...document.querySelectorAll('#fps option')].map(o=>o.value);result.errors=window.__errors||[];result.canvasSize=[document.querySelector('canvas').width,document.querySelector('canvas').height];document.querySelector('[data-action="tree"]').click();result.keepsakes=document.querySelectorAll('.keepsake').length;result.keepsakeDescriptions=[...document.querySelectorAll('.keepsake p')].every(p=>p.textContent.length>30);document.querySelector('[data-action="begin"]').click();await new Promise(r=>setTimeout(r,200));return result;})()`);await fs.writeFile(process.env.VERDANT_SMOKE,JSON.stringify(result));const screenshot=await win.webContents.capturePage();await fs.writeFile(process.env.VERDANT_SMOKE+'.png',screenshot.toPNG());}catch(e){await fs.writeFile(process.env.VERDANT_SMOKE,JSON.stringify({error:e.message}));}finally{closing=true;app.quit();}},2000);}
}).catch(async error=>{if(process.env.VERDANT_SMOKE)await fs.writeFile(process.env.VERDANT_SMOKE,JSON.stringify({error:error.message}));else dialog.showErrorBox('Verdant Engine could not start',error.message);app.quit();});
app.on('second-instance',()=>{if(win){if(win.isMinimized())win.restore();win.focus();}});
app.on('window-all-closed',()=>app.quit());
}

