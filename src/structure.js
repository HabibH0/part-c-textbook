// The book's hierarchy, Library → course → chapter → lesson, and the routes between them.
// Adding a course or chapter only needs edits in content/; nothing here is course-specific.
import {courses} from '../content/courses.js';
import {chapters} from '../content/chapters.js';

export {courses,chapters};
export const courseById=Object.fromEntries(courses.map(c=>[c.id,c]));
export const chapterById=Object.fromEntries(chapters.map(c=>[c.id,c]));
export const chapterOfLesson=Object.fromEntries(chapters.flatMap(c=>c.lessonIds.map(id=>[id,c])));
export const chaptersOf=courseId=>chapters.filter(c=>c.course===courseId).sort((a,b)=>a.number-b.number);
/** Every lesson of a course in reading order, across chapter boundaries. */
export const lessonOrder=courseId=>chaptersOf(courseId).flatMap(c=>c.lessonIds);

const markdown=import.meta.glob(['../content/**/*.md','!../content/coverage-*.md'],{query:'?raw',import:'default',eager:true});
export const articleOf=lesson=>markdown[`../content/${lesson.file||lesson.id}.md`]||'';

export function toRoman(n){let out='';for(const [v,s] of [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']])while(n>=v){out+=s;n-=v;}return out;}
const ordinals=['','First','Second','Third','Fourth','Fifth','Sixth','Seventh','Eighth','Ninth','Tenth','Eleventh','Twelfth','Thirteenth','Fourteenth','Fifteenth','Sixteenth','Seventeenth','Eighteenth','Nineteenth','Twentieth'];
export const ordinalWord=n=>ordinals[n]||`${n}th`;
export const chapterOrdinal=c=>c.ordinal||ordinalWord(c.number);

export const sectionIds=['learn','explore','practice','mastery'];
export const homeHash=()=>courses.length>1?'library':`course/${courses[0].id}`;

/** Parses the location hash. Old links (#overview, #lesson/<id>/<section>, #chapter/<id>) keep working. */
export function readRoute(){
  const [kind,id,sec]=location.hash.slice(1).split('/');
  const section=sectionIds.includes(sec)?sec:'learn';
  const blank={view:'library',course:null,chapter:null,lesson:null,section};
  if(kind==='lesson'&&chapterOfLesson[id]){const c=chapterOfLesson[id];return {...blank,view:'lesson',lesson:id,chapter:c.id,course:c.course};}
  if(kind==='chapter'&&chapterById[id])return {...blank,view:'chapter',chapter:id,course:chapterById[id].course};
  if(kind==='course'&&courseById[id])return {...blank,view:'course',course:id};
  if(kind==='library')return blank;
  return courses.length>1?blank:{...blank,view:'course',course:courses[0].id};
}
export const pageKey=r=>r.view==='lesson'?`lesson:${r.lesson}`:`${r.view}:${r[r.view]||''}`;
export const routeHash=r=>r.view==='lesson'?`lesson/${r.lesson}/learn`:r.view==='library'?'library':`${r.view}/${r[r.view]}`;
