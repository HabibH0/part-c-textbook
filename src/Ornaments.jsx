// Decorative SVG used across the book: the Part C seal, a wax seal for Collections,
// tutor's-ink marks, and an illustrative skyline of spires for the contents page.

export function Seal({size=40}){
  const dots=Array.from({length:28},(_,i)=>{const a=i/28*2*Math.PI;return <circle key={i} cx={24+20.6*Math.cos(a)} cy={24+20.6*Math.sin(a)} r=".55" fill="currentColor"/>;});
  return <svg className="seal-mark" viewBox="0 0 48 48" width={size} height={size} aria-hidden="true"><circle cx="24" cy="24" r="23" fill="none" stroke="currentColor" strokeWidth="1.1"/><circle cx="24" cy="24" r="18.3" fill="none" stroke="currentColor" strokeWidth=".7"/>{dots}<text x="24" y="30.6" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="17" fontWeight="600" fill="currentColor">C</text></svg>;
}

const scallop=(r,bumps,depth)=>{let d='';for(let i=0;i<=bumps*4;i++){const a=i/(bumps*4)*2*Math.PI;const rr=r+depth*Math.cos(a*bumps);d+=`${i?'L':'M'}${(40+rr*Math.cos(a)).toFixed(2)} ${(40+rr*Math.sin(a)).toFixed(2)}`;}return d+'Z';};
const sealEdge=scallop(34,14,2.6);
export function WaxSeal({passed,count=0,size=84,label}){
  return <svg className={`wax-seal ${passed?'passed':''}`} viewBox="0 0 80 80" width={size} height={size} role="img" aria-label={label||(passed?'Collections passed':`${count} of 3 answered independently`)}>
    <path d={sealEdge} className="wax-body"/><circle cx="40" cy="40" r="25" className="wax-ring"/><circle cx="40" cy="40" r="21.5" className="wax-ring thin"/>
    {passed?<path pathLength="1" d="M29 41 L37 49 L52 31" className="wax-tick"/>:<text x="40" y="46" textAnchor="middle" className="wax-text">{count}/3</text>}
  </svg>;
}

export function InkTick({size=26}){return <svg className="ink-tick" viewBox="0 0 28 24" width={size} height={size*24/28} aria-hidden="true"><path pathLength="1" d="M3 13.5 C6 15 8 17.5 10.5 21 C14 13 19 6.5 25.5 2.5"/></svg>;}
export function InkCross({size=20}){return <svg className="ink-tick retry" viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"><path pathLength="1" d="M5 5 C10 10 14 14 19.5 19.5 M19 4.5 C14 10 10 14 4.5 19.5"/></svg>;}

export function Rule({className=''}){return <div className={`ornament-rule ${className}`} aria-hidden="true"><i/><b/><i/></div>;}

// Illustrative skyline: generic towers, a domed rotunda, and spires (not any official emblem).
const crenels=(x0,x1,y,step=14,h=7)=>{let d=`M${x0} 232 V${y}`;for(let x=x0;x<x1;x+=step*2)d+=` H${Math.min(x+step,x1)} V${y-h} H${Math.min(x+step*2,x1)} V${y}`;return d+` H${x1} V232`;};
const lancet=(x,y,w,h)=>`M${x} ${y+h} V${y+w*.7} Q${x} ${y} ${x+w/2} ${y-w*.35} Q${x+w} ${y} ${x+w} ${y+w*.7} V${y+h} Z`;
export function Skyline(){
  const windows=[lancet(372,182,10,26),lancet(392,182,10,26),lancet(412,182,10,26),lancet(432,182,10,26),lancet(452,182,10,26),lancet(693,120,14,34),lancet(693,176,14,30),lancet(172,150,10,30),lancet(1046,190,9,22),lancet(1066,190,9,22),lancet(1086,190,9,22),lancet(1106,190,9,22),lancet(1126,190,9,22),lancet(943,170,8,20)];
  const columns=Array.from({length:12},(_,i)=>`M${342+i*14.5} 160 V222`).join(' ');
  return <svg className="skyline" viewBox="0 0 1200 240" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
    <g className="stars">{[[80,40],[140,90],[260,30],[300,110],[540,50],[610,20],[800,60],[880,30],[1000,80],[1080,40],[1150,100],[470,15]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={i%3?1:1.6} style={{animationDelay:`${i*.37}s`}}/>)}</g>
    <circle className="moon" cx="1010" cy="48" r="16"/>
    <g className="trees"><path pathLength="1" d="M228 232 C214 210 226 192 244 196 C252 178 280 182 282 200 C298 200 300 222 288 232 Z"/><path pathLength="1" d="M560 232 C548 214 560 196 578 200 C588 184 612 188 612 206 C626 208 626 226 616 232 Z"/><path pathLength="1" d="M820 232 C806 214 820 198 836 202 C846 188 868 192 868 208 C882 210 882 226 874 232 Z"/></g>
    <g className="build">
      <path pathLength="1" d={crenels(0,150,198)}/><path pathLength="1" d={crenels(290,330,206)}/><path pathLength="1" d={crenels(520,560,204)}/><path pathLength="1" d={crenels(760,920,200)}/>
      <path pathLength="1" d="M150 232 V128 H210 V232 M150 128 L180 22 L210 128 M146 128 H214 M150 128 V116 M210 128 V116 M164 128 L180 70 L196 128"/>
      <path pathLength="1" d="M330 232 V160 H510 V232 M326 160 H514 M350 160 V130 H490 V160 M346 130 H494 M350 130 C350 72 490 72 490 130 M370 96 C392 84 448 84 470 96 M412 76 V58 H428 V76 M408 58 H432 M420 58 V46"/>
      <path pathLength="1" d={columns}/>
      <path pathLength="1" d="M670 232 V100 H740 V232 M664 100 H746 M680 100 V72 H730 V100 M676 72 H734 M680 72 C680 50 705 46 705 24 C705 46 730 50 730 72 M705 24 V14"/>
      <path pathLength="1" d="M930 232 V140 H966 V232 M926 140 H970 M930 140 L948 52 L966 140"/>
      <path pathLength="1" d="M1030 232 V178 L1088 140 L1146 178 V232 M1024 178 H1152 M1146 232 H1200 V196 H1146"/>
    </g>
    <g className="windows">{windows.map((d,i)=><path key={i} d={d} style={{animationDelay:`${.4+i*.12}s`}}/>)}</g>
    <path className="ground" pathLength="1" d="M0 232 H1200"/>
  </svg>;
}
