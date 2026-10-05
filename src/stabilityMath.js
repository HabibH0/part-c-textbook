import {identity,multiply,transpose,matvec,difference,factorLU} from './luMath.js';
import {householderQR,dot,norm} from './qrMath.js';
export const frobenius=A=>Math.hypot(...A.flat());
export const unitRoundoff=Number.EPSILON/2;

// Small binary significands, an unbounded exponent, and round-to-nearest/ties-to-even.
// Used only for explicitly labelled teaching simulations, not as a binary64 emulator.
export function roundBinary(x,p){
 if(x===0||!Number.isFinite(x))return x;
 const sign=Math.sign(x),a=Math.abs(x),e=Math.floor(Math.log2(a)),step=2**(e-p+1),scaled=a/step,lo=Math.floor(scaled),fraction=scaled-lo;
 const integer=fraction<0.5?lo:fraction>0.5?lo+1:lo%2===0?lo:lo+1;
 return sign*integer*step;
}
export function harmonicSimulation(p=8){
 let sum=0,reference=0;const points=[];
 for(let n=1;n<=100000;n++){
  reference+=1/n;const term=roundBinary(1/n,p),next=roundBinary(sum+term,p);
  if(n<=10||n%Math.max(1,2**(p-5))===0||next===sum)points.push({n,sum:next,reference});
  if(next===sum)return {sum,reference,stop:n,points};sum=next;
 }
 return {sum,reference,stop:null,points};
}
export function subtractionSensitivity(p=3,direction=1){
 const x=1+10**(-p),delta=direction*1e-8,y=x-1,changed=x+delta,output=changed-1;
 // These are actual binary64 values; the finite change includes rounding of x+delta.
 const actualDelta=changed-x,backward=Math.abs(actualDelta/x),forward=Math.abs((output-y)/y),condition=Math.abs(x/y);
 return {x,y,changed,output,actualDelta,backward,forward,condition,predicted:condition*backward};
}
export function diagonalPerturbation(p=4,t=0.1){
 const s=10**(-p),A=[[1,0],[0,s]],b=[1,s],x=[1,1],xhat=[1,1/(1-t)],deltaA=[[0,0],[0,-t*s]],residual=b.map((v,i)=>v-matvec(A,xhat)[i]);
 return {A,b,x,xhat,deltaA,condition:1/s,inputError:t*s,forward:norm(xhat.map((v,i)=>v-x[i]))/norm(x),bound:t/(1-t),residual,backward:norm(residual)/norm(xhat)};
}
export function growthMatrix(n){return Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>j===n-1?1:i===j?1:i>j?-1:0));}
export function growthExperiment(n=6){const A=growthMatrix(n),f=factorLU(A,true),PA=f.permutation.map(i=>A[i]);return {A,...f,relativeResidual:frobenius(difference(multiply(f.L,f.U),PA))/frobenius(A)};}
export function roundedOuter(p=8){
 const delta=2**(-Math.ceil(p/2)),a=[1,1+delta],exact=a.map(x=>a.map(y=>x*y)),computed=exact.map(row=>row.map(x=>roundBinary(x,p)));
 const determinant=computed[0][0]*computed[1][1]-computed[0][1]*computed[1][0];
 return {delta,a,exact,computed,determinant,relativeError:frobenius(difference(computed,exact))/frobenius(exact)};
}
export function gramSchmidt(A,modified=false){
 const m=A.length,n=A[0].length,Q=Array.from({length:m},()=>Array(n).fill(0)),R=Array.from({length:n},()=>Array(n).fill(0));
 for(let j=0;j<n;j++){
  const a=A.map(row=>row[j]);let w=[...a];
  for(let i=0;i<j;i++){
   const q=Q.map(row=>row[i]);R[i][j]=dot(q,modified?w:a);w=w.map((v,k)=>v-R[i][j]*q[k]);
  }
  R[j][j]=norm(w);if(R[j][j]===0||!Number.isFinite(R[j][j]))return {Q,R,complete:false};
  for(let k=0;k<m;k++)Q[k][j]=w[k]/R[j][j];
 }
 return {Q,R,complete:true};
}
export function qrStabilityExperiment(p=4){
 const delta=10**(-p),A=[[1,1,1],[delta,0,0],[0,delta,0],[0,0,delta]],cgs=gramSchmidt(A),mgs=gramSchmidt(A,true),second=mgs.complete?gramSchmidt(mgs.Q,true):null;
 const twice=second?.complete?{Q:second.Q,R:multiply(second.R,mgs.R),complete:true}:{complete:false};
 const hh={...householderQR(A),complete:true};
 const measure=(name,f)=>({name,complete:f.complete,...(f.complete?{orthogonality:frobenius(difference(multiply(transpose(f.Q),f.Q),identity(3))),reconstruction:frobenius(difference(multiply(f.Q,f.R),A))/frobenius(A)}:{})});
 return {A,delta,condition:Math.sqrt(3+delta*delta)/delta,results:[measure('Classical Gram–Schmidt',cgs),measure('Modified Gram–Schmidt',mgs),measure('Modified, then repeated',twice),measure('Householder QR',hh)]};
}
