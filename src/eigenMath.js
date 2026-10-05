import {multiply,transpose,difference,identity,matvec,factorLU,solveTriangularTrace} from './luMath.js';
import {norm,dot} from './qrMath.js';
export {multiply,transpose,matvec};
export const frobenius=A=>Math.hypot(...A.flat());
export const complex=(re,im=0)=>({re,im});
export const cadd=(a,b)=>complex(a.re+b.re,a.im+b.im);
export const cmul=(a,b)=>complex(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
export const cscale=(a,s)=>complex(s*a.re,s*a.im);
export function companion(coefficients){const n=coefficients.length;return Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>i===0?-coefficients[j]:j===i-1?1:0));}
export function polynomialAt(coefficients,z){return coefficients.reduce((s,a)=>cadd(cmul(s,z),complex(a)),complex(1));}
export function companionExperiment(realRoot=2,pairReal=0,pairImag=1){
 const q=pairReal*pairReal+pairImag*pairImag,coefficients=[-(realRoot+2*pairReal),q+2*realRoot*pairReal,-realRoot*q],C=companion(coefficients),roots=[complex(realRoot),complex(pairReal,pairImag),complex(pairReal,-pairImag)];
 const checks=roots.map(z=>{const v=[cmul(z,z),z,complex(1)],Cv=C.map(row=>row.reduce((s,a,j)=>cadd(s,cscale(v[j],a)),complex(0))),residual=Cv.map((a,i)=>cadd(a,cscale(cmul(z,v[i]),-1)));return {root:z,vector:v,polynomial:polynomialAt(coefficients,z),residual:Math.hypot(...residual.flatMap(a=>[a.re,a.im]))};});
 return {coefficients,C,roots,checks};
}
export function schurExperiment(angle=30,coupling=2,rotation=false){
 const a=angle*Math.PI/180,c=Math.cos(a),s=Math.sin(a),U=[[c,-s],[s,c]],T=rotation?[[0,-1],[1,0]]:[[2,coupling],[0,1]],A=multiply(multiply(U,T),transpose(U)),normalDefect=frobenius(difference(multiply(transpose(A),A),multiply(A,transpose(A)))),residual=frobenius(difference(multiply(multiply(U,T),transpose(U)),A));
 const first=U.map(r=>r[0]),second=U.map(r=>r[1]);return {U,T,A,normalDefect,residual,firstResidual:rotation?null:norm(matvec(A,first).map((v,i)=>v-2*first[i])),secondResidual:rotation?null:norm(matvec(A,second).map((v,i)=>v-second[i]))};
}
export const normalise=x=>{const length=norm(x);return length===0?null:x.map(v=>v/length);};
export function eigenMetrics(A,x){const Ax=matvec(A,x),rho=dot(x,Ax)/dot(x,x),residual=norm(Ax.map((v,i)=>v-rho*x[i]));return {x:[...x],rho,residual};}
export function powerExperiment(second=1,angle=45,steps=8,negative=false){
 const A=[[negative?-3:3,0],[0,second]],radians=angle*Math.PI/180,initial=angle===90?[0,1]:angle===0?[1,0]:[Math.cos(radians),Math.sin(radians)];
 let x=normalise(initial),status='Steps completed';const frames=[{k:0,...eigenMetrics(A,x)}];
 for(let k=1;k<=steps;k++){const next=normalise(matvec(A,x));if(!next){status='Zero product: normalisation is undefined';break;}x=next;frames.push({k,...eigenMetrics(A,x)});}
 return {A,frames,latest:frames.at(-1),factor:Math.abs(second)/3,status,missing:angle===90};
}
// links[j] lists destinations of outgoing edges from page j.
export const rankNetworks={
 hub:{label:'A linked hub',links:[[1,2],[2],[0],[2]]},
 cycle:{label:'A directed cycle',links:[[1],[2],[3],[0]]},
 dangling:{label:'A dangling page',links:[[1,2],[2],[],[2]]}
};
export function transitionMatrix(links){const n=links.length;return Array.from({length:n},(_,i)=>links.map(destinations=>destinations.length?Number(destinations.includes(i))/destinations.length:1/n));}
export function solveDense(A,b){const f=factorLU(A,true);if(!f.complete)return null;return solveTriangularTrace(f.L,f.U,f.permutation.map(i=>b[i])).x;}
export function pageRankExperiment(network='hub',alpha=0.85,steps=10,start='uniform'){
 const links=rankNetworks[network].links,n=links.length,P=transitionMatrix(links),A=P.map(row=>row.map(v=>alpha*v+(1-alpha)/n));
 let x=start==='one'?[1,...Array(n-1).fill(0)]:Array(n).fill(1/n);const frames=[{k:0,x:[...x]}];
 for(let k=1;k<=steps;k++){x=matvec(A,x);const total=x.reduce((s,v)=>s+v,0);x=x.map(v=>v/total);frames.push({k,x:[...x]});}
 const system=P.map((row,i)=>row.map((v,j)=>Number(i===j)-alpha*v)),raw=solveDense(system,Array(n).fill((1-alpha)/n)),total=raw.reduce((s,v)=>s+v,0),stationary=raw.map(v=>v/total),residual=matvec(A,x).reduce((s,v,i)=>s+Math.abs(v-x[i]),0),distance=x.reduce((s,v,i)=>s+Math.abs(v-stationary[i]),0);
 return {P,A,links,x,stationary,frames,residual,distance,bound:residual/(1-alpha)};
}
export function shiftDistances(values,mu){const ordered=values.map((value,i)=>({value,index:i,distance:Math.abs(value-mu)})).sort((a,b)=>a.distance-b.distance);return {target:ordered[0].value,factor:ordered[0].distance/ordered[1].distance,singular:ordered[0].distance===0,tied:Math.abs(ordered[0].distance-ordered[1].distance)<1e-12};}
export function inverseExperiment(mu=1.8,steps=5,rayleigh=false,near=false){
 const values=[1,2,5],A=values.map((v,i)=>values.map((_,j)=>i===j?v:0));let x=normalise(near?[0.2,1,0.1]:[1,1,1]),factor=null,factorizations=0,solves=0,status='Steps completed';
 const frames=[{k:0,shift:null,...eigenMetrics(A,x)}];
 for(let k=1;k<=steps;k++){
  const previous=frames.at(-1);if(previous.residual<=5e-13){status='Converged: stopped before another shifted solve';break;}
  const shift=rayleigh?previous.rho:mu;
  if(!factor||rayleigh){factor=factorLU(A.map((row,i)=>row.map((v,j)=>v-(i===j?shift:0))),true);factorizations++;}
  if(!factor.complete){status=rayleigh?'Rayleigh shift reached an eigenvalue at working precision; residual is above the stopping tolerance':'Singular shifted matrix: choose another shift';break;}
  const y=solveTriangularTrace(factor.L,factor.U,factor.permutation.map(i=>x[i])).x;solves++;
  x=normalise(y);if(!x||x.some(v=>!Number.isFinite(v))){status='Unable to normalise the shifted solve';break;}
  frames.push({k,shift,...eigenMetrics(A,x)});
 }
 if(frames.at(-1).residual<=5e-13)status='Converged: stopped before another shifted solve';
 return {A,frames,latest:frames.at(-1),factorizations,solves,status,...shiftDistances(values,mu)};
}
