const base=(import.meta.env.VITE_API_BASE_URL||'').replace(/\/+$/,'');
const tokenKey='partc-session:'+base;
let csrf=null,token=null;
if(base){try{token=sessionStorage.getItem(tokenKey);}catch{}}
export const setCsrf=value=>{csrf=value;};
function rememberToken(value){
 token=value;
 try{if(value)sessionStorage.setItem(tokenKey,value);else sessionStorage.removeItem(tokenKey);}catch{}
}
export async function api(path,body){
 const res=await fetch(base+'/api'+path,{
  credentials:base?'omit':'same-origin',
  headers:{'Content-Type':'application/json','X-Requested-With':'PartC',...(base&&token?{Authorization:'Bearer '+token}:{}),...(!base&&csrf?{'X-CSRF-Token':csrf}:{})},
  ...(body?{method:'POST',body:JSON.stringify(body)}:{})
 });
 let data;try{data=await res.json();}catch{throw new Error('The server is unavailable. Your answer is still on screen; please try again.');}
 if(!res.ok){if(base&&res.status===401)rememberToken(null);throw new Error(data.error||'Could not complete this request.');}
 if(base&&data.token)rememberToken(data.token);
 if(base&&(path==='/logout'||(path==='/session'&&!data.user)))rememberToken(null);
 return data;
}
