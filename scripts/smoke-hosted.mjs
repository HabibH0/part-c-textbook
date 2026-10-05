import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {openPostgres} from '../server/postgres.js';
const base=process.env.NEON_FUNCTION_TEXTBOOK_BASE_URL?.replace(/\/+$/,'');
if(!base)throw new Error('NEON_FUNCTION_TEXTBOOK_BASE_URL is required.');
const origin='https://habibh0.github.io';
const db=openPostgres(process.env.DATABASE_URL);
const username='smoke_'+randomUUID().replaceAll('-','').slice(0,20);
const password=randomUUID()+randomUUID();
let token;
async function request(path,body){
 const response=await fetch(base+'/api'+path,{
  method:body===undefined?'GET':'POST',
  headers:{Origin:origin,'Content-Type':'application/json','X-Requested-With':'PartC',...(token?{Authorization:'Bearer '+token}:{})},
  ...(body===undefined?{}:{body:JSON.stringify(body)})
 });
 assert.equal(response.headers.get('Access-Control-Allow-Origin'),origin);
 assert(response.ok,`${path} returned ${response.status}`);
 return response.json();
}
try{
 assert.equal((await request('/health')).storage,'postgres');
 const preflight=await fetch(base+'/api/progress',{method:'OPTIONS',headers:{Origin:origin,'Access-Control-Request-Method':'GET','Access-Control-Request-Headers':'authorization,content-type,x-requested-with'}});
 assert.equal(preflight.status,204);assert.equal(preflight.headers.get('Access-Control-Allow-Origin'),origin);
 const course=await request('/course');assert.equal(course.lessons.length,42);assert.equal(course.exercises.length,468);
 token=(await request('/register',{username,name:'Deployment test',password})).token;
 assert.equal((await request('/session')).user.username,username);
 await request('/lessons/why-nla',{read:true,tab:'learn'});
 const result=await request('/exercises/w3',{action:'check',answer:'2,-1'});
 assert.equal(result.lastCorrect,true);assert.equal(result.state.independent,1);
 await request('/logout',{});token=undefined;
 assert.equal((await request('/session')).user,null);
 token=(await request('/login',{username,password})).token;
 const progress=await request('/progress');assert.equal(progress.lessons[0].is_read,1);assert.equal(progress.exercises[0].independent,1);
 await request('/logout',{});
 console.log('Live HTTPS API passed: CORS, catalog, registration, login, grading, saved progress and logout.');
}finally{
 await db.query('DELETE FROM users WHERE username=$1',[username]);
 await db.close();
}
