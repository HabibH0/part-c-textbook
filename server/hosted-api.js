import {Hono} from 'hono';
import {bodyLimit} from 'hono/body-limit';
import {randomBytes,randomUUID,scrypt,timingSafeEqual,createHash} from 'node:crypto';
import {promisify} from 'node:util';
import {courses} from '../content/courses.js';
import {chapters} from '../content/chapters.js';
import {lessons,exercises,exerciseMap,publicExercise} from '../content/catalog.js';
import {grade} from './grading.js';
const derive=promisify(scrypt),digest=value=>createHash('sha256').update(value).digest('hex');
const lifetime=30*24*60*60*1000;
async function hashPassword(password,salt=randomBytes(16).toString('hex')){
 const bytes=await derive(password,salt,64,{N:32768,r:8,p:1,maxmem:64*1024*1024});
 return salt+':'+bytes.toString('hex');
}
async function matches(password,stored){
 const candidate=await hashPassword(password,stored?.split(':')[0]||'0'.repeat(32));
 const a=Buffer.from(candidate),b=Buffer.from(stored||'x'.repeat(candidate.length));
 return a.length===b.length&&timingSafeEqual(a,b);
}
export function createHostedApi({db,allowedOrigins}){
 const origins=new Set(allowedOrigins);
 if(!origins.size)throw new Error('An explicit FRONTEND_ORIGINS allowlist is required.');
 const app=new Hono();
 app.use('*',async(c,next)=>{
  c.header('Cache-Control','no-store');c.header('X-Content-Type-Options','nosniff');c.header('Referrer-Policy','no-referrer');
  const origin=c.req.header('Origin');
  if(origin&&!origins.has(origin))return c.json({error:'This website is not allowed to access the textbook API.'},403);
  if(origin){c.header('Access-Control-Allow-Origin',origin);c.header('Vary','Origin');}
  if(c.req.method==='OPTIONS'){
   c.header('Access-Control-Allow-Methods','GET, POST, OPTIONS');
   c.header('Access-Control-Allow-Headers','Authorization, Content-Type, X-Requested-With');
   c.header('Access-Control-Max-Age','600');return c.body(null,204);
  }
  if(c.req.method==='POST'&&c.req.header('X-Requested-With')!=='PartC')return c.json({error:'Request verification failed.'},403);
  await next();
 });
 app.use('*',bodyLimit({maxSize:24*1024,onError:c=>c.json({error:'Your answer is too large.'},413)}));
 app.onError((error,c)=>{
  if(error instanceof SyntaxError)return c.json({error:'Invalid JSON request.'},400);
  console.error('Textbook API request failed',error.code||error.name);
  return c.json({error:'The server could not complete this request. Please try again.'},500);
 });
 const session=async c=>{
  const token=c.req.header('Authorization')?.match(/^Bearer ([a-f0-9]{64})$/)?.[1];
  return token?db.one('SELECT s.*,u.username,u.display_name FROM sessions s JOIN users u ON u.id=s.user_id WHERE token_hash=$1 AND expires_at>$2',[digest(token),Date.now()]):null;
 };
 const requireUser=async(c,next)=>{
  const current=await session(c);
  if(!current)return c.json({error:'Sign in to save your progress.'},401);
  c.set('session',current);await next();
 };
 async function startSession(user){
  const token=randomBytes(32).toString('hex'),csrf=randomBytes(24).toString('hex');
  await db.query('DELETE FROM sessions WHERE expires_at<$1',[Date.now()]);
  await db.query('INSERT INTO sessions(token_hash,user_id,csrf,expires_at) VALUES($1,$2,$3,$4)',[digest(token),user.id,csrf,Date.now()+lifetime]);
  return {user:{username:user.username,name:user.display_name},csrf:null,token};
 }
 // Shared counters across Function isolates. Never trust a client-provided IP.
 async function authLimit(username){
  const now=Date.now(),minute=Math.floor(now/60000),window=Math.floor(now/900000);
  await db.query('DELETE FROM auth_limits WHERE expires_at<$1',[now]);
  for(const [key,expires,limit] of [
   ['global:'+minute,(minute+1)*60000,100],
   ['username:'+digest(username.toLowerCase())+':'+window,(window+1)*900000,20]
  ]){
   const row=await db.one('INSERT INTO auth_limits(key,count,expires_at) VALUES($1,1,$2) ON CONFLICT(key) DO UPDATE SET count=auth_limits.count+1 RETURNING count',[key,expires]);
   if(row.count>limit)return Math.ceil((expires-now)/1000);
  }
  return 0;
 }
 app.get('/api/health',c=>c.json({ok:true,storage:'postgres'}));
 app.get('/api/course',c=>c.json({courses,chapters,lessons,exercises:exercises.map(publicExercise)}));
 app.get('/api/session',async c=>{const s=await session(c);return c.json(s?{user:{username:s.username,name:s.display_name},csrf:null}:{user:null,csrf:null});});
 app.post('/api/register',async c=>{
  const {username,password,name}=(await c.req.json())||{};
  if(typeof username!=='string'||!/^[a-zA-Z0-9_-]{3,32}$/.test(username))return c.json({error:'Use a username with 3–32 letters, numbers, underscores, or hyphens.'},400);
  if(typeof password!=='string'||password.length<12||password.length>128)return c.json({error:'Use a password between 12 and 128 characters.'},400);
  if(typeof name!=='string'||!name.trim()||name.trim().length>60)return c.json({error:'Enter a display name of 1–60 characters.'},400);
  const retry=await authLimit(username);if(retry){c.header('Retry-After',String(retry));return c.json({error:'Too many sign-in attempts. Please try again later.'},429);}
  const user={id:randomUUID(),username:username.toLowerCase(),display_name:name.trim()};
  const hash=await hashPassword(password);
  try{await db.query('INSERT INTO users(id,username,display_name,password_hash) VALUES($1,$2,$3,$4)',[user.id,user.username,user.display_name,hash]);}
  catch(error){if(error.code==='23505')return c.json({error:'That username is already taken.'},409);throw error;}
  return c.json(await startSession(user),201);
 });
 app.post('/api/login',async c=>{
  const {username,password}=(await c.req.json())||{};
  if(typeof username!=='string'||typeof password!=='string'||username.length>32||password.length>128)return c.json({error:'Enter your username and password.'},400);
  const retry=await authLimit(username);if(retry){c.header('Retry-After',String(retry));return c.json({error:'Too many sign-in attempts. Please try again later.'},429);}
  const user=await db.one('SELECT * FROM users WHERE username=$1',[username.toLowerCase()]);
  if(!await matches(password,user?.password_hash))return c.json({error:'The username or password is incorrect.'},401);
  return c.json(await startSession(user));
 });
 app.post('/api/logout',requireUser,async c=>{await db.query('DELETE FROM sessions WHERE token_hash=$1',[c.get('session').token_hash]);return c.json({ok:true});});
 app.get('/api/progress',requireUser,async c=>{
  const user=c.get('session').user_id;
  const [lessonRows,exerciseRows]=await Promise.all([
   db.query('SELECT lesson_id,is_read,last_tab,updated_at FROM lesson_progress WHERE user_id=$1',[user]),
   db.query('SELECT exercise_id,answer,attempts,correct,independent,hints_used,solution_seen,self_reviewed,updated_at FROM exercise_progress WHERE user_id=$1',[user])
  ]);return c.json({lessons:lessonRows,exercises:exerciseRows});
 });
 app.post('/api/lessons/:id',requireUser,async c=>{
  const id=c.req.param('id');if(!lessons.some(l=>l.id===id))return c.json({error:'Lesson not found.'},404);
  const {read,tab}=(await c.req.json())||{};if(typeof read!=='boolean'||!['learn','explore','practice','mastery'].includes(tab))return c.json({error:'Invalid lesson progress.'},400);
  await db.query('INSERT INTO lesson_progress(user_id,lesson_id,is_read,last_tab) VALUES($1,$2,$3,$4) ON CONFLICT(user_id,lesson_id) DO UPDATE SET is_read=excluded.is_read,last_tab=excluded.last_tab,updated_at=CURRENT_TIMESTAMP::text',[c.get('session').user_id,id,Number(read),tab]);
  return c.json({ok:true});
 });
 app.post('/api/exercises/:id',requireUser,async c=>{
  const exercise=exerciseMap.get(c.req.param('id'));if(!exercise)return c.json({error:'Exercise not found.'},404);
  const {action,answer=''}=(await c.req.json())||{};
  if(!['save','check','hint','solution'].includes(action)||typeof answer!=='string'||answer.length>8000)return c.json({error:'Invalid action or answer. Answers may contain up to 8,000 characters.'},400);
  if(action==='check'&&!answer.trim())return c.json({error:'Enter an answer first.'},400);
  const user=c.get('session').user_id;
  const result=await db.transaction(async tx=>{
   await tx.query('INSERT INTO exercise_progress(user_id,exercise_id) VALUES($1,$2) ON CONFLICT(user_id,exercise_id) DO NOTHING',[user,exercise.id]);
   const before=await tx.one('SELECT * FROM exercise_progress WHERE user_id=$1 AND exercise_id=$2 FOR UPDATE',[user,exercise.id]);
   let lastCorrect,parts,feedback='Answer saved to your account.';
   if(action==='save')await tx.query('UPDATE exercise_progress SET answer=$1,updated_at=CURRENT_TIMESTAMP::text WHERE user_id=$2 AND exercise_id=$3',[answer,user,exercise.id]);
   if(action==='hint')await tx.query('UPDATE exercise_progress SET hints_used=LEAST(hints_used+1,$1),updated_at=CURRENT_TIMESTAMP::text WHERE user_id=$2 AND exercise_id=$3',[exercise.hints.length,user,exercise.id]);
   if(action==='solution')await tx.query('UPDATE exercise_progress SET solution_seen=1,updated_at=CURRENT_TIMESTAMP::text WHERE user_id=$1 AND exercise_id=$2',[user,exercise.id]);
   if(action==='check'){
    lastCorrect=grade(exercise,answer);const assisted=Boolean(before.hints_used||before.solution_seen);
    await tx.query('INSERT INTO attempts(user_id,exercise_id,answer,correct,assisted) VALUES($1,$2,$3,$4,$5)',[user,exercise.id,answer,Number(lastCorrect),Number(assisted)]);
    await tx.query('UPDATE exercise_progress SET answer=$1,attempts=attempts+1,correct=GREATEST(correct,$2),independent=GREATEST(independent,$3),updated_at=CURRENT_TIMESTAMP::text WHERE user_id=$4 AND exercise_id=$5',[answer,Number(lastCorrect),Number(lastCorrect&&!assisted),user,exercise.id]);
    feedback=lastCorrect?(assisted?'Correct · completed with support.':'Correct · answered independently.'):'Not quite. Check the definitions, dimensions, and arithmetic, then try again. You can reveal a hint if needed.';
    if(exercise.type==='multi'){let values=[];try{values=JSON.parse(answer);}catch{}parts=exercise.parts.map((p,i)=>grade(p,Array.isArray(values)?values[i]:undefined));}
   }
   const {user_id,...state}=await tx.one('SELECT * FROM exercise_progress WHERE user_id=$1 AND exercise_id=$2',[user,exercise.id]);
   return {state,feedback,lastCorrect,parts,hints:exercise.hints.slice(0,state.hints_used),solution:state.solution_seen?exercise.solution:null};
  });
  return c.json(result);
 });
 app.get('/api/exercises/:id/revealed',requireUser,async c=>{
  const exercise=exerciseMap.get(c.req.param('id'));if(!exercise)return c.json({error:'Exercise not found.'},404);
  const state=await db.one('SELECT hints_used,solution_seen FROM exercise_progress WHERE user_id=$1 AND exercise_id=$2',[c.get('session').user_id,exercise.id]);
  return c.json({hints:exercise.hints.slice(0,state?.hints_used||0),solution:state?.solution_seen?exercise.solution:null});
 });
 app.notFound(c=>c.json({error:'Endpoint not found.'},404));
 return app;
}
