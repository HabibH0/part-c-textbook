import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID,createHash} from 'node:crypto';
import {createHostedApi} from '../server/hosted-api.js';
import {openPostgres} from '../server/postgres.js';
import {exerciseMap} from '../content/catalog.js';

const origin='https://habibh0.github.io';
function client(app){return async(path,body,token,extra={})=>{
 const response=await app.request('/api'+path,{
  method:body===undefined?'GET':'POST',
  headers:{Origin:origin,'Content-Type':'application/json','X-Requested-With':'PartC',...(token?{Authorization:'Bearer '+token}:{}),...extra},
  ...(body===undefined?{}:{body:JSON.stringify(body)})
 });
 return {status:response.status,data:await response.json(),headers:response.headers};
};}

test('hosted API rejects unsafe origins and invalid input before database access',async()=>{
 const db={one(){throw new Error('Unexpected database access');},query(){throw new Error('Unexpected database access');}};
 const app=createHostedApi({db,allowedOrigins:[origin]}),request=client(app);
 assert.equal((await request('/progress')).status,401);
 assert.equal((await request('/course',undefined,undefined,{Origin:'https://untrusted.example'})).status,403);
 assert.equal((await request('/login',{},undefined,{'X-Requested-With':''})).status,403);
 assert.equal((await request('/login',null)).status,400);
 assert.equal((await request('/register',{})).status,400);
 assert.equal((await request('/login',{password:'x'.repeat(26000)})).status,413);
 const preflight=await app.request('/api/progress',{method:'OPTIONS',headers:{Origin:origin,'Access-Control-Request-Headers':'authorization'}});
 assert.equal(preflight.status,204);
 assert.equal(preflight.headers.get('Access-Control-Allow-Origin'),origin);
 assert.match(preflight.headers.get('Access-Control-Allow-Headers'),/Authorization/);
 const catalog=await request('/course');
 assert.equal(catalog.data.lessons.length,42);
 assert.equal(catalog.data.exercises.length,468);
 assert(catalog.data.exercises.every(e=>!('answer' in e)&&!('solution' in e)&&(e.parts||[]).every(p=>!('answer' in p))));
});

test('PostgreSQL accounts, isolation, grading, concurrent saves, expiry and revocation',{
 skip:!process.env.TEST_DATABASE_URL,
 timeout:120000
},async()=>{
 const db=openPostgres(process.env.TEST_DATABASE_URL);
 let request=client(createHostedApi({db,allowedOrigins:[origin]}));
 const suffix=randomUUID().replaceAll('-','').slice(0,15);
 const usernames=['test_a_'+suffix,'test_b_'+suffix];
 const password='test-only-'+randomUUID();
 try{
  const a=await request('/register',{username:usernames[0],name:'Test A',password});
  assert.equal(a.status,201,JSON.stringify(a.data));
  const token=a.data.token;
  assert.match(token,/^[a-f0-9]{64}$/);
  assert.equal(a.headers.get('Access-Control-Allow-Origin'),origin);
  const stored=await db.one('SELECT password_hash FROM users WHERE username=$1',[usernames[0]]);
  assert.notEqual(stored.password_hash,password);
  assert.match(stored.password_hash,/^[a-f0-9]{32}:[a-f0-9]{128}$/);
  const digest=createHash('sha256').update(token).digest('hex');
  assert(await db.one('SELECT token_hash FROM sessions WHERE token_hash=$1',[digest]));
  assert(!await db.one('SELECT token_hash FROM sessions WHERE token_hash=$1',[token]));
  assert.equal((await request('/register',{username:usernames[0].toUpperCase(),name:'Duplicate',password})).status,409);
  assert.equal((await request('/login',{username:usernames[0],password:'wrong-password'})).status,401);
  assert.equal((await request('/lessons/why-nla',{read:true,tab:'learn'},token)).status,200);
  assert.equal((await request('/lessons/why-nla',{read:'yes',tab:'learn'},token)).status,400);
  assert.equal((await request('/exercises/missing',{action:'save',answer:'1'},token)).status,404);
  assert.equal((await request('/exercises/w3',{action:'check',answer:'2,1'},token)).data.lastCorrect,false);
  const checks=await Promise.all(Array.from({length:4},()=>request('/exercises/w3',{action:'check',answer:'2,-1'},token)));
  assert(checks.every(r=>r.status===200&&r.data.lastCorrect&&r.data.state.independent===1));
  await request('/exercises/nm3',{action:'hint'},token);
  const assisted=await request('/exercises/nm3',{action:'check',answer:'1/12'},token);
  assert.equal(assisted.data.state.correct,1);assert.equal(assisted.data.state.independent,0);
  const exercise=exerciseMap.get('w5-auto');
  const answers=exercise.parts.map(p=>p.type==='numeric'?p.answer.join(','):p.answer);
  const partial=await request('/exercises/w5-auto',{action:'check',answer:JSON.stringify(['wrong',...answers.slice(1)])},token);
  assert.equal(partial.data.lastCorrect,false);assert.equal(partial.data.parts[0],false);assert(partial.data.parts.slice(1).every(Boolean));
  assert.equal((await request('/exercises/w5-auto',{action:'check',answer:JSON.stringify(answers)},token)).data.lastCorrect,true);
  assert.equal((await request('/exercises/w5-auto',{action:'review'},token)).status,400);
  const revealed=await request('/exercises/nm3/revealed',undefined,token);
  assert.equal(revealed.data.hints.length,1);assert.equal(revealed.data.solution,null);
  await request('/exercises/nm3',{action:'solution'},token);
  assert.equal((await request('/exercises/nm3/revealed',undefined,token)).data.solution,exerciseMap.get('nm3').solution);
  const b=await request('/register',{username:usernames[1],name:'Test B',password});
  assert.equal(b.status,201);
  assert.deepEqual((await request('/progress',undefined,b.data.token)).data,{lessons:[],exercises:[]});
  assert.deepEqual((await request('/exercises/nm3/revealed',undefined,b.data.token)).data,{hints:[],solution:null});
  const owner=await db.one('SELECT id FROM users WHERE username=$1',[usernames[0]]);
  await request('/lessons/why-nla',{read:false,tab:'learn',user_id:owner.id},b.data.token);
  const aProgress=(await request('/progress',undefined,token)).data;
  assert.equal(aProgress.lessons[0].is_read,1);
  assert.equal(aProgress.exercises.find(e=>e.exercise_id==='w3').attempts,5);
  assert.equal(Number((await db.one('SELECT count(*) AS n FROM attempts WHERE user_id=$1 AND exercise_id=$2',[owner.id,'w3'])).n),5);
  request=client(createHostedApi({db,allowedOrigins:[origin]}));
  const login=await request('/login',{username:usernames[0],password});
  assert.equal(login.status,200);
  assert.deepEqual((await request('/progress',undefined,login.data.token)).data,aProgress);
  await request('/logout',{},login.data.token);
  assert.equal((await request('/progress',undefined,login.data.token)).status,401);
  await db.query('UPDATE sessions SET expires_at=0 WHERE token_hash=$1',[digest]);
  assert.equal((await request('/progress',undefined,token)).status,401);
  assert.equal((await request('/session',undefined,token)).data.user,null);
 }finally{
  await db.query('DELETE FROM users WHERE username=ANY($1::text[])',[usernames]);
  await db.close();
 }
});
