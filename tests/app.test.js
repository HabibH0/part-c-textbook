import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createApp,grade} from '../server/app.js';
import {exercises,exerciseMap,lessons} from '../content/catalog.js';
import katex from 'katex';
import {chapters} from '../content/chapters.js';
import {courses} from '../content/courses.js';

test('all mathematical markup parses and every lesson has ordered practice and mastery',()=>{
  assert.equal(exercises.length,468);
  assert.equal(exercises.filter(e=>e.lesson.startsWith('svd-')).length,44);
  assert.equal(exercises.filter(e=>e.lesson.startsWith('minmax-')).length,44);
  assert.equal(exercises.filter(e=>e.lesson.startsWith('lu-')).length,44);
  assert.equal(exercises.filter(e=>e.lesson.startsWith('qr-')).length,66);
  assert.equal(exercises.filter(e=>e.lesson.startsWith('stability-')).length,66);
  assert.equal(exercises.filter(e=>e.lesson.startsWith('eigen-')).length,55);
  assert.equal(exercises.filter(e=>e.lesson.startsWith('qralg-')).length,55);
  assert.equal(exercises.filter(e=>e.lesson.startsWith('spectral-')).length,44);
  assert.equal(new Set(exercises.map(e=>e.id)).size,468);
  const docs=lessons.map(l=>readFileSync(new URL(`../content/${l.file||l.id}.md`,import.meta.url),'utf8'));
  const snippets=[...docs,...exercises.flatMap(e=>[e.prompt,e.solution,...e.hints,...(e.options||[]).map(o=>o[1]),...(e.parts||[]).flatMap(p=>[p.prompt,...(p.options||[]).map(o=>o[1])])])];
  for(const content of snippets){for(const match of content.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$\n]+)\$/g)){assert.doesNotThrow(()=>katex.renderToString(match[1]||match[2],{throwOnError:true,strict:'ignore'}),match[0]);}}
  for(const lesson of lessons){const qs=exercises.filter(e=>e.lesson===lesson.id&&!e.mastery);assert(qs.length>=8);assert.deepEqual(qs.map(e=>e.level),qs.map(e=>e.level).sort());assert.equal(exercises.filter(e=>e.lesson===lesson.id&&e.mastery).length,3);}
});
test('numeric grader accepts fractions, rejects unsafe input, and checks every component',()=>{
  assert(grade(exerciseMap.get('nm3'),'1/12'));
  assert(grade(exerciseMap.get('n1'),'7, 5, 4'));
  assert(!grade(exerciseMap.get('n1'),'7, 5'));
  assert(!grade(exerciseMap.get('nm3'),'Infinity'));
  assert(!grade(exerciseMap.get('nm3'),'process.exit()'));
  assert(!grade(exerciseMap.get('nm3'),'1/0'));
  assert(!grade(exerciseMap.get('n1'),'7, 5, 3'));
});

test('accounts, ownership, server persistence, CSRF, hints, and automatic multipart marking work end to end',async()=>{
  const dir=mkdtempSync(join(tmpdir(),'partc-test-'));const dbPath=join(dir,'test.sqlite');
  let {app,db}=createApp({dbPath});let server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));let base=`http://127.0.0.1:${server.address().port}`;
  const request=async(path,body,session={})=>{const response=await fetch(base+'/api'+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json','X-Requested-With':'PartC',...(session.cookie?{Cookie:session.cookie}:{}),...(session.csrf?{'X-CSRF-Token':session.csrf}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:response.status,data:await response.json(),cookie:response.headers.get('set-cookie')?.split(';')[0]};};
  try{
    assert.equal((await request('/progress')).status,401);
    const register=await request('/register',{username:'student_a',name:'Student A',password:'long-testing-password'});assert.equal(register.status,201);
    const a={cookie:register.cookie,csrf:register.data.csrf};
    assert.equal((await request('/register',{username:'STUDENT_A',name:'Duplicate',password:'long-testing-password'})).status,409);
    assert.equal((await request('/login',{username:'student_a',password:'wrong-password'})).status,401);
    assert.equal((await request('/lessons/why-nla',{read:true,tab:'learn'},{cookie:a.cookie})).status,403);
    const origin=await fetch(base+'/api/lessons/why-nla',{method:'POST',headers:{'Content-Type':'application/json','X-Requested-With':'PartC','X-CSRF-Token':a.csrf,Cookie:a.cookie,Origin:'https://evil.example'},body:JSON.stringify({read:true,tab:'learn'})});assert.equal(origin.status,403);
    assert.equal((await request('/lessons/why-nla',{read:true,tab:'learn'},a)).status,200);
    const wrong=await request('/exercises/w3',{action:'check',answer:'2,1'},a);assert.equal(wrong.data.lastCorrect,false);
    const right=await request('/exercises/w3',{action:'check',answer:'2,-1'},a);assert.equal(right.data.state.independent,1);assert.equal(right.data.state.attempts,2);
    await request('/exercises/nm3',{action:'hint'},a);
    const assisted=await request('/exercises/nm3',{action:'check',answer:'1/12'},a);assert.equal(assisted.data.state.correct,1);assert.equal(assisted.data.state.independent,0);
    const checked=exerciseMap.get('w5-auto');
    const answers=checked.parts.map(p=>p.type==='numeric'?p.answer.join(','):p.answer);
    const partial=await request('/exercises/w5-auto',{action:'check',answer:JSON.stringify(['wrong',...answers.slice(1)])},a);
    assert.equal(partial.data.lastCorrect,false);assert.equal(partial.data.parts[0],false);assert(partial.data.parts.slice(1).every(Boolean));
    const auto=await request('/exercises/w5-auto',{action:'check',answer:JSON.stringify(answers)},a);
    assert.equal(auto.data.lastCorrect,true);assert.equal(auto.data.state.independent,1);
    assert.equal((await request('/exercises/w5-auto',{action:'review'},a)).status,400);
    const chapterAnswer=JSON.stringify(['6,4','2','1','0']);
    assert.equal((await request('/lessons/svd-approximation',{read:true,tab:'practice'},a)).status,200);
    const chapterCheck=await request('/exercises/svd-d7',{action:'check',answer:chapterAnswer},a);
    assert.equal(chapterCheck.data.lastCorrect,true);assert(chapterCheck.data.parts.every(Boolean));
    const minmaxAnswer=JSON.stringify(['5,8','1','2']);
    assert.equal((await request('/lessons/minmax-principle',{read:true,tab:'practice'},a)).status,200);
    const minmaxWrong=await request('/exercises/cf-a6',{action:'check',answer:JSON.stringify(['5,7','1','2'])},a);
    assert.equal(minmaxWrong.data.lastCorrect,false);assert.deepEqual(minmaxWrong.data.parts,[false,true,true]);
    const minmaxCheck=await request('/exercises/cf-a6',{action:'check',answer:minmaxAnswer},a);
    assert.equal(minmaxCheck.data.lastCorrect,true);assert(minmaxCheck.data.parts.every(Boolean));
    const publicCourse=(await request('/course')).data;
    assert.equal(publicCourse.chapters.length,9);assert.equal(publicCourse.lessons.length,42);
    assert(publicCourse.exercises.every(e=>!('rubric' in e)&&!('answer' in e)&&!('solution' in e)&&(e.parts||[]).every(p=>!('answer' in p))));
    const luAnswer=JSON.stringify(['1/4,1/2','2/11','0']);
    assert.equal((await request('/lessons/lu-pivoting',{read:true,tab:'practice'},a)).status,200);
    const luWrong=await request('/exercises/lu-c5',{action:'check',answer:JSON.stringify(['1/2,1/4','2/11','0'])},a);
    assert.equal(luWrong.data.lastCorrect,false);assert.deepEqual(luWrong.data.parts,[false,true,true]);
    const luCheck=await request('/exercises/lu-c5',{action:'check',answer:luAnswer},a);
    assert.equal(luCheck.data.lastCorrect,true);assert(luCheck.data.parts.every(Boolean));
    const qrAnswer=JSON.stringify(['0','2','1']);
    assert.equal((await request('/lessons/qr-least-squares',{read:true,tab:'practice'},a)).status,200);
    const qrWrong=await request('/exercises/qr-d6',{action:'check',answer:JSON.stringify(['1','2','1'])},a);
    assert.equal(qrWrong.data.lastCorrect,false);assert.deepEqual(qrWrong.data.parts,[false,true,true]);
    const qrCheck=await request('/exercises/qr-d6',{action:'check',answer:qrAnswer},a);
    assert.equal(qrCheck.data.lastCorrect,true);assert(qrCheck.data.parts.every(Boolean));
    const stabilityAnswer=JSON.stringify(['2','0','1']);
    assert.equal((await request('/lessons/stability-conditioning',{read:true,tab:'practice'},a)).status,200);
    const stabilityWrong=await request('/exercises/st-c6',{action:'check',answer:JSON.stringify(['0','0','1'])},a);
    assert.equal(stabilityWrong.data.lastCorrect,false);assert.deepEqual(stabilityWrong.data.parts,[false,true,true]);
    const stabilityCheck=await request('/exercises/st-c6',{action:'check',answer:stabilityAnswer},a);
    assert.equal(stabilityCheck.data.lastCorrect,true);assert(stabilityCheck.data.parts.every(Boolean));
    const eigenAnswer=JSON.stringify(['1','0','2']);
    assert.equal((await request('/lessons/eigen-schur',{read:true,tab:'practice'},a)).status,200);
    const eigenWrong=await request('/exercises/eig-b6',{action:'check',answer:JSON.stringify(['0','0','2'])},a);
    assert.equal(eigenWrong.data.lastCorrect,false);assert.deepEqual(eigenWrong.data.parts,[false,true,true]);
    const eigenCheck=await request('/exercises/eig-b6',{action:'check',answer:eigenAnswer},a);
    assert.equal(eigenCheck.data.lastCorrect,true);assert(eigenCheck.data.parts.every(Boolean));
    const qralgAnswer=JSON.stringify(['1','0','2']);
    assert.equal((await request('/lessons/qralg-iteration',{read:true,tab:'practice'},a)).status,200);
    const qralgWrong=await request('/exercises/qra-a6',{action:'check',answer:JSON.stringify(['0','0','2'])},a);
    assert.equal(qralgWrong.data.lastCorrect,false);assert.deepEqual(qralgWrong.data.parts,[false,true,true]);
    const qralgCheck=await request('/exercises/qra-a6',{action:'check',answer:qralgAnswer},a);
    assert.equal(qralgCheck.data.lastCorrect,true);assert(qralgCheck.data.parts.every(Boolean));
    const spectralAnswer=JSON.stringify(['1','0','2']);
    assert.equal((await request('/lessons/spectral-symmetric',{read:true,tab:'practice'},a)).status,200);
    const spectralWrong=await request('/exercises/sp-a6',{action:'check',answer:JSON.stringify(['0','0','2'])},a);
    assert.equal(spectralWrong.data.lastCorrect,false);assert.deepEqual(spectralWrong.data.parts,[false,true,true]);
    const spectralCheck=await request('/exercises/sp-a6',{action:'check',answer:spectralAnswer},a);
    assert.equal(spectralCheck.data.lastCorrect,true);assert(spectralCheck.data.parts.every(Boolean));
    const bResult=await request('/register',{username:'student_b',name:'Student B',password:'another-long-password'});const b={cookie:bResult.cookie,csrf:bResult.data.csrf};
    assert.deepEqual((await request('/progress',null,b)).data,{lessons:[],exercises:[]});
    const forged=await request('/exercises/w3',{action:'save',answer:'Other account draft',user_id:db.prepare('SELECT id FROM users WHERE username=?').get('student_a').id},b);assert.equal(forged.status,200);
    assert.equal((await request('/progress',null,a)).data.exercises.find(e=>e.exercise_id==='w3').answer,'2,-1');
    await new Promise(r=>server.close(r));db.close();
    ({app,db}=createApp({dbPath}));server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));base=`http://127.0.0.1:${server.address().port}`;
    const persisted=(await request('/progress',null,a)).data;assert.equal(persisted.exercises.find(e=>e.exercise_id==='svd-d7').answer,chapterAnswer);assert.equal(persisted.lessons.find(l=>l.lesson_id==='svd-approximation').is_read,1);assert.equal(persisted.lessons[0].is_read,1);assert.equal(persisted.exercises.find(e=>e.exercise_id==='w5-auto').answer,JSON.stringify(answers));
    const secondBrowser=await request('/login',{username:'STUDENT_A',password:'long-testing-password'});assert.equal(secondBrowser.status,200);assert.notEqual(secondBrowser.cookie,a.cookie);
    assert.equal(persisted.exercises.find(e=>e.exercise_id==='cf-a6').answer,minmaxAnswer);
    assert.equal(persisted.lessons.find(l=>l.lesson_id==='minmax-principle').is_read,1);
    assert.equal(persisted.exercises.find(e=>e.exercise_id==='lu-c5').answer,luAnswer);
    assert.equal(persisted.lessons.find(l=>l.lesson_id==='lu-pivoting').is_read,1);
    assert.equal(persisted.exercises.find(e=>e.exercise_id==='qr-d6').answer,qrAnswer);
    assert.equal(persisted.lessons.find(l=>l.lesson_id==='qr-least-squares').is_read,1);
    assert.equal(persisted.exercises.find(e=>e.exercise_id==='st-c6').answer,stabilityAnswer);
    assert.equal(persisted.lessons.find(l=>l.lesson_id==='stability-conditioning').is_read,1);
    assert.equal(persisted.exercises.find(e=>e.exercise_id==='eig-b6').answer,eigenAnswer);
    assert.equal(persisted.lessons.find(l=>l.lesson_id==='eigen-schur').is_read,1);
    assert.equal(persisted.exercises.find(e=>e.exercise_id==='qra-a6').answer,qralgAnswer);
    assert.equal(persisted.lessons.find(l=>l.lesson_id==='qralg-iteration').is_read,1);
    assert.equal(persisted.exercises.find(e=>e.exercise_id==='sp-a6').answer,spectralAnswer);
    assert.equal(persisted.lessons.find(l=>l.lesson_id==='spectral-symmetric').is_read,1);
    const otherSession={cookie:secondBrowser.cookie,csrf:secondBrowser.data.csrf};assert.deepEqual((await request('/progress',null,otherSession)).data,persisted);
    await request('/logout',{},a);assert.equal((await request('/progress',null,a)).status,401);assert.equal((await request('/progress',null,otherSession)).status,200);
  }finally{await new Promise(r=>server.close(r));db.close();}
});

 test('every exercise is automatically marked, including every proof part',()=>{
   for(const e of exercises){
     assert(['numeric','choice','multi'].includes(e.type));
     const answer=p=>p.type==='numeric'?p.answer.join(','):p.answer;
     if(e.type==='multi'){
       const values=e.parts.map(answer);
       assert(grade(e,JSON.stringify(values)),e.id);
       for(let i=0;i<values.length;i++){const wrong=[...values];wrong[i]='wrong';assert(!grade(e,JSON.stringify(wrong)),e.id+':'+i);}
       for(const bad of ['null','{}','[]','[1]','invalid'])assert(!grade(e,bad));
     } else assert(grade(e,answer(e)),e.id);
   }
 });

 test('chapter membership is complete, unique, and compatible with original lesson ids',()=>{
   assert.deepEqual(chapters[0].lessonIds,['why-nla','structure','norms','cost']);
   assert.equal(new Set(chapters.flatMap(c=>c.lessonIds)).size,lessons.length);
   for(const l of lessons)assert(chapters.find(c=>c.id===l.chapter).lessonIds.includes(l.id));
   for(const e of exercises)assert(lessons.some(l=>l.id===e.lesson));
   const raw=JSON.stringify(exercises.filter(e=>e.lesson.startsWith('svd-')));
   assert(!/lecture notes|source pages|rubric/.test(raw));
 });
 test('every chapter belongs to a course, ids are unique across courses, and every lesson has its Markdown',()=>{
   const courseIds=new Set(courses.map(c=>c.id));
   assert.equal(courseIds.size,courses.length);
   assert.equal(new Set(chapters.map(c=>c.id)).size,chapters.length);
   for(const c of chapters){assert(courseIds.has(c.course),`chapter ${c.id} names unknown course ${c.course}`);assert(Number.isInteger(c.number)&&c.number>0);}
   for(const id of courseIds){const numbers=chapters.filter(c=>c.course===id).map(c=>c.number);assert.equal(new Set(numbers).size,numbers.length,`duplicate chapter number in ${id}`);}
   for(const l of lessons)assert(existsSync(new URL(`../content/${l.file||l.id}.md`,import.meta.url)),`missing Markdown for ${l.id}`);
 });
 test('compression factors reconstruct the actual image and obey SVD tail identities',()=>{
   const d=JSON.parse(readFileSync(new URL('../content/compression-data.json',import.meta.url),'utf8'));
   const {size:n,u,vt,singularValues:s,pixels:a}=d;
   for(let l=0;l<n;l++){
     assert(s[l]>=0);if(l)assert(s[l-1]>=s[l]);
     for(let h=0;h<n;h++){
       let left=0,right=0;for(let i=0;i<n;i++){left+=u[i][l]*u[i][h];right+=vt[l][i]*vt[h][i];}
       assert(Math.abs(left-(l===h?1:0))<1e-10);assert(Math.abs(right-(l===h?1:0))<1e-10);
     }
   }
   for(const k of [0,1,5,10,20,n]){
     let residualSquared=0;
     for(let i=0;i<n;i++)for(let j=0;j<n;j++){
       let x=0;for(let l=0;l<k;l++)x+=u[i][l]*s[l]*vt[l][j];residualSquared+=(a[i][j]-x)**2;
     }
     assert(Math.abs(residualSquared-s.slice(k).reduce((sum,x)=>sum+x*x,0))<1e-8);
     if(k===n)assert(residualSquared<1e-20);
   }
 });
