import {useState,useEffect,useLayoutEffect,useRef} from 'react';

export const prefersReducedMotion=()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;

// One shared observer: elements with data-reveal fade up the first time they enter the viewport.
let observer=null;
function revealObserver(){
  if(observer||typeof IntersectionObserver==='undefined')return observer;
  observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.dataset.shown='';observer.unobserve(entry.target);}},{rootMargin:'0px 0px -6% 0px',threshold:.04});
  document.documentElement.classList.add('js-reveal');
  return observer;
}
export const reveal=node=>{if(node&&!('shown' in node.dataset))revealObserver()?.observe(node);};

// Measures the child marked data-active="true" so a single highlight can slide between options.
export function useIndicator(active){
  const ref=useRef(null);const first=useRef(true);const[style,setStyle]=useState({opacity:0});
  useLayoutEffect(()=>{
    const box=ref.current;if(!box)return;
    const measure=()=>{
      const el=box.querySelector(':scope > [data-active="true"], :scope > * > [data-active="true"]');
      if(!el){setStyle(s=>({...s,opacity:0}));return;}
      const next={transform:`translate(${el.offsetLeft}px,${el.offsetTop}px)`,width:el.offsetWidth,height:el.offsetHeight,opacity:1};
      if(first.current){next.transition='none';first.current=false;}
      setStyle(next);
    };
    measure();
    const resize=new ResizeObserver(measure);resize.observe(box);
    return()=>resize.disconnect();
  },[active]);
  return [ref,style];
}

// Returns the last id whose element has scrolled above `offset` of the viewport height.
export function useScrollSpy(ids,offset=.3){
  const key=ids.join('|');const[active,setActive]=useState(null);
  useEffect(()=>{
    let frame=0;
    const check=()=>{
      frame=0;const line=innerHeight*offset;let current=null;
      for(const id of ids){const el=document.getElementById(id);if(el&&el.getBoundingClientRect().top<=line)current=id;}
      if(current&&innerHeight+scrollY>=document.documentElement.scrollHeight-4)current=ids[ids.length-1];
      setActive(current);
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(check);};
    check();addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);
    return()=>{removeEventListener('scroll',schedule);removeEventListener('resize',schedule);cancelAnimationFrame(frame);};
  },[key,offset]);
  return active;
}

export function CountUp({value,duration=900}){
  const[shown,setShown]=useState(prefersReducedMotion()?value:0);const from=useRef(0);
  useEffect(()=>{
    if(prefersReducedMotion()){setShown(value);return;}
    const start=performance.now(),origin=from.current;let frame;
    const tick=now=>{const t=Math.min(1,(now-start)/duration);const eased=1-Math.pow(1-t,3);setShown(Math.round(origin+(value-origin)*eased));if(t<1)frame=requestAnimationFrame(tick);else from.current=value;};
    frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);
  },[value,duration]);
  return shown;
}
