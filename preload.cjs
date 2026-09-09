const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('desktop',{load:()=>ipcRenderer.invoke('save:load'),save:b=>ipcRenderer.invoke('save:write',b),export:b=>ipcRenderer.invoke('save:export',b),import:()=>ipcRenderer.invoke('save:import'),fullscreen:()=>ipcRenderer.invoke('window:fullscreen'),onClosing:fn=>ipcRenderer.on('save:closing',()=>fn())});
