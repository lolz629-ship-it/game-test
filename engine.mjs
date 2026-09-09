import * as Legacy from './legacy-engine.mjs';
export const VERSION='3.0.0';
export const styles={keeper:{name:'The Keeper',tag:'ACTIVE',click:.55,idle:.1,desc:'Shape the wild with your own hands. Powerful rhythmic harvesting.'},weaver:{name:'The Weaver',tag:'AUTOMATED',click:.2,idle:3.8,desc:'Wake the machines. Your growing grove works even while you rest.'},warden:{name:'The Warden',tag:'HYBRID',click:.60,idle:1.8,desc:'Work alongside the forest. A steady balance of touch and machinery.'}};
export const zones=['The Glassworks','Mossbound Foundry','The Root Canal','Ember Conservatory','Heart of the Engine'];
export const gear=[{id:'touch',name:'Thornbound gloves',desc:'Strengthen every harvest',base:24},{id:'drone',name:'Seedling drones',desc:'Grow your passive production',base:24},{id:'coil',name:'Mycelium coil',desc:'Amplify both sources',base:90},{id:'lens',name:'Resonance lens',desc:'Increase restoration efficiency',base:120}];
gear.push({id:'moth',name:'Prism moths',desc:'Roaming moths · click for a five-node cascade',base:35},{id:'beetle',name:'Excavator beetles',desc:'Armored diggers · crack buried relic caches',base:45},{id:'wisp',name:'Arc wisps',desc:'Roaming lightning · unlock chain harvests',base:65},{id:'rainmaker',name:'Rainmakers',desc:'Travelling rain spirits · click to ripen flowers',base:75},{id:'comet',name:'Copper comets',desc:'Living projectiles · click for an explosive harvest',base:95},{id:'echo',name:'Echo roots',desc:'Broken nodes echo damage into a neighbor',base:80},{id:'magnet',name:'Gravity seeds',desc:'Harvesting pulls nearby nodes into dense clusters',base:55},{id:'bloom',name:'Bloom nurseries',desc:'Grow three extra harvest nodes per rank',base:50},{id:'tempo',name:'Chrono petals',desc:'Reduce both ability cooldowns by 10% per rank',base:110},{id:'fortune',name:'Golden pollen',desc:'More critical blooms and richer node rewards',base:60},{id:'pick',name:'Obsidian pick',desc:'More excavation damage to caches and guardians',base:40},{id:'harmony',name:'Wild covenant',desc:'All production +6% per rank',base:100});
export const branches=[{id:'hand',name:'Playful tools',color:'#ffc47f',desc:'New ways to aim, bounce and conduct.'},{id:'machine',name:'Forest friends',color:'#a6d8ff',desc:'Give your crew a new occupation.'},{id:'harmony',name:'Strange gardens',color:'#ace6aa',desc:'Change the rules of the living board.'},{id:'memory',name:'Wild weather',color:'#d9baff',desc:'Bring a little beautiful chaos.'}];
export const nodes=[
['ricochet','hand','Skipping stones','Every third rhythmic harvest bounces through three distant targets. Keep a rhythm to throw it.'],
['drum','hand','Pocket orchestra','At ten resonance, harvesting conducts a crew parade: every friend dances and overcharges. Once every 12 seconds.'],
['portal','hand','Wormhole watering can','Harvest a node to open a portal. Your next harvest teleports the crew to it. Portals alternate every 6 seconds.'],
['lantern','hand','Lantern fishing','A wandering lantern appears every 12 seconds. Catch it with a harvest to reveal a buried chest.'],
['picnic','machine','Picnic club','Friends periodically gather for a picnic, then head back to work overcharged. Works without clicking.'],
['gardener','machine','Junior gardeners','Every fifth crew harvest plants a flower. Flower patches invite more hand-and-crew combinations.'],
['courier','machine','Chest post','Beetles and drones seek out buried chests before ordinary salvage. Let the crew find your memories.'],
['duet','machine','Best friends','Clicking a friend also wakes its nearest buddy and gives them a shared lightning harvest.'],
['fungi','harmony','Mushroom trampoline','Every eighth broken node leaves a trampoline. Click it to launch the crew and scatter a harvest.'],
['domino','harmony','Domino orchard','Flowers burst into nearby flowers. Rain spirits and Bloom storm can set up a chain reaction.'],
['tide','harmony','Tidal garden','A gentle tide gathers salvage into spirals every 15 seconds. Sweeping and area abilities become a new puzzle.'],
['hatchery','harmony','Egg sanctuary','A mystery egg appears each district. Hatch it with three harvests to call a tiny temporary helper.'],
['firefly','memory','Firefly festival','Every 14 seconds a firefly trail crosses the board. Harvest its glowing targets to spark adjacent salvage.'],
['snow','memory','Snowglobe','Root pulse suspends the board in a snowglobe for 3 seconds. Suspended salvage takes an extra hit when released.'],
['meteor','memory','Wish upon rust','Every 20 seconds a friendly meteor rolls across the board, cracking everything on its path.'],
['encore','memory','One more song','Bloom storm calls an encore from every friend: each harvests its nearest target. It is a show worth waiting for.']
].map(([id,branch,name,desc],i)=>({id,branch,name,desc,tier:0,max:1,cost:8+Math.floor(i/4)*4}));
export function equipped(s,id){return (s.run?.loadout||s.loadout||[]).includes(id);}
export function equip(s,id){if(s.run||!s.tree[id])return false;s.loadout??=[];if(s.loadout.includes(id)){s.loadout=s.loadout.filter(x=>x!==id);return true;}if(s.loadout.length>=3)return false;s.loadout.push(id);return true;}
export function claim(s,id){if(s.run||!s.offers?.includes(id))return false;s.tree[id]=1;s.offers=[];if(s.loadout.length<3)s.loadout.push(id);return true;}
export const relics=[{id:'sap',name:'Amber heart',desc:'+30% harvest power',click:1.3,idle:1},{id:'moth',name:'Clockwork moth',desc:'+30% passive production',click:1,idle:1.3},{id:'rain',name:'Bottled rain',desc:'+16% to all production',click:1.16,idle:1.16},{id:'thorn',name:'Thorn covenant',desc:'+55% harvest; −15% passive',click:1.55,idle:.85},{id:'hive',name:'Wild hive',desc:'+55% passive; −15% harvest',click:.85,idle:1.55},{id:'echo',name:'Memory prism',desc:'+25% seeds this expedition',click:1,idle:1,seeds:1.25}];
export function fresh(name='New grove',style='warden'){return {schema:3,name,style,seeds:0,runs:0,tree:{},loadout:[],offers:[],history:[],totalClicks:0,run:null,updated:Date.now()};}
export function start(s){s.run={loadout:[...(s.loadout||[])],energy:35,earned:0,elapsed:0,stage:0,upgrades:{touch:0,drone:0,coil:0,lens:0},relics:[],draft:null,combo:0,lastClick:-100,finished:false};for(const g of gear)s.run.upgrades[g.id]??=0;return s;}
export function ranks(s,b){return 0;}
export function rates(s){const r=s.run;if(!r)return {click:0,idle:0};const st=styles[s.style];let c=st.click*(1+r.upgrades.touch*.65)*(1+ranks(s,'hand')*.07);let a=st.idle*(1+r.upgrades.drone*.65)*(1+ranks(s,'machine')*.07);const shared=(1+(r.upgrades.harmony||0)*.06)*(1+r.upgrades.coil*.15)*(1+ranks(s,'harmony')*.03)*(1+Math.min(s.runs,100)*.022);for(const id of r.relics){const q=relics.find(x=>x.id===id);c*=q.click;a*=q.idle;}return {click:c*shared,idle:a*shared};}
export function target(s,stage=s.run.stage){return [120,400,950,1900,3400][stage]*(1+Math.min(s.runs,100)*.025);}
export function gain(s,n){const r=s.run;if(!r||r.finished||r.draft)return;r.energy+=n;r.earned+=n*(1+r.upgrades.lens*.12);}
export function tick(s,dt){if(!s.run||s.run.finished||s.run.draft)return;dt=Math.max(0,Math.min(dt,8*3600));s.run.elapsed+=dt;gain(s,rates(s).idle*dt);if(s.run.elapsed-s.run.lastClick>1.8)s.run.combo=0;}
export function click(s){const r=s.run;if(!r||r.finished||r.draft)return 0;const gap=r.elapsed-r.lastClick;if(gap<.28)return 0;r.combo=gap>=.28&&gap<=1.3?Math.min(10,r.combo+1):0;r.lastClick=r.elapsed;s.totalClicks++;const n=rates(s).click*(1+r.combo*.035);gain(s,n);return n;}
export function price(s,id){const g=gear.find(x=>x.id===id);return Math.ceil(g.base*Math.pow(1.29,s.run.upgrades[id])*Math.pow(1.075,s.runs));}
export function buy(s,id){if(!s.run||s.run.finished||s.run.draft||!gear.some(g=>g.id===id)||s.run.upgrades[id]>=6)return false;const p=price(s,id);if(s.run.energy<p)return false;s.run.energy-=p;s.run.upgrades[id]++;return true;}
export function advance(s,rng=Math.random){const r=s.run;if(!r||r.finished||r.draft||r.earned<target(s))return false;if(r.stage===4){if(!r.guardian)return false;r.finished=true;return true;}r.stage++;let pool=[...relics];r.draft=Array.from({length:3},()=>pool.splice(Math.floor(rng()*pool.length),1)[0].id);return true;}
export function choose(s,id){if(!s.run?.draft?.includes(id))return false;s.run.relics.push(id);s.run.draft=null;return true;}
export function reward(s){if(!s.run)return 0;let amount=(4+s.run.stage*5+(s.run.finished?18:0))*(1+Math.min(s.runs,100)*.02)*(1+ranks(s,'memory')*.04);for(const id of s.run.relics)amount*=relics.find(x=>x.id===id).seeds||1;return s.run.earned>=target(s,0)?Math.floor(amount)+(s.run.finds||0):0;}
export function prestige(s){const n=reward(s);if(!n)return false;s.seeds+=n;s.history.unshift({seeds:n,seconds:Math.round(s.run.elapsed),complete:s.run.finished,style:s.style});s.history=s.history.slice(0,30);if(s.run.finished){const available=nodes.filter(q=>!s.tree[q.id]);s.offers=available.slice(s.runs%Math.max(1,available.length)).concat(available.slice(0,s.runs%Math.max(1,available.length))).slice(0,3).map(q=>q.id);}s.runs++;s.run=null;return n;}
export function nodeCost(s,n){return n.cost*(1+(s.tree[n.id]||0));}
relics.push({id:'thunder',name:'Thunder orchard',desc:'Every aimed harvest chains lightning to a neighbor. +10% yield.',click:1.1,idle:1.1},{id:'orchid',name:'Orchid engine',desc:'+40% passive production; −10% harvest power.',click:.9,idle:1.4},{id:'fracture',name:'Fractured sun',desc:'+40% harvest power; −10% passive production.',click:1.4,idle:.9},{id:'crown',name:'Crown of copper',desc:'+20% all production. Machines and hands grow together.',click:1.2,idle:1.2},{id:'promise',name:'The last promise',desc:'+40% seed rewards; −10% all production.',click:.9,idle:.9,seeds:1.4},{id:'duet',name:'Ghost duet',desc:'+25% harvest and +15% passive production.',click:1.25,idle:1.15});
export function validate(s){
 if(s?.schema===1||s?.schema===2){Legacy.validate(s);let refund=0;for(const q of Legacy.nodes){const rank=s.tree[q.id]||0;refund+=q.cost*rank*(rank+1)/2;}s.seeds+=refund;s.tree={};s.loadout=[];s.offers=[];s.schema=3;s.migration='Your former root network was refunded in full. Discover new expedition rules in the Keepsake Grove.';if(s.run){s.run.loadout=[];for(const g of gear)s.run.upgrades[g.id]=Math.min(6,s.run.upgrades[g.id]);}}
 if(s?.run)for(const k of ['finds','excavated'])if(s.run[k]!==undefined&&(!Number.isInteger(s.run[k])||s.run[k]<0||s.run[k]>1e9))throw Error('Invalid discoveries');
 validateCore(s);for(const key of ['loadout','offers']){if(!Array.isArray(s[key])||s[key].length>3||new Set(s[key]).size!==s[key].length||s[key].some(id=>!nodes.some(n=>n.id===id)))throw Error('Invalid keepsake selection');}if(s.loadout.some(id=>!s.tree[id]))throw Error('Unowned keepsake');if(s.run&&(!Array.isArray(s.run.loadout)||s.run.loadout.length>3||s.run.loadout.some(id=>!s.tree[id])))throw Error('Invalid expedition kit');return s;
}
export function unlock(s,id){const n=nodes.find(x=>x.id===id);if(!n||s.run)return false;const rank=s.tree[id]||0;if(rank>=n.max||s.seeds<nodeCost(s,n)||(n.tier>0&&!s.tree[`${n.branch}-${n.tier-1}`]))return false;s.seeds-=nodeCost(s,n);s.tree[id]=rank+1;return true;}
function validateCore(s){if(!s||s.schema!==3||typeof s.name!=='string'||s.name.length>60||!styles[s.style])throw Error('This save is not a supported Verdant Engine save.');const number=(x,max=1e100)=>typeof x==='number'&&Number.isFinite(x)&&x>=0&&x<=max;for(const k of ['seeds','runs','totalClicks','updated'])if(!number(s[k]))throw Error('Invalid save values.');if(!s.tree||!Array.isArray(s.history)||s.history.length>30||!Number.isInteger(s.runs)||s.runs>1000)throw Error('Invalid save structure.');for(const h of s.history)if(!h||!number(h.seeds)||!number(h.seconds)||typeof h.complete!=='boolean'||!styles[h.style])throw Error('Invalid journal.');for(const [id,v] of Object.entries(s.tree))if(!nodes.some(n=>n.id===id)||!Number.isInteger(v)||v<0||v>1)throw Error('Invalid skill rank.');if(s.run){const r=s.run;for(const k of ['energy','earned','elapsed','combo'])if(!number(r[k]))throw Error('Invalid expedition values.');if(!Number.isInteger(r.stage)||r.stage<0||r.stage>4||!Number.isFinite(r.lastClick)||typeof r.finished!=='boolean')throw Error('Invalid expedition.');for(const g of gear)if(!number(r.upgrades?.[g.id],6)||!Number.isInteger(r.upgrades[g.id]))throw Error('Invalid upgrade.');if(!Array.isArray(r.relics)||r.relics.length>4||r.relics.some(id=>!relics.some(q=>q.id===id)))throw Error('Invalid relic.');if(r.draft!==null&&(!Array.isArray(r.draft)||r.draft.length!==3||r.draft.some(id=>!relics.some(q=>q.id===id))))throw Error('Invalid draft.');}return s;}









export const evolutions={
 touch:['Sweeping gloves','Every third touch fans out to a second node.','At ten resonance, your touch releases a ring harvest.'],
 drone:['Pip · seedling scout','Pip seeks chests and brings a friend.','Click Pip to rally the whole crew.'],
 coil:['Root rails','Friends link their targets with a harvest beam.','Overcharged friends also harvest as they travel.'],
 lens:['Treasure spectacles','A buried cache surfaces every 12 seconds.','Breaking caches reveals a flower patch.'],
 moth:['Luma · prism moth','Luma automatically fans out on landing.','Wake Luma to scatter across nine targets.'],
 beetle:['Bram · copper digger','Bram seeks chests and cracks them in one landing.','Wake Bram to excavate every nearby cache.'],
 wisp:['Zig · storm sprite','Zig arcs into two neighbors on landing.','Wake Zig to fire a lightning web.'],
 rainmaker:['Nori · rain frog','Nori plants a flower wherever it lands.','Wake Nori to grow an entire flower patch.'],
 comet:['Roo · rocket mouse','Roo explodes on landing.','Wake Roo to send a second meteor wave.'],
 echo:['Echo vines','Crew harvests can echo into neighbors too.','Echo hits leap a second time.'],
 magnet:['Gravity acorn','Overcharging a friend gathers its targets together.','Root pulse pulls the whole board into a spiral.'],
 bloom:['Pocket nursery','Every sixth harvest sprouts a flower.','Flowers burst into adjacent salvage.'],
 tempo:['Clockwork music box','Waking friends rewinds both abilities by one second.','Every ten resonance rewinds them by three seconds.'],
 fortune:['Lucky lunchbox','Every fifth chest opens a flower surprise.','Golden harvests scatter into nearby nodes.'],
 pick:['Burrow boots','Cracking a cache sends an excavation shockwave.','Your first cache hit splits its shell instantly.'],
 harmony:['Crew handshake','Waking one friend also wakes its nearest buddy.','Overcharged friends share a landing burst.']};
export function upgradeInfo(s,id){const level=s.run.upgrades[id],v=evolutions[id];return {name:v[0],next:level<1?gear.find(g=>g.id===id).desc:level<3?v[1]:level<6?v[2]:v[1]+' '+v[2],milestone:level<3?3:6};}
