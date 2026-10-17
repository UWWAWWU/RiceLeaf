// A fresh navigation gets its own session, including tabs copied from an opener.
const navigation=performance.getEntriesByType('navigation')[0]?.type;
let tabId;
try{
 if(navigation==='reload'||navigation==='back_forward')tabId=sessionStorage.getItem('riceleaf-tab-id');
 if(!tabId){tabId=crypto.randomUUID();sessionStorage.removeItem('riceleaf-tab-position');}
 sessionStorage.setItem('riceleaf-tab-id',tabId);
}catch{tabId=crypto.randomUUID();}
let database;
function openDatabase(){
 if(!database)database=new Promise((resolve,reject)=>{
  const request=indexedDB.open('riceleaf-tab-sessions',1);
  request.onupgradeneeded=()=>request.result.createObjectStore('tabs');
  request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
 });
 return database;
}
export async function loadTabState(){
 const db=await openDatabase();
 return new Promise((resolve,reject)=>{const request=db.transaction('tabs').objectStore('tabs').get(tabId);request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});
}
export async function saveTabState(state){
 const db=await openDatabase();
 return new Promise((resolve,reject)=>{const tx=db.transaction('tabs','readwrite');const store=tx.objectStore('tabs');if(state)store.put({...state,updatedAt:Date.now()},tabId);else store.delete(tabId);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});
}
export function saveTabPosition(position){try{sessionStorage.setItem('riceleaf-tab-position',JSON.stringify(position));}catch{}}
export function loadTabPosition(){try{return JSON.parse(sessionStorage.getItem('riceleaf-tab-position')||'null');}catch{return null;}}
