import assert from 'node:assert/strict';
import { resizeFrame, viewportFrame, fitFrame, desktopBounds } from '../src/utils/geometry.js';
import { dockLayout, dockMagnification } from '../src/utils/dockLayout.js';
import { windowsReducer } from '../src/hooks/useWindows.js';
import { projectFilesReducer } from '../src/hooks/useProjectFiles.js';

globalThis.window = { innerWidth: 1440, innerHeight: 900 };
globalThis.document = { querySelector: () => null };
assert.deepEqual(viewportFrame(), { x: 0, y: 0, width: 1440, height: 900 });
const bounds = { left: 12, top: 40, right: 1428, bottom: 790 };
const original = { x: 300, y: 120, width: 720, height: 500 };
for (const edge of ['n','ne','e','se','s','sw','w','nw']) {
  for (const dx of [-9999,-50,0,50,9999]) for (const dy of [-9999,-50,0,50,9999]) {
    const next = resizeFrame(original,edge,dx,dy,bounds);
    assert.ok(next.x >= bounds.left && next.y >= bounds.top);
    assert.ok(next.x + next.width <= bounds.right && next.y + next.height <= bounds.bottom);
    assert.ok(next.width >= 360 && next.height >= 240);
    if(edge.includes('w')) assert.equal(next.x + next.width,original.x + original.width);
    if(edge.includes('n')) assert.equal(next.y + next.height,original.y + original.height);
  }
}
assert.equal(resizeFrame(original,'w',40,0,bounds).width,680);
assert.equal(resizeFrame(original,'e',40,0,bounds).width,760);
assert.deepEqual(resizeFrame(original,'se',9999,9999,{left:0,top:0,right:200,bottom:120}),{x:0,y:0,width:200,height:120});
assert.ok(resizeFrame({x:12,y:40,width:300,height:200},'se',0,0,bounds,{width:480,height:240}).width>=480);

const a={id:'a',frame:original,maximized:true,minimized:false};
const b={id:'b',frame:{...original,x:50},maximized:false,minimized:false};
let windows=windowsReducer([a],{type:'open',item:b});
assert.equal(windows[0].maximized,false);
assert.deepEqual(windows[0].frame,original);
windows=windowsReducer(windows,{type:'zoom',id:'b'});
windows=windowsReducer(windows,{type:'move',id:'a',frame:resizeFrame(original,'se',30,40,bounds)});
windows=windowsReducer(windows,{type:'focus',id:'a'});
assert.equal(windows.at(-1).id,'a');
assert.equal(windows.find(w=>w.id==='b').maximized,false);
assert.equal(windows.at(-1).frame.width,750);
windows=windowsReducer(windows,{type:'zoom',id:'a'});
windows=windowsReducer(windows,{type:'minimize',id:'a'});
windows=windowsReducer(windows,{type:'open',item:{...a,origin:{x:1},trigger:null}});
assert.equal(windows.at(-1).maximized,true);
assert.equal(windows.at(-1).minimized,false);
assert.equal(windows.at(-1).frame.width,750);

let files={trashed:[],removed:[]};
files=projectFilesReducer(files,{type:'trash',id:'one'});
files=projectFilesReducer(files,{type:'trash',id:'one'});
assert.deepEqual(files.trashed,['one']);
files=projectFilesReducer(files,{type:'restore',id:'one'});
assert.deepEqual(files.trashed,[]);
files=projectFilesReducer(files,{type:'trash',id:'one'});
files=projectFilesReducer(files,{type:'empty'});
assert.deepEqual(files,{trashed:[],removed:['one']});
assert.deepEqual(projectFilesReducer(files,{type:'trash',id:'one'}),files);
assert.deepEqual(projectFilesReducer({trashed:['a','b'],removed:['c']},{type:'restore-all'}),{trashed:[],removed:['c']});

const apps=Array.from({length:8},(_,index)=>({dividerBefore:index===4||index===7,iconScale:index===1?1.2:1}));
const layout=dockLayout(apps);
let maximum=0;
for(let pointer=0;pointer<=layout.width;pointer+=5){
  let width=18+7*4+2*16;
  layout.items.forEach((item,index)=>{
    const scale=dockMagnification(pointer,item.center);
    assert.ok(scale>=1&&scale<=1.45);
    const art=52*Math.max(1,apps[index].iconScale)*scale;
    assert.ok(item.slot*scale-art>=7.99,'Optically enlarged artwork still has layout room');
    width+=item.slot*scale;
  });
  maximum=Math.max(maximum,width);
}
assert.ok(maximum>layout.width,'Glass must widen');
assert.ok(maximum<769-24,'Eight normal slots fit the smallest desktop');
assert.equal(dockMagnification(Infinity,10),1);
assert.equal(dockMagnification(10,10),1.45);
console.log('PASS: 200 resize cases, fullscreen/restore/focus transitions, Trash lifecycle, and width-growing non-overlapping Dock geometry.');
