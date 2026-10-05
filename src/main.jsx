import {api,setCsrf} from './api';
import React,{useState,useEffect,useRef} from 'react';
import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import {Check,ChevronDown,ChevronLeft,ChevronRight,Menu,X,LogOut,LoaderCircle,Lightbulb,ArrowUp,ArrowRight,Sun,Moon,BookOpen,Search,Library as LibraryIcon} from 'lucide-react';
import {MathText,slug} from './MathText';
import Lab from './Labs';
import {reveal,useIndicator,useScrollSpy,prefersReducedMotion} from './motion';
import {Seal,WaxSeal,InkTick,InkCross,Rule,Skyline} from './Ornaments';
import {courses,courseById,chapterById,chapterOfLesson,chaptersOf,lessonOrder,articleOf,toRoman,chapterOrdinal,ordinalWord,readRoute,pageKey,homeHash} from './structure';
import '@fontsource/eb-garamond/400.css';
import '@fontsource/eb-garamond/400-italic.css';
import '@fontsource/eb-garamond/500.css';
import '@fontsource/eb-garamond/600.css';
import '@fontsource/eb-garamond/600-italic.css';
import '@fontsource/cinzel/500.css';
import '@fontsource/cinzel/600.css';
import 'katex/dist/katex.min.css';
import './style.css';
const levels=['','Recognise','Calculate with support','Solve independently','Explain & prove','Transfer & investigate'];
// [route id, English title, Latin gloss]
const sections=[['learn','Lecture','lectio'],['explore','Demonstration','demonstratio'],['practice','Problem sheet','exercitatio'],['mastery','Collections','examen']];
const spineColours=['#002147','#7a1b2a','#2f4a2a','#5b3a1a','#2b3b5c'];
const blankProgress={lessons:[],exercises:[]};
function scrollToRoute(route,behavior='instant'){
  if(route.view!=='lesson'||route.section==='learn'){window.scrollTo({top:0,behavior});return;}
  document.getElementById(`lesson-${route.lesson}-${route.section}`)?.scrollIntoView({block:'start',behavior});
}
const smooth=()=>prefersReducedMotion()?'instant':'smooth';
// Page turns use the View Transitions API where available.
function transition(update,after){if(!document.startViewTransition||prefersReducedMotion()){update();return;}document.startViewTransition(()=>{flushSync(update);after?.();});}

// Theme preference only; no learning data is kept in browser storage.
function initialTheme(){try{const saved=localStorage.getItem('partc-theme');if(saved==='light'||saved==='dark')return saved;}catch{}return matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}
function useTheme(){const[theme,setTheme]=useState(initialTheme);useEffect(()=>{document.documentElement.dataset.theme=theme;document.querySelector('meta[name=theme-color]')?.setAttribute('content',theme==='dark'?'#0b1524':'#002147');},[theme]);const toggle=()=>{const next=theme==='dark'?'light':'dark';try{localStorage.setItem('partc-theme',next);}catch{}transition(()=>setTheme(next));};return [theme,toggle];}

function AuthDialog({onClose,onAuth}){
  const[register,setRegister]=useState(false);const[busy,setBusy]=useState(false);const[error,setError]=useState('');const[closing,setClosing]=useState(false);const dialog=useRef();
  useEffect(()=>{dialog.current.showModal();},[]);
  const close=()=>{if(prefersReducedMotion())onClose();else setClosing(true);};
  async function submit(e){e.preventDefault();setBusy(true);setError('');try{const values=Object.fromEntries(new FormData(e.currentTarget));const result=await api(register?'/register':'/login',values);setCsrf(result.csrf);await onAuth(result.user);close();}catch(err){setError(err.message);}finally{setBusy(false);}}
  return <dialog ref={dialog} className={`reader-card ${closing?'closing':''}`} onCancel={e=>{e.preventDefault();close();}} onAnimationEnd={e=>{if(closing&&e.target===dialog.current)onClose();}}>
    <div className="card-band"><Seal size={34}/><div><span>Part C</span><b>{register?'Application for a reader’s card':'Reader’s card'}</b></div><button className="icon-button" aria-label="Close account dialog" onClick={close}><X size={19}/></button></div>
    <div className="card-body" key={String(register)}>
      <p className="card-note">{register?'Admit the bearer to the textbook. Your answers and progress are kept on this server, not in the browser.':'Sign in to resume your reading. Answers and progress are kept on the textbook server, so any browser will do.'}</p>
      <form onSubmit={submit}>{register&&<label>Name of reader<input name="name" required maxLength={60} autoComplete="name"/></label>}<label>Username<input name="username" required minLength={3} maxLength={32} pattern="[a-zA-Z0-9_-]+" autoComplete="username" autoCapitalize="none" spellCheck={false}/></label><label>Password<input name="password" type="password" required minLength={register?12:1} maxLength={128} autoComplete={register?'new-password':'current-password'}/></label>{register&&<small>At least twelve characters. No email address is required.</small>}{error&&<p className="error" role="alert">{error}</p>}<button className="primary full" disabled={busy}>{busy?<LoaderCircle className="spin" size={18}/>:null}{register?'Issue my card':'Sign in'}</button></form>
      <button className="text-button" onClick={()=>{setRegister(!register);setError('');}}>{register?'Already a reader? Sign in':'New reader? Apply for a card'}</button>
    </div>
  </dialog>;
}

function CheckedParts({exercise,answer,onChange,disabled,results}) {
  let values=[];try{values=JSON.parse(answer);}catch{}
  if(!Array.isArray(values))values=[];
  function update(i,value){const next=exercise.parts.map((_,j)=>j===i?value:(values[j]||''));onChange(JSON.stringify(next));}
  return <ol className="checked-parts" type="a">{exercise.parts.map((part,i)=><li key={i}><fieldset disabled={disabled} className="checked-part"><legend className="sr-only">Part {String.fromCharCode(97+i)}</legend><MathText>{part.prompt}</MathText>{part.type==='choice'?<div className="answers">{part.options.map(([value,label])=><label key={value} className={values[i]===value?'chosen':''}><input type="radio" name={`${exercise.id}-${i}`} checked={values[i]===value} onChange={()=>update(i,value)}/><MathText>{label}</MathText></label>)}</div>:<label className="answer-label">Answer to ({String.fromCharCode(97+i)})<input value={values[i]||''} maxLength={500} placeholder="Number, fraction, or comma-separated values" onChange={e=>update(i,e.target.value)}/></label>}{results&&<p className={`mark ${results[i]?'right':'retry'}`} role="status">{results[i]?<><InkTick size={22}/>Correct</>:<><InkCross size={16}/>Look again at this part.</>}</p>}</fieldset></li>)}</ol>;
}

function Question({exercise:e,number,state={},onState,user,onAuth,dirtyChange}){
  const[answer,setAnswer]=useState(state.answer||'');const[saved,setSaved]=useState(state.answer||'');const[hints,setHints]=useState([]);const[solution,setSolution]=useState(null);const[feedback,setFeedback]=useState('');const[error,setError]=useState('');const[busy,setBusy]=useState(false);const[correct,setCorrect]=useState(null);const[partResults,setPartResults]=useState(null);const[showSolution,setShowSolution]=useState(false);const[attempt,setAttempt]=useState(0);
  const dirty=answer!==saved;
  useEffect(()=>{dirtyChange(e.id,dirty);return()=>dirtyChange(e.id,false);},[dirty,e.id,dirtyChange]);
  useEffect(()=>{if(user&&(state.hints_used||state.solution_seen))api(`/exercises/${e.id}/revealed`).then(d=>{setHints(d.hints);setSolution(d.solution);}).catch(err=>setError(err.message));},[e.id,user?.username]);
  async function action(kind){if(!user){onAuth();return;}setBusy(true);setError('');try{if(dirty&&!['save','check'].includes(kind)){const r=await api(`/exercises/${e.id}`,{action:'save',answer});setSaved(answer);onState(r.state);}const data=await api(`/exercises/${e.id}`,{action:kind,answer});onState(data.state);setPartResults(data.parts||null);setHints(data.hints);setSolution(data.solution);setFeedback(data.feedback);setCorrect(data.lastCorrect??null);setAttempt(a=>a+1);if(['save','check'].includes(kind))setSaved(answer);if(kind==='solution')setShowSolution(true);}catch(err){setError(err.message);}finally{setBusy(false);}}
  const edit=value=>{setAnswer(value);setFeedback('');setPartResults(null);};
  return <article ref={reveal} data-reveal className={`question ${state.correct?'is-done':''}`} id={e.id}>
    <div className="q-number" aria-hidden="true">{number}.</div>
    <div className="q-body">
      <header className="q-head"><div><p className="q-level">{e.mastery?'Collections · without notes':`Level ${toRoman(e.level)} · ${levels[e.level]}`}</p><h3><span className="sr-only">Question {number}. </span>{e.title}</h3></div>{state.independent?<span className="q-mark independent" title="Answered independently"><InkTick/>independent</span>:state.correct?<span className="q-mark" title="Completed with support"><InkTick/>with support</span>:null}</header>
      <MathText>{e.prompt}</MathText>
      {e.type==='multi'?<CheckedParts exercise={e} answer={answer} disabled={busy||!user} results={partResults} onChange={edit}/>:e.type==='choice'?<fieldset className="answers" disabled={busy||!user}><legend className="sr-only">Choose your answer</legend>{e.options.map(([v,label],i)=><label key={v} className={answer===v?'chosen':''}><input type="radio" name={e.id} value={v} checked={answer===v} onChange={()=>edit(v)}/><span className="option-letter">({String.fromCharCode(97+i)})</span><MathText>{label}</MathText></label>)}</fieldset>:<label className="answer-label">Your answer<input disabled={!user} value={answer} maxLength={500} placeholder="Enter a number, fraction, or comma-separated values" onChange={ev=>edit(ev.target.value)} onKeyDown={ev=>{if(ev.key==='Enter'&&answer.trim()&&!busy)action('check');}}/>{e.type==='numeric'&&<small>Decimals or fractions such as 1/12; separate several values with commas. Tolerance 0.000001 × max(1, |expected value|).</small>}</label>}
      <div className="q-actions"><button className="primary" disabled={busy||!answer.trim()} onClick={()=>action('check')}>{busy?<LoaderCircle size={16} className="spin"/>:null}Submit for marking</button><button className="secondary" disabled={busy||!dirty} onClick={()=>action('save')}>Save draft</button><span className={`save-note ${dirty?'dirty':saved?'saved':''}`}>{dirty?'Unsaved changes':saved?'Saved to your account':''}</span></div>
      {feedback&&<p key={attempt} className={`mark ${correct===false?'retry':correct===true?'right':''}`} role="status">{correct===true?<InkTick/>:correct===false?<InkCross/>:null}<span>{feedback}</span></p>}
      {error&&<p className="error" role="alert">{error}</p>}
      <div className="help-row"><button disabled={busy||hints.length>=e.hintCount} onClick={()=>action('hint')}><Lightbulb size={15}/>Consult hint {Math.min(hints.length+1,e.hintCount)} of {e.hintCount}</button><button disabled={busy} aria-expanded={!!(solution&&showSolution)} onClick={()=>solution?setShowSolution(!showSolution):action('solution')}><ChevronDown size={15}/>{showSolution?'Put the solution away':'Read the worked solution'}</button></div>
      {hints.map((hint,i)=><aside className="hint" key={i}><b>Hint {toRoman(i+1).toLowerCase()}</b><MathText>{hint}</MathText></aside>)}
      {solution&&<div className="collapsible" data-open={showSolution} aria-hidden={!showSolution}><div><div className="solution"><p className="solution-head">Worked solution</p><MathText>{solution}</MathText></div></div></div>}
      <p className="q-foot">{state.attempts?`${state.attempts} attempt${state.attempts===1?'':'s'} marked · `:''}{state.hints_used||state.solution_seen?'Help consulted is recorded.':'Hints and solutions are optional; consulting them records a supported attempt.'}</p>
    </div>
  </article>;
}

function PartHead({num,id,children,lead}){const[,title,latin]=sections.find(s=>s[0]===id);return <header className="part-head" ref={reveal} data-reveal><p className="part-num">§ {num}</p><h2>{title}</h2><p className="part-latin">{latin}</p><Rule/>{lead&&<p className="part-lead">{lead}</p>}{children}</header>;}

/** Where you are: Library › course › chapter › lesson. Every step but the last is a link. */
function Crumbs({route,lesson,go}){
  const course=courseById[route.course];const chapter=chapterById[route.chapter];
  const steps=[['library','Library']];
  if(course)steps.push([`course/${course.id}`,`${course.code} ${course.title}`]);
  if(chapter)steps.push([`chapter/${chapter.id}`,`Chapter ${toRoman(chapter.number)}`]);
  if(lesson)steps.push([null,`Lesson ${toRoman(Number(lesson.number))}`]);
  if(route.view!=='lesson')steps[steps.length-1][0]=null;
  return <nav className="crumbs" aria-label="Breadcrumb"><ol>{steps.map(([hash,label])=><li key={label}>{hash?<button onClick={()=>go(hash)}>{label}</button>:<span aria-current="page">{label}</span>}</li>)}</ol></nav>;
}

function MarginContents({lesson,headings,activeSection,go}){
  const ids=headings.map(h=>`${lesson.id}-${slug(h)}`);const activeHeading=useScrollSpy(ids,.25);const[ref,style]=useIndicator(activeHeading);
  return <nav className="margin-contents" aria-label={`${lesson.short} contents`}><p className="margin-label">Contents</p><ol>{sections.map(([id,title],i)=><li key={id} data-active={activeSection===id}><button aria-current={activeSection===id?'location':undefined} onClick={()=>go(`lesson/${lesson.id}/${id}`)}><span>§ {toRoman(i+1)}</span>{title}</button>{id==='learn'&&<div className="sub" ref={ref}><span className="sub-indicator" style={{...style,width:2,...(activeSection!=='learn'&&{opacity:0})}}/>{headings.map((h,j)=><button key={h} data-active={activeHeading===ids[j]} onClick={()=>document.getElementById(ids[j])?.scrollIntoView({block:'start',behavior:smooth()})}>{h.replace(/^\d+\. /,'')}</button>)}</div>}</li>)}</ol></nav>;
}

function SectionBar({lesson,active,go}){
  const[ref,style]=useIndicator(active);
  return <div className="section-bar"><nav ref={ref} aria-label={`${lesson.short} sections`}><span className="bar-indicator" style={style}/>{sections.map(([id,title],i)=><button key={id} data-active={active===id} onClick={()=>go(`lesson/${lesson.id}/${id}`)}><span>§{toRoman(i+1)}</span> {title}</button>)}</nav></div>;
}

/** A previous/next pair that names where each link leads, including across chapters. */
function Neighbours({prev,next,go,end}){
  const label=(l,dir)=>{const c=chapterOfLesson[l.id];return <><small>{dir} · Chapter {toRoman(c.number)}, Lesson {toRoman(Number(l.number))}</small><strong>{l.title}</strong></>;};
  return <nav className="neighbours" aria-label="Previous and next lessons">
    {prev?<button className="neighbour prev" onClick={()=>go(`lesson/${prev.id}/learn`)}><ChevronLeft size={20}/><span>{label(prev,chapterOfLesson[prev.id]!==end.chapter?`Back to Chapter the ${chapterOrdinal(chapterOfLesson[prev.id])}`:'Previous')}</span></button>:<span/>}
    {next?<button className="neighbour next" onClick={()=>go(`lesson/${next.id}/learn`)}><span>{label(next,chapterOfLesson[next.id]!==end.chapter?`Turn to Chapter the ${chapterOrdinal(chapterOfLesson[next.id])}`:'Next')}</span><ChevronRight size={20}/></button>:<button className="neighbour next" onClick={()=>go(`course/${end.course.id}`)}><span><small>Here ends {end.course.code}, as written so far</small><strong>Return to the course contents</strong></span><ChevronRight size={20}/></button>}
  </nav>;
}

function Lesson({lesson,chapter,data,prev,next,stateMap,lessonState,user,onAuth,onState,dirtyChange,onRead,saveMessage,go,route}) {
  const practice=data.exercises.filter(e=>e.lesson===lesson.id&&!e.mastery);
  const mastery=data.exercises.filter(e=>e.lesson===lesson.id&&e.mastery);
  const independent=mastery.filter(e=>stateMap[e.id]?.independent).length;
  const mastered=mastery.every(e=>stateMap[e.id]?.independent);
  const solved=practice.filter(e=>stateMap[e.id]?.correct).length;
  const article=articleOf(lesson);
  const headings=article.split('\n').filter(s=>s.startsWith('## ')).map(s=>s.slice(3));
  const active=useScrollSpy(sections.map(([id])=>`lesson-${lesson.id}-${id}`),.35)?.split('-').pop()||'learn';
  const n=Number(lesson.number);const read=!!lessonState?.is_read;const course=courseById[chapter.course];
  const question=(e,i)=><Question key={e.id+':'+(user?.username||'guest')} number={i+1} exercise={e} state={stateMap[e.id]} onState={onState} user={user} onAuth={onAuth} dirtyChange={dirtyChange}/>;
  return <article className="lesson" data-lesson={lesson.id} aria-labelledby={`lesson-${lesson.id}-title`}>
    <header className="opener stagger" id={`lesson-${lesson.id}-learn`}>
      <Crumbs route={route} lesson={lesson} go={go}/>
      <p className="opener-kicker">Chapter the {chapterOrdinal(chapter)} · Lesson the {ordinalWord(n)}</p>
      <div className="opener-numeral" aria-hidden="true">{toRoman(n)}</div>
      <h1 id={`lesson-${lesson.id}-title`}>{lesson.title}</h1>
      <Rule/>
      <p className="opener-lead">{lesson.description}</p>
      <p className="opener-meta">{lesson.readTime} of reading <i>·</i> {practice.length} problems <i>·</i> {mastery.length} questions in Collections{read&&<> <i>·</i> <span className="read-flag">read</span></>}</p>
    </header>
    <SectionBar lesson={lesson} active={active} go={go}/>
    <div className="spread">
      <aside className="margin-left"><MarginContents lesson={lesson} headings={headings} activeSection={active} go={go}/></aside>
      <div className="column">
        <section className="synopsis" ref={reveal} data-reveal><p className="margin-label">Synopsis</p><p className="synopsis-intro">After this lesson you should be able to:</p><ol>{lesson.objectives.map(o=><li key={o}>{o}</li>)}</ol></section>
        <MathText article idPrefix={`${lesson.id}-`}>{article}</MathText>
        <div className="end-mark" data-read={read}><Rule/><p className="end-title">{read?'You have read this lecture':'Here ends the lecture'}</p><p>{read?'Your place is saved. The demonstration and problem sheet follow.':'Record it as read to keep your place in the book.'}</p><button className={read?'secondary':'primary'} onClick={()=>onRead(lesson.id)}>{read?<><Check size={16}/>Read · mark unread</>:<><BookOpen size={16}/>Mark the lecture as read</>}</button><p className="save-confirm" role="status">{saveMessage}</p></div>
      </div>
      <aside className="margin-right"><div className="marginalia">
        <p className="margin-label">Your progress</p>
        <dl><div><dt>Lecture</dt><dd>{read?'Read':'Unread'}</dd></div><div><dt>Problem sheet</dt><dd>{solved} of {practice.length}</dd></div></dl>
        <div className="ink-meter"><div style={{width:`${practice.length?solved/practice.length*100:0}%`}}/></div>
        <div className="margin-seal"><WaxSeal passed={mastered} count={independent} size={64}/><p>{mastered?'Collections passed':'Collections'}<small>{independent} of {mastery.length} independent</small></p></div>
      </div></aside>
      <div className="activities">
        <section id={`lesson-${lesson.id}-explore`} className="part">
          <PartHead num="II" id="explore" lead="Change the inputs and watch the mathematics respond. Make a prediction first, then check it."/>
          <Lab type={lesson.lab}/>
        </section>
        <section id={`lesson-${lesson.id}-practice`} className="part">
          <PartHead num="III" id="practice" lead="Work in order, from definitions and calculations to proofs and applications. Every answer is marked automatically.">{!user&&<p className="signin-note">Reading is open to all. <button onClick={onAuth}>Sign in with your reader’s card</button> to submit answers, consult help, and keep your work.</p>}</PartHead>
          <div className="paper"><p className="paper-head"><span>Problem sheet {toRoman(chapter.number)}.{n}</span><span>{lesson.short}</span></p>{practice.map(question)}</div>
        </section>
        <section id={`lesson-${lesson.id}-mastery`} className="part">
          <PartHead num="IV" id="mastery" lead="Questions under exam conditions: no notes, hints, or solutions. Supported answers still count as completed, but not as independent."/>
          <div className="paper exam"><div className="exam-head"><div><p className="exam-title">Collections · Chapter {toRoman(chapter.number)}, Lesson {toRoman(n)}</p><p className="exam-rubric">Answer all {mastery.length} questions. Time allowed: as long as you need.</p></div><WaxSeal passed={mastered} count={independent}/></div>{mastery.map(question)}</div>
        </section>
        <footer className="turn-page"><Rule/><Neighbours prev={prev} next={next} go={go} end={{chapter,course}}/><p className="kbd-hint">Tip: press <kbd>[</kbd> or <kbd>]</kbd> for the previous or next lesson, and <kbd>/</kbd> to find any lesson.</p><button className="text-button" onClick={()=>go(`lesson/${lesson.id}/learn`)}><ArrowUp size={14}/>Back to the start of this lesson</button></footer>
      </div>
    </div>
  </article>;
}

function LessonRow({lesson,s,go}){
  return <li><button className="toc-row" onClick={()=>go(`lesson/${lesson.id}/learn`)}><span className="toc-num">{toRoman(Number(lesson.number))}</span><span className="toc-main"><span className="toc-line"><strong>{lesson.title}</strong><span className="toc-leader"/><span className="toc-page">{s.done}/{s.total}</span></span><em>{lesson.description}</em><span className="toc-status">{lesson.readTime}{s.read>0&&<> · <b>read</b></>}</span></span>{s.mastered?<WaxSeal passed size={44}/>:<span className="toc-seal-space"/>}</button></li>;
}

/** Chapter contents, with the neighbouring chapters on either side. */
function ChapterPage({chapter,lessonById,stats,resume,go,route}){
  const course=courseById[chapter.course];
  const lessons=chapter.lessonIds.map(id=>lessonById[id]).filter(Boolean);const s=stats(chapter.lessonIds);
  const siblings=chaptersOf(course.id);const i=siblings.indexOf(chapter);const prev=siblings[i-1];const next=siblings[i+1];
  const chapterResume=resume&&chapter.lessonIds.includes(resume.lesson_id)?resume:null;
  return <div className="contents-page">
    <header className="frontispiece chapter-front">
      <div className="front-text stagger"><Crumbs route={route} go={go}/><p className="front-chapter">Chapter the {chapterOrdinal(chapter)}</p><div className="opener-numeral" aria-hidden="true">{toRoman(chapter.number)}</div><h1>{chapter.title}</h1><Rule/><p className="opener-lead">{chapter.description}</p>
        {lessons.length>0&&<button className="primary bookmark" onClick={()=>chapterResume?go(`lesson/${chapterResume.lesson_id}/${chapterResume.last_tab}`):go(`lesson/${lessons[0].id}/learn`)}>{chapterResume?'Resume reading':'Begin Lesson I'}<ArrowRight size={17}/></button>}</div>
    </header>
    <section className="toc">
      <h2 className="toc-title">Contents</h2>
      <p className="toc-summary">{lessons.length} lessons · {s.done} of {s.total} problems solved · {s.read} of {lessons.length} read</p>
      {lessons.length?<ol className="stagger">{lessons.map(l=><LessonRow key={l.id} lesson={l} s={stats([l.id])} go={go}/>)}</ol>:<p className="planned-note">This chapter is in preparation.</p>}
    </section>
    <nav className="chapter-neighbours" aria-label="Neighbouring chapters">
      {prev?<button onClick={()=>go(`chapter/${prev.id}`)}><ChevronLeft size={18}/><span><small>Chapter the {chapterOrdinal(prev)}</small>{prev.title}</span></button>:<span/>}
      <button className="to-course" onClick={()=>go(`course/${course.id}`)}><small>{course.code}</small>All chapters</button>
      {next?<button onClick={()=>go(`chapter/${next.id}`)} disabled={!next.lessonIds.length}><span><small>Chapter the {chapterOrdinal(next)}{!next.lessonIds.length&&' · in preparation'}</small>{next.title}</span><ChevronRight size={18}/></button>:<span/>}
    </nav>
  </div>;
}

/** Every chapter of a course, with its lessons, on one page. */
function CoursePage({course,lessonById,stats,resume,go,route}){
  const chs=chaptersOf(course.id);const order=lessonOrder(course.id);const s=stats(order);
  const courseResume=resume&&order.includes(resume.lesson_id)?resume:null;
  return <div className="contents-page">
    <header className="frontispiece">
      <div className="front-text stagger"><Crumbs route={route} go={go}/><p className="opener-kicker">{course.code} · Course contents</p><h1 className="course-title">{course.title}</h1><Rule/><p className="opener-lead">{course.description}</p>
        {order.length>0&&<button className="primary bookmark" onClick={()=>courseResume?go(`lesson/${courseResume.lesson_id}/${courseResume.last_tab}`):go(`lesson/${order[0]}/learn`)}>{courseResume?'Resume reading':'Begin Chapter I'}<ArrowRight size={17}/></button>}</div>
      <Skyline/>
    </header>
    <section className="toc course-toc">
      <h2 className="toc-title">Contents</h2>
      <p className="toc-summary">{chs.length} chapters · {order.length} lessons · {s.done} of {s.total} problems solved</p>
      {chs.map(ch=>{const cs=stats(ch.lessonIds);const planned=!ch.lessonIds.length;return <section key={ch.id} className={`toc-chapter ${planned?'planned':''}`} ref={reveal} data-reveal>
        <button className="toc-chapter-head" disabled={planned} onClick={()=>go(`chapter/${ch.id}`)}><span className="toc-chapter-num">{toRoman(ch.number)}</span><span className="toc-chapter-title"><small>Chapter the {chapterOrdinal(ch)}</small><strong>{ch.title}</strong></span><span className="toc-chapter-progress">{planned?'In preparation':<>{cs.done}/{cs.total}<span className="mini-meter"><span style={{width:`${cs.total?cs.done/cs.total*100:0}%`}}/></span></>}</span></button>
        {!planned&&<ol>{ch.lessonIds.map(id=>lessonById[id]&&<LessonRow key={id} lesson={lessonById[id]} s={stats([id])} go={go}/>)}</ol>}
      </section>;})}
    </section>
  </div>;
}

/** The shelf: one spine per course. */
function LibraryPage({lessonById,stats,resume,go}){
  const resumeLesson=resume&&lessonById[resume.lesson_id];
  return <div className="library-page">
    <header className="library-head stagger"><p className="opener-kicker">Part C</p><h1>The Library</h1><Rule/><p className="opener-lead">{courses.length===1?'One course on the shelf so far, with room for more.':`${courses.length} courses on the shelf.`}</p>
      {resumeLesson&&<button className="primary bookmark" onClick={()=>go(`lesson/${resume.lesson_id}/${resume.last_tab}`)}>Resume · {resumeLesson.short}<ArrowRight size={17}/></button>}</header>
    <ul className="shelf">{courses.map((c,i)=>{const s=stats(lessonOrder(c.id));return <li key={c.id} style={{'--spine':c.color||spineColours[i%spineColours.length],'--h':`${230+Math.min(6,chaptersOf(c.id).length)*14}px`,animationDelay:`${i*.08}s`}}><button className="spine" onClick={()=>go(`course/${c.id}`)} aria-label={`${c.code} ${c.title}: ${s.done} of ${s.total} problems solved`}><span className="spine-code">{c.code}</span><span className="spine-title">{c.title}</span><span className="spine-foot" style={{'--p':s.total?s.done/s.total:0}}/></button></li>;})}<li className="spine-gap" aria-hidden="true"><span>Room for the next course</span></li></ul>
    <div className="shelf-plank" aria-hidden="true"/>
    <section className="course-cards">{courses.map(c=>{const order=lessonOrder(c.id);const s=stats(order);const chs=chaptersOf(c.id);const written=chs.filter(ch=>ch.lessonIds.length).length;return <article key={c.id} className="course-card" ref={reveal} data-reveal>
      <p className="opener-kicker">{c.code}</p><h2>{c.title}</h2><p className="course-desc">{c.description}</p>
      <p className="course-meta">{written} chapter{written===1?'':'s'} written{chs.length>written&&` · ${chs.length-written} in preparation`} · {order.length} lessons</p>
      <div className="course-progress"><span className="mini-meter"><span style={{width:`${s.total?s.done/s.total*100:0}%`}}/></span>{s.done} of {s.total} problems solved</div>
      <ol className="course-chapters">{chs.map(ch=><li key={ch.id}><button disabled={!ch.lessonIds.length} onClick={()=>go(`chapter/${ch.id}`)}><span>{toRoman(ch.number)}</span>{ch.title}</button></li>)}</ol>
      <button className="secondary" onClick={()=>go(`course/${c.id}`)}>Open the course<ArrowRight size={15}/></button>
    </article>;})}</section>
  </div>;
}

/** The navigator: every course, chapter, and lesson in one panel, with search. */
function Navigator({open,route,lessonById,stats,resume,go,account}){
  const[preview,setPreview]=useState(route.course||courses[0].id);const[query,setQuery]=useState('');const input=useRef();
  useEffect(()=>{if(!open)return;setPreview(route.course||courses[0].id);setQuery('');const frame=requestAnimationFrame(()=>{if(matchMedia('(min-width: 981px)').matches)input.current?.focus();});return()=>cancelAnimationFrame(frame);},[open]);
  const q=query.trim().toLowerCase();
  // Title matches rank above matches in descriptions, objectives, or the chapter and course names.
  const score=l=>{const c=chapterOfLesson[l.id];if(!c)return 0;if(`${l.title} ${l.short}`.toLowerCase().includes(q))return 3;if(`${c.title} ${courseById[c.course]?.title} ${courseById[c.course]?.code}`.toLowerCase().includes(q))return 2;return [l.description,...(l.objectives||[])].join(' ').toLowerCase().includes(q)?1:0;};
  const results=q?Object.values(lessonById).map(l=>[score(l),l]).filter(([s])=>s).sort((x,y)=>y[0]-x[0]).map(([,l])=>l).slice(0,12):[];
  const course=courseById[preview];const resumeLesson=resume&&lessonById[resume.lesson_id];
  return <div className="navigator" data-open={open} inert={!open} aria-label="Find your way">
    <div className="nav-top"><label className="nav-search"><Search size={17}/><span className="sr-only">Find a lesson</span><input ref={input} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find a lesson in any course…" onKeyDown={e=>{if(e.key==='Enter'&&results[0])go(`lesson/${results[0].id}/learn`);}}/></label><span className="nav-keys"><kbd>[</kbd><kbd>]</kbd> lessons · <kbd>/</kbd> find · <kbd>Esc</kbd> close</span></div>
    {q?<ol className="nav-results">{results.map(l=>{const c=chapterOfLesson[l.id];return <li key={l.id}><button onClick={()=>go(`lesson/${l.id}/learn`)}><span className="nav-path">{courseById[c.course].code} · Chapter {toRoman(c.number)} · Lesson {toRoman(Number(l.number))}</span><strong>{l.title}</strong></button></li>;})}{!results.length&&<li className="nav-empty">No lesson matches “{query}”.</li>}</ol>
    :<div className="nav-body">
      <div className="nav-courses"><p className="margin-label">Courses</p>{courses.map(c=>{const s=stats(lessonOrder(c.id));return <button key={c.id} data-active={preview===c.id} aria-pressed={preview===c.id} onClick={()=>setPreview(c.id)}><span className="nav-code">{c.code}</span><span className="nav-course-title">{c.title}</span><span className="mini-meter"><span style={{width:`${s.total?s.done/s.total*100:0}%`}}/></span></button>;})}<button className="nav-library" onClick={()=>go('library')}><LibraryIcon size={15}/>The Library</button></div>
      <div className="nav-chapters" key={preview}>
        <div className="nav-chapters-head"><p className="margin-label">{course.code} · {course.title}</p><button className="text-button" onClick={()=>go(`course/${course.id}`)}>Course contents</button></div>
        <div className="nav-grid">{chaptersOf(course.id).map(ch=>{const s=stats(ch.lessonIds);const planned=!ch.lessonIds.length;return <section key={ch.id} className={`nav-chapter ${planned?'planned':''}`} data-current={route.chapter===ch.id}>
          <button className="nav-chapter-title" disabled={planned} onClick={()=>go(`chapter/${ch.id}`)}><span className="band-num">{toRoman(ch.number)}</span><span>{ch.title}</span></button>
          {planned?<p className="nav-planned">In preparation</p>:<><ol>{ch.lessonIds.map(id=>{const l=lessonById[id];if(!l)return null;const ls=stats([id]);return <li key={id}><button data-current={route.lesson===id} onClick={()=>go(`lesson/${id}/learn`)}><span className="nav-lnum">{toRoman(Number(l.number))}</span><span className="nav-ltitle">{l.short}</span>{ls.mastered?<span className="nav-flag sealed" title="Collections passed"/>:ls.read?<Check size={13} className="nav-flag" aria-label="read"/>:null}</button></li>;})}</ol><div className="nav-meter"><span className="mini-meter"><span style={{width:`${s.total?s.done/s.total*100:0}%`}}/></span><small>{s.done}/{s.total}</small></div></>}
        </section>;})}</div>
      </div>
    </div>}
    {resumeLesson&&!q&&<div className="nav-foot"><button onClick={()=>go(`lesson/${resume.lesson_id}/${resume.last_tab}`)}><small>Resume where you left off</small>{courseById[chapterOfLesson[resume.lesson_id]?.course]?.code} · {resumeLesson.title}<ArrowRight size={15}/></button></div>}
    <div className="nav-account">{account}</div>
  </div>;
}

function App(){
  const[data,setData]=useState(null);const[user,setUser]=useState(null);const[progress,setProgress]=useState(blankProgress);const[route,setRoute]=useState(readRoute);const[auth,setAuth]=useState(false);const[menu,setMenu]=useState(false);const[error,setError]=useState('');const[loading,setLoading]=useState(true);const[saveMessages,setSaveMessages]=useState({});const[resume,setResume]=useState(null);
  const[theme,toggleTheme]=useTheme();
  const dirtySet=useRef(new Set());const lastHash=useRef(location.hash);const previousRoute=useRef(readRoute());const scrolledPage=useRef(undefined);const routeRef=useRef(route);routeRef.current=route;
  const band=useRef();const bar=useRef();const toTop=useRef();
  const dirtyChange=React.useCallback((id,dirty)=>{dirty?dirtySet.current.add(id):dirtySet.current.delete(id);},[]);
  const[navRef,navStyle]=useIndicator(pageKey(route));
  useEffect(()=>{let alive=true;Promise.all([api('/course'),api('/session')]).then(async([c,s])=>{if(!alive)return;setData(c);setCsrf(s.csrf);if(s.user){const p=await api('/progress');if(!alive)return;setProgress(p);const last=[...p.lessons].sort((a,b)=>b.updated_at.localeCompare(a.updated_at))[0];if(last)setResume(last);}setUser(s.user);}).catch(e=>setError(e.message)).finally(()=>setLoading(false));return()=>{alive=false;};},[]);
  useEffect(()=>{
    const hash=()=>{
      if(location.hash==='#main-content'){document.getElementById('main-content')?.focus();return;}
      const next=readRoute();const leaving=pageKey(next)!==pageKey(previousRoute.current);
      if(leaving&&dirtySet.current.size&&!confirm('You have unsaved answers. Leave this page without saving them?')){history.replaceState(null,'',lastHash.current||location.pathname);return;}
      if(leaving)dirtySet.current.clear();lastHash.current=location.hash;previousRoute.current=next;
      if(leaving)transition(()=>{setRoute(next);setMenu(false);},()=>{scrolledPage.current=pageKey(next);scrollToRoute(next);});
      else{setRoute(next);setMenu(false);}
    };
    const before=e=>{if(dirtySet.current.size){e.preventDefault();e.returnValue='';}};
    window.addEventListener('hashchange',hash);window.addEventListener('beforeunload',before);
    return()=>{window.removeEventListener('hashchange',hash);window.removeEventListener('beforeunload',before);};
  },[]);
  useEffect(()=>{if(loading)return;const key=pageKey(route);const changed=scrolledPage.current!==key;scrolledPage.current=key;const frame=requestAnimationFrame(()=>scrollToRoute(route,changed?'instant':smooth()));return()=>cancelAnimationFrame(frame);},[route,loading]);
  // Scroll-linked chrome, written straight to the DOM: reading progress, the stuck band, back-to-top.
  useEffect(()=>{let frame=0;const update=()=>{frame=0;const max=document.documentElement.scrollHeight-innerHeight;const y=scrollY;if(bar.current)bar.current.style.transform=`scaleX(${max>0?Math.min(1,y/max):0})`;if(band.current)band.current.dataset.stuck=String(band.current.getBoundingClientRect().top<=0&&y>40);if(toTop.current)toTop.current.dataset.visible=String(y>innerHeight*1.2);};const on=()=>{if(!frame)frame=requestAnimationFrame(update);};update();addEventListener('scroll',on,{passive:true});addEventListener('resize',on);return()=>{removeEventListener('scroll',on);removeEventListener('resize',on);cancelAnimationFrame(frame);};},[loading,route.lesson]);
  // Keyboard: [ and ] step through lessons (across chapters), / or Ctrl+K opens the navigator, Esc closes it.
  useEffect(()=>{const onKey=e=>{
    if(e.key==='Escape'){setMenu(false);return;}
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setMenu(m=>!m);return;}
    if(e.ctrlKey||e.metaKey||e.altKey||e.target.closest?.('input,textarea,select,[contenteditable]')||document.querySelector('dialog[open]'))return;
    if(e.key==='/'){e.preventDefault();setMenu(true);return;}
    const r=routeRef.current;if((e.key==='['||e.key===']')&&r.view==='lesson'){const order=lessonOrder(r.course);const target=order[order.indexOf(r.lesson)+(e.key===']'?1:-1)];if(target){e.preventDefault();go(`lesson/${target}/learn`);}}
  };addEventListener('keydown',onKey);return()=>removeEventListener('keydown',onKey);},[]);
  function go(hash){setMenu(false);if(location.hash===`#${hash}`)scrollToRoute(readRoute(),smooth());else location.hash=hash;}
  const onAuth=async u=>{const p=await api('/progress');setProgress(p);setUser(u);};
  async function logout(){if(dirtySet.current.size&&!confirm('You have unsaved answers. Sign out without saving them?'))return;try{await api('/logout',{});setCsrf(null);setUser(null);setProgress(blankProgress);setResume(null);dirtySet.current.clear();}catch(err){setError(err.message);}}
  const onState=state=>setProgress(p=>({...p,exercises:[...p.exercises.filter(s=>s.exercise_id!==state.exercise_id),state]}));
  const stateMap=Object.fromEntries(progress.exercises.map(s=>[s.exercise_id,s]));
  async function markRead(id){if(!user){setAuth(true);return;}try{const value=!progress.lessons.find(l=>l.lesson_id===id)?.is_read;await api(`/lessons/${id}`,{read:value,tab:'learn'});const state={lesson_id:id,is_read:Number(value),last_tab:'learn',updated_at:new Date().toISOString()};setProgress(p=>({...p,lessons:[...p.lessons.filter(l=>l.lesson_id!==id),state]}));setResume(state);setSaveMessages(m=>({...m,[id]:value?'Your place has been saved to your account.':'Lecture marked unread.'}));}catch(err){setError(err.message);}}
  if(loading)return <div className="loading-screen"><Seal size={64}/><p>Opening the book…</p></div>;
  if(!data)return <div className="loading-screen"><h1>The textbook could not be opened</h1><p>{error}</p><button className="primary" onClick={()=>location.reload()}>Try again</button></div>;

  const lessonById=Object.fromEntries(data.lessons.map(l=>[l.id,l]));
  const readSet=new Set(progress.lessons.filter(l=>l.is_read).map(l=>l.lesson_id));
  const stats=ids=>{const ex=data.exercises.filter(e=>ids.includes(e.lesson));const mastery=ex.filter(e=>e.mastery);return {done:ex.filter(e=>stateMap[e.id]?.correct).length,total:ex.length,read:ids.filter(id=>readSet.has(id)).length,mastered:mastery.length>0&&mastery.every(e=>stateMap[e.id]?.independent)};};
  const course=courseById[route.course];const chapter=chapterById[route.chapter];const lesson=route.lesson&&lessonById[route.lesson];
  const courseStats=stats(course?lessonOrder(course.id):data.lessons.map(l=>l.id));
  // The band lists the pages beside the current one: courses in the Library, chapters in a course, lessons in a chapter.
  const bandItems=route.view==='library'?courses.map(c=>({key:`course:${c.id}`,hash:`course/${c.id}`,num:c.code,label:c.short||c.title}))
    :route.view==='course'?[{key:`course:${course.id}`,hash:`course/${course.id}`,label:'Contents'},...chaptersOf(course.id).filter(c=>c.lessonIds.length).map(c=>({key:`chapter:${c.id}`,hash:`chapter/${c.id}`,num:toRoman(c.number),label:c.short||c.title}))]
    :[{key:`chapter:${chapter.id}`,hash:`chapter/${chapter.id}`,label:'Contents'},...chapter.lessonIds.filter(id=>lessonById[id]).map(id=>({key:`lesson:${id}`,hash:`lesson/${id}/learn`,num:toRoman(Number(lessonById[id].number)),label:lessonById[id].short}))];
  const activeKey=pageKey(route);
  const trail=route.view==='library'?<span>Library</span>:<><span className="trail-code">{course.code}</span>{chapter&&<><span className="trail-sep">·</span><span>Chapter {toRoman(chapter.number)}</span></>}</>;
  const order=course?lessonOrder(course.id):[];const at=lesson?order.indexOf(lesson.id):-1;
  const account=user?<><span className="reader-name" title={user.name}><span className="initial" aria-hidden="true">{(user.name||user.username||'?').trim().charAt(0).toUpperCase()}</span><span className="name-text">{user.name}</span></span><button className="icon-button" onClick={logout} aria-label="Sign out" title="Sign out"><LogOut size={17}/></button></>:<button className="sign-in" onClick={()=>setAuth(true)}>Sign in</button>;
  let page;
  if(route.view==='lesson'&&lesson){const chapterData={lessons:data.lessons.filter(l=>chapter.lessonIds.includes(l.id)),exercises:data.exercises.filter(e=>chapter.lessonIds.includes(e.lesson))};page=<Lesson key={lesson.id} route={route} lesson={lesson} chapter={chapter} data={chapterData} prev={lessonById[order[at-1]]} next={lessonById[order[at+1]]} stateMap={stateMap} lessonState={progress.lessons.find(l=>l.lesson_id===lesson.id)} user={user} onAuth={()=>setAuth(true)} onState={onState} dirtyChange={dirtyChange} onRead={markRead} saveMessage={saveMessages[lesson.id]} go={go}/>;}
  else if(route.view==='chapter')page=<ChapterPage key={chapter.id} route={route} chapter={chapter} lessonById={lessonById} stats={stats} resume={resume} go={go}/>;
  else if(route.view==='course')page=<CoursePage key={course.id} route={route} course={course} lessonById={lessonById} stats={stats} resume={resume} go={go}/>;
  else page=<LibraryPage lessonById={lessonById} stats={stats} resume={resume} go={go}/>;
  return <><a className="skip-link" href="#main-content">Skip to content</a>
    <header className="masthead"><button className="mast-side mast-course" onClick={()=>setMenu(true)}>{course?`${course.code} · ${course.title}`:'All courses'}<ChevronDown size={13}/></button><button className="wordmark" onClick={()=>go(homeHash())} aria-label="Part C, the interactive textbook: home"><Seal size={46}/><span><b>Part C</b><i>an interactive textbook</i></span></button><p className="mast-side right">{courseStats.done} of {courseStats.total} problems solved<span className="mast-meter"><span style={{width:`${courseStats.total?courseStats.done/courseStats.total*100:0}%`}}/></span></p></header>
    <div className="band" ref={band}>
      <button className="band-mark" onClick={()=>go(homeHash())} tabIndex={-1} aria-hidden="true"><Seal size={26}/><b>Part C</b></button>
      <button className="band-trail" aria-expanded={menu} aria-haspopup="true" onClick={()=>setMenu(!menu)} title="All courses, chapters, and lessons (/)">{trail}<ChevronDown size={15} className="trail-caret"/></button>
      <nav className="band-nav" ref={navRef} aria-label="This level">{<span className="band-indicator" style={navStyle}/>}{bandItems.map(({key,hash,num,label})=>{const on=key===activeKey;return <button key={key} title={label} data-active={on} aria-current={on?'page':undefined} onClick={()=>go(hash)}>{num&&<span className="band-num">{num}</span>}{num?<span className="band-label">{label}</span>:label}</button>;})}</nav>
      <span className="band-here">{lesson?<><span className="band-num">{toRoman(Number(lesson.number))}</span>{lesson.short}</>:route.view==='chapter'?chapter.short||chapter.title:route.view==='course'?'Contents':''}</span>
      <div className="band-actions"><button className="icon-button theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme==='dark'?'day':'night'} reading`} title={theme==='dark'?'Day reading':'Night reading'}>{theme==='dark'?<Sun size={17}/>:<Moon size={17}/>}</button><span className="desktop-account">{account}</span><button className="icon-button band-menu" aria-label="Open the navigator" aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X size={20}/>:<Menu size={20}/>}</button></div>
      <div className="scroll-progress" ref={bar}/>
      <Navigator open={menu} route={route} lessonById={lessonById} stats={stats} resume={resume} go={go} account={account}/>
    </div>
    <button aria-label="Close the navigator" tabIndex={-1} className="drawer-scrim" data-open={menu} onClick={()=>setMenu(false)}/>
    {error&&<div className="global-error" role="alert">{error}<button aria-label="Dismiss error" onClick={()=>setError('')}><X size={16}/></button></div>}
    <main id="main-content" tabIndex={-1}>{page}</main>
    <footer className="colophon"><Seal size={30}/><p>Part C{course&&` · ${course.title}`}{chapter&&` · Chapter the ${chapterOrdinal(chapter)}`}</p><p className="colophon-small">Set in EB Garamond and Cinzel.</p></footer>
    <button className="to-top" ref={toTop} aria-label="Back to top" onClick={()=>window.scrollTo({top:0,behavior:smooth()})}><ArrowUp size={18}/></button>
    {auth&&<AuthDialog onClose={()=>setAuth(false)} onAuth={onAuth}/>}</>;
}
createRoot(document.getElementById('root')).render(<App/>);
