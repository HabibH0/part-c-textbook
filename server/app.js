import {chapters} from '../content/chapters.js';
import {courses} from '../content/courses.js';
import express from 'express';
import { randomBytes, randomUUID, scrypt, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { openDatabase } from './db.js';
import { lessons, exercises, exerciseMap, publicExercise } from '../content/catalog.js';

const derive = promisify(scrypt);
const root = fileURLToPath(new URL('..', import.meta.url));
const digest = value => createHash('sha256').update(value).digest('hex');
const sessionDuration = 30 * 24 * 60 * 60 * 1000;
async function passwordHash(password, salt = randomBytes(16).toString('hex')) {
  const result = await derive(password, salt, 64, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  return `${salt}:${result.toString('hex')}`;
}
async function passwordMatches(password, stored) {
  const salt = stored?.split(':')[0] || '0'.repeat(32);
  const candidate = await passwordHash(password, salt);
  const a = Buffer.from(candidate); const b = Buffer.from(stored || 'x'.repeat(candidate.length));
  return a.length === b.length && timingSafeEqual(a,b);
}
export {grade} from './grading.js';
import {grade} from './grading.js';

export function createApp({ dbPath = process.env.DATABASE_PATH || resolve(root,'data/textbook.sqlite'), secureCookies = process.env.COOKIE_SECURE === 'true' } = {}) {
  const db = openDatabase(dbPath);
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '24kb' }));
  app.use((req,res,next) => {
    res.set({'X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin','X-Frame-Options':'SAMEORIGIN'});
    next();
  });
  const hosts = new Set(['localhost','127.0.0.1','::1',...(process.env.ALLOWED_HOSTS || '').split(',').map(s=>s.trim()).filter(Boolean)]);
  app.use('/api',(req,res,next)=> {
    res.set('Cache-Control','no-store');
    if (!hosts.has(req.hostname)) return res.status(403).json({error:'This host is not configured for the local textbook server.'});
    if (!['GET','HEAD'].includes(req.method)) {
      if (req.get('X-Requested-With') !== 'PartC') return res.status(403).json({error:'Request verification failed. Reload the page.'});
      const origin = req.get('origin');
      if (origin) {
        try { if (new URL(origin).host !== req.get('host')) return res.status(403).json({error:'Cross-origin writes are not allowed.'}); }
        catch { return res.status(403).json({error:'Invalid request origin.'}); }
      }
    }
    const cookies = req.get('cookie') || '';
    const token = cookies.split(';').map(s=>s.trim()).find(s=>s.startsWith('partc_session='))?.slice(14);
    if (token && /^[a-f0-9]{64}$/.test(token)) {
      req.session = db.prepare('SELECT s.*, u.username, u.display_name FROM sessions s JOIN users u ON u.id=s.user_id WHERE token_hash=? AND expires_at>?').get(digest(token),Date.now());
    }
    next();
  });
  function requireUser(req,res,next) {
    if (!req.session) return res.status(401).json({error:'Sign in to save your progress.'});
    if (!['GET','HEAD'].includes(req.method) && req.get('X-CSRF-Token') !== req.session.csrf) return res.status(403).json({error:'Your session needs refreshing. Reload the page and try again.'});
    next();
  }
  const limits = new Map();
  function authLimit(req,res,next) {
    const now = Date.now(); const key = req.ip;
    for (const [k,v] of limits) if (v.until < now) limits.delete(k);
    const value = limits.get(key) || { count: 0, until: now + 15*60*1000 }; value.count++; limits.set(key,value);
    if (value.count>20) return res.status(429).json({error:'Too many sign-in attempts. Please wait 15 minutes before trying again.'});
    next();
  }
  function startSession(res,user) {
    const token = randomBytes(32).toString('hex'); const csrf = randomBytes(24).toString('hex');
    db.prepare('DELETE FROM sessions WHERE expires_at<?').run(Date.now());
    db.prepare('INSERT INTO sessions(token_hash,user_id,csrf,expires_at) VALUES(?,?,?,?)').run(digest(token),user.id,csrf,Date.now()+sessionDuration);
    res.cookie('partc_session',token,{httpOnly:true,sameSite:'strict',secure:secureCookies,maxAge:sessionDuration,path:'/'});
    return {user:{username:user.username,name:user.display_name},csrf};
  }
  app.get('/api/health',(_req,res)=>res.json({ok:true}));
  app.get('/api/course',(_req,res)=>res.json({courses,chapters,lessons,exercises:exercises.map(publicExercise)}));
  app.get('/api/session',(req,res)=>res.json(req.session?{user:{username:req.session.username,name:req.session.display_name},csrf:req.session.csrf}:{user:null,csrf:null}));
  app.post('/api/register',authLimit,async(req,res)=> {
    const { username, password, name } = req.body || {};
    if (typeof username!=='string' || !/^[a-zA-Z0-9_-]{3,32}$/.test(username)) return res.status(400).json({error:'Use a username with 3–32 letters, numbers, underscores, or hyphens.'});
    if (typeof password!=='string' || password.length<12 || password.length>128) return res.status(400).json({error:'Use a password between 12 and 128 characters.'});
    if (typeof name!=='string' || !name.trim() || name.trim().length>60) return res.status(400).json({error:'Enter a display name of 1–60 characters.'});
    const key=username.toLowerCase();
    if (db.prepare('SELECT id FROM users WHERE username=?').get(key)) return res.status(409).json({error:'That username is already taken.'});
    const user={id:randomUUID(),username:key,display_name:name.trim()};
    const hashed=await passwordHash(password);
    try { db.prepare('INSERT INTO users(id,username,display_name,password_hash) VALUES(?,?,?,?)').run(user.id,key,user.display_name,hashed); }
    catch(error) { if(error.message.includes('UNIQUE')) return res.status(409).json({error:'That username is already taken.'}); throw error; }
    res.status(201).json(startSession(res,user));
  });
  app.post('/api/login',authLimit,async(req,res)=> {
    const {username,password}=req.body || {};
    if(typeof username!=='string'||typeof password!=='string'||username.length>32||password.length>128) return res.status(400).json({error:'Enter your username and password.'});
    const user=db.prepare('SELECT * FROM users WHERE username=?').get(username.toLowerCase());
    if(!await passwordMatches(password,user?.password_hash)) return res.status(401).json({error:'The username or password is incorrect.'});
    res.json(startSession(res,user));
  });
  app.post('/api/logout',requireUser,(req,res)=> {
    db.prepare('DELETE FROM sessions WHERE token_hash=?').run(req.session.token_hash);
    res.clearCookie('partc_session',{httpOnly:true,sameSite:'strict',secure:secureCookies,path:'/'}); res.json({ok:true});
  });
  app.get('/api/progress',requireUser,(req,res)=> {
    const user=req.session.user_id;
    res.json({lessons:db.prepare('SELECT lesson_id,is_read,last_tab,updated_at FROM lesson_progress WHERE user_id=?').all(user),exercises:db.prepare('SELECT exercise_id,answer,attempts,correct,independent,hints_used,solution_seen,self_reviewed,updated_at FROM exercise_progress WHERE user_id=?').all(user)});
  });
  app.post('/api/lessons/:id',requireUser,(req,res)=> {
    if(!lessons.some(l=>l.id===req.params.id)) return res.status(404).json({error:'Lesson not found.'});
    const {read,tab}=req.body || {};
    if(typeof read!=='boolean'||!['learn','explore','practice','mastery'].includes(tab)) return res.status(400).json({error:'Invalid lesson progress.'});
    db.prepare(`INSERT INTO lesson_progress(user_id,lesson_id,is_read,last_tab) VALUES(?,?,?,?) ON CONFLICT(user_id,lesson_id) DO UPDATE SET is_read=excluded.is_read,last_tab=excluded.last_tab,updated_at=CURRENT_TIMESTAMP`).run(req.session.user_id,req.params.id,Number(read),tab);
    res.json({ok:true});
  });
  app.post('/api/exercises/:id',requireUser,(req,res)=> {
    const exercise=exerciseMap.get(req.params.id);
    if(!exercise) return res.status(404).json({error:'Exercise not found.'});
    const {action,answer=''}=req.body || {};
    if(!['save','check','hint','solution'].includes(action)||typeof answer!=='string'||answer.length>8000) return res.status(400).json({error:'Invalid action or answer. Answers may contain up to 8,000 characters.'});
    const user=req.session.user_id;
    db.prepare('INSERT OR IGNORE INTO exercise_progress(user_id,exercise_id) VALUES(?,?)').run(user,exercise.id);
    const before=db.prepare('SELECT * FROM exercise_progress WHERE user_id=? AND exercise_id=?').get(user,exercise.id);
    let feedback='Answer saved to your account.';
    if(action==='save') db.prepare('UPDATE exercise_progress SET answer=?,updated_at=CURRENT_TIMESTAMP WHERE user_id=? AND exercise_id=?').run(answer,user,exercise.id);
    if(action==='hint') db.prepare('UPDATE exercise_progress SET hints_used=MIN(hints_used+1,?),updated_at=CURRENT_TIMESTAMP WHERE user_id=? AND exercise_id=?').run(exercise.hints.length,user,exercise.id);
    if(action==='solution') db.prepare('UPDATE exercise_progress SET solution_seen=1,updated_at=CURRENT_TIMESTAMP WHERE user_id=? AND exercise_id=?').run(user,exercise.id);
    if(action==='check') {
      if(!answer.trim()) return res.status(400).json({error:'Enter an answer first.'});
      const correct=grade(exercise,answer); const assisted=Boolean(before.hints_used||before.solution_seen);
      db.exec('BEGIN');
      try {
        db.prepare('INSERT INTO attempts(user_id,exercise_id,answer,correct,assisted) VALUES(?,?,?,?,?)').run(user,exercise.id,answer,Number(correct),Number(assisted));
        db.prepare('UPDATE exercise_progress SET answer=?,attempts=attempts+1,correct=MAX(correct,?),independent=MAX(independent,?),updated_at=CURRENT_TIMESTAMP WHERE user_id=? AND exercise_id=?').run(answer,Number(correct),Number(correct&&!assisted),user,exercise.id);
        db.exec('COMMIT');
      } catch(error) {db.exec('ROLLBACK');throw error;}
      feedback=correct?(assisted?'Correct · completed with support.':'Correct · answered independently.'):'Not quite. Check the definitions, dimensions, and arithmetic, then try again. You can reveal a hint if needed.';
      res.locals.lastCorrect=correct;
      if(exercise.type==='multi') {
        let values=[];try{values=JSON.parse(answer);}catch{}
        res.locals.parts=exercise.parts.map((part,i)=>grade(part,Array.isArray(values)?values[i]:undefined));
      }
    }
    const {user_id,...state}=db.prepare('SELECT * FROM exercise_progress WHERE user_id=? AND exercise_id=?').get(user,exercise.id);
    res.json({state,feedback,parts:res.locals.parts,lastCorrect:res.locals.lastCorrect,hints:exercise.hints.slice(0,state.hints_used),solution:state.solution_seen?exercise.solution:null});
  });
  app.get('/api/exercises/:id/revealed',requireUser,(req,res)=> {
    const exercise=exerciseMap.get(req.params.id);
    if(!exercise) return res.status(404).json({error:'Exercise not found.'});
    const state=db.prepare('SELECT hints_used,solution_seen FROM exercise_progress WHERE user_id=? AND exercise_id=?').get(req.session.user_id,exercise.id);
    res.json({hints:exercise.hints.slice(0,state?.hints_used||0),solution:state?.solution_seen?exercise.solution:null});
  });
  app.use('/api',(_req,res)=>res.status(404).json({error:'Endpoint not found.'}));
  return {app,db};
}
