import {identity,copy,multiply,transpose,difference} from './luMath.js';
import {householderQR,reflector,givens} from './qrMath.js';
export {multiply,transpose,difference,identity};
export const frobenius=A=>Math.hypot(...A.flat());
export const trace=A=>A.reduce((s,row,i)=>s+row[i],0);
export const baseQR=[[2,1],[1,2]];
export function denseQRSequence(A=baseQR,steps=6,shift=0){
 const n=A.length;let B=copy(A),U=identity(n),S=identity(n),product=identity(n);const frames=[{k:0,B:copy(B),U:copy(U),S:copy(S),product:copy(product),Q:null,R:null}];
 for(let k=1;k<=steps;k++){
  const shifted=B.map((row,i)=>row.map((v,j)=>v-(i===j?shift:0))),{Q,R}=householderQR(shifted);
  B=multiply(R,Q).map((row,i)=>row.map((v,j)=>v+(i===j?shift:0)));U=multiply(U,Q);S=multiply(R,S);
  product=multiply(A.map((row,i)=>row.map((v,j)=>v-(i===j?shift:0))),product);
  frames.push({k,B:copy(B),U:copy(U),S:copy(S),product:copy(product),Q,R});
 }
 return frames;
}
export const denseHessenbergInput=[[4,1,2,0,1],[2,3,-1,2,0],[1,2,1,1,2],[3,0,2,2,-1],[1,1,0,2,5]];
export function hessenbergReduction(A){
 const n=A.length;let H=copy(A),U=identity(n);const frames=[{stage:0,H:copy(H),left:copy(H),U:copy(U),v:null}];
 for(let k=0;k<n-2;k++){
  const {v:tail,active}=reflector(H.slice(k+1).map(row=>row[k])),v=[...Array(k+1).fill(0),...tail];
  if(active){for(let j=0;j<n;j++){let d=0;for(let i=k+1;i<n;i++)d+=v[i]*H[i][j];for(let i=k+1;i<n;i++)H[i][j]-=2*v[i]*d;}}
  for(let i=k+2;i<n;i++)H[i][k]=0;const left=copy(H);
  if(active){for(let i=0;i<n;i++){let d=0;for(let j=k+1;j<n;j++)d+=H[i][j]*v[j];for(let j=k+1;j<n;j++)H[i][j]-=2*d*v[j];}
   for(let i=0;i<n;i++){let d=0;for(let j=k+1;j<n;j++)d+=U[i][j]*v[j];for(let j=k+1;j<n;j++)U[i][j]-=2*d*v[j];}}
  frames.push({stage:k+1,H:copy(H),left,U:copy(U),v});
 }
 return {H,U,frames};
}
// Apply adjacent row rotations, then their transposes on the right. Retain the
// full coupling block when only the leading active block is being iterated.
export function hessenbergQRStep(H,shift=0,active=H.length){
 const n=H.length,B=copy(H),Q=identity(n),rotations=[];
 for(let i=0;i<active;i++)B[i][i]-=shift;
 for(let k=0;k<active-1;k++){
  const {c,s}=givens(B[k][k],B[k+1][k]);rotations.push({k,c,s});
  for(let j=0;j<n;j++){const a=B[k][j],b=B[k+1][j];B[k][j]=c*a+s*b;B[k+1][j]=-s*a+c*b;}B[k+1][k]=0;
 }
 for(const {k,c,s} of rotations)for(let i=0;i<n;i++){
  let a=B[i][k],b=B[i][k+1];B[i][k]=c*a+s*b;B[i][k+1]=-s*a+c*b;
  a=Q[i][k];b=Q[i][k+1];Q[i][k]=c*a+s*b;Q[i][k+1]=-s*a+c*b;
 }
 for(let i=0;i<active;i++)B[i][i]+=shift;
 return {H:B,Q,rotations};
}
export const benchmarkSpectrum=[-4,-1,0.5,2,3.8];
export function benchmarkHessenberg(){const {Q}=householderQR(denseHessenbergInput),D=benchmarkSpectrum.map((v,i)=>benchmarkSpectrum.map((_,j)=>i===j?v:0));return hessenbergReduction(multiply(multiply(Q,D),transpose(Q))).H;}
export function runQR(H0=benchmarkHessenberg(),strategy='trailing',tolerance=1e-12,maxSteps=800){
 let H=copy(H0),U=identity(H.length),active=H.length;const scale=frobenius(H0),deflations=[];
 const split=k=>{while(active>1){const j=active-1,e=Math.abs(H[j][j-1]),local=Math.abs(H[j-1][j-1])+Math.abs(H[j][j]),threshold=tolerance*Math.max(local,Number.EPSILON*scale);if(e>threshold)break;H[j][j-1]=0;deflations.push({k,index:j,value:H[j][j],removed:e});active--;}};
 const record=(k,shift)=>({k,shift,active,H:copy(H),U:copy(U),subdiagonal:H.slice(1).map((row,i)=>Math.abs(row[i])),deflated:deflations.length});
 split(0);const frames=[record(0,null)];
 for(let k=1;k<=maxSteps&&active>1;k++){
  const shift=strategy==='trailing'?H[active-1][active-1]:0,result=hessenbergQRStep(H,shift,active);H=result.H;U=multiply(U,result.Q);split(k);frames.push(record(k,shift));
 }
 return {H,U,frames,deflations,complete:active===1,active,steps:frames.length-1,relativeResidual:frobenius(difference(multiply(multiply(U,H),transpose(U)),H0))/scale,eigenvalues:active===1?H.map((row,i)=>row[i]):null};
}
export function filterLog(z,shift,count,inverse=false){const distance=Math.abs(z-shift);if(distance===0)return inverse?Infinity:-Infinity;return (inverse?-1:1)*count*Math.log10(distance);}
export const refinementA=[[2,1,0],[-1,2,0],[1,0,4]];
export function doubleShiftPolynomial(A,a,b){const A2=multiply(A,A);return A2.map((row,i)=>row.map((v,j)=>v-2*a*A[i][j]+(i===j?a*a+b*b:0)));}
export function balanceExample(power=1){const A=[[1,100],[0.01,2]],d=[10**(-power),10**power],B=A.map((row,i)=>row.map((v,j)=>d[i]*v/d[j]));return {A,B,d,originalNorm:frobenius(A),balancedNorm:frobenius(B),scaleCondition:10**(2*Math.abs(power)),trace:trace(B),determinant:B[0][0]*B[1][1]-B[0][1]*B[1][0]};}
