import {identity,copy,multiply,transpose,matvec,difference,maxEntry,choleskySteps,solveTriangularTrace} from './luMath.js';
export {multiply,transpose,matvec,difference,maxEntry};
export const norm=x=>Math.hypot(...x);
export const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
export function reflector(x){
 const length=norm(x);if(length===0)return {v:x.map(()=>0),alpha:0,active:false};
 const alpha=-(x[0]>=0?1:-1)*length,v=[...x];v[0]-=alpha;const scale=norm(v);
 return {v:v.map(a=>a/scale),alpha,active:true};
}
export const reflect=(v,x)=>{const scale=2*dot(v,x);return x.map((a,i)=>a-scale*v[i]);};
export function householderQR(A,{b=null,record=false}={}){
 const m=A.length,n=A[0].length;if(m<n)throw new Error('Thin QR demonstration requires m ≥ n.');
 const work=copy(A),QF=identity(m),transformed=b?[...b]:null,frames=record?[{work:copy(work),stage:0,v:null,alpha:null}]:[];
 for(let k=0;k<n;k++){
  const {v,alpha,active}=reflector(work.slice(k).map(row=>row[k]));
  if(active){
   for(let j=k;j<n;j++){let d=0;for(let i=k;i<m;i++)d+=v[i-k]*work[i][j];for(let i=k;i<m;i++)work[i][j]-=2*v[i-k]*d;}
   for(let row=0;row<m;row++){let d=0;for(let j=k;j<m;j++)d+=QF[row][j]*v[j-k];for(let j=k;j<m;j++)QF[row][j]-=2*d*v[j-k];}
   if(transformed){let d=0;for(let i=k;i<m;i++)d+=v[i-k]*transformed[i];for(let i=k;i<m;i++)transformed[i]-=2*v[i-k]*d;}
   work[k][k]=alpha;for(let i=k+1;i<m;i++)work[i][k]=0;
  }
  if(record)frames.push({work:copy(work),stage:k+1,v:[...Array(k).fill(0),...v],alpha});
 }
 return {QF,Q:QF.map(row=>row.slice(0,n)),R:work.slice(0,n),work,transformed,frames};
}
export function backsolve(R,b){
 const n=R.length,x=Array(n).fill(0),scale=maxEntry(R),cutoff=Number.EPSILON*n*scale;
 for(let i=n-1;i>=0;i--){if(Math.abs(R[i][i])<=cutoff)return null;let sum=0;for(let j=i+1;j<n;j++)sum+=R[i][j]*x[j];x[i]=(b[i]-sum)/R[i][i];}
 return x;
}
export function leastSquares(A,b){
 const qr=householderQR(A,{b}),x=backsolve(qr.R,qr.transformed.slice(0,A[0].length));
 if(!x)return {...qr,x:null};const fit=matvec(A,x),residual=b.map((v,i)=>v-fit[i]);return {...qr,x,fit,residual,residualNorm:norm(residual),orthogonality:matvec(transpose(A),residual)};
}
export const givens=(a,b)=>{const r=Math.hypot(a,b);return r===0?{c:1,s:0,r:0}:{c:a/r,s:b/r,r};};
export const hessenbergExample=[[3,1,2,0,1],[4,2,1,1,0],[0,3,4,1,2],[0,0,2,3,1],[0,0,0,4,5]];
export function givensHessenberg(A){
 const n=A.length,work=copy(A),Q=identity(n),frames=[{work:copy(work),stage:0,c:null,s:null}];
 for(let k=0;k<n-1;k++){
  const {c,s}=givens(work[k][k],work[k+1][k]);
  for(let j=k;j<n;j++){const a=work[k][j],b=work[k+1][j];work[k][j]=c*a+s*b;work[k+1][j]=-s*a+c*b;}
  work[k+1][k]=0;
  for(let i=0;i<n;i++){const a=Q[i][k],b=Q[i][k+1];Q[i][k]=c*a+s*b;Q[i][k+1]=-s*a+c*b;}
  frames.push({work:copy(work),stage:k+1,c,s});
 }
 return {Q,R:work,frames};
}
export function gramComparison(power){
 const epsilon=10**(-power),A=[[1,1],[epsilon,0],[0,epsilon]],b=matvec(A,[1,-1]),G=multiply(transpose(A),A),rhs=matvec(transpose(A),b),f=choleskySteps(G),qr=leastSquares(A,b);
 const normalX=f.complete?solveTriangularTrace(f.C,transpose(f.C),rhs).x:null;
 return {epsilon,A,G,qrX:qr.x,normalX,condition:Math.sqrt(2+epsilon**2)/epsilon,gramCondition:(2+epsilon**2)/epsilon**2};
}
export const regressionTarget=t=>1+Math.sin(10*t)*Math.exp(t);
export const polynomial=(coefficients,t)=>coefficients.reduceRight((v,c)=>v*t+c,0);
export function polynomialFit(m=100,degree=10){
 const nodes=Array.from({length:m},(_,i)=>-1+2*i/(m-1)),samples=nodes.map(regressionTarget),A=nodes.map(t=>Array.from({length:degree+1},(_,j)=>t**j));
 const solution=leastSquares(A,samples);if(!solution.x)throw new Error('Numerical rank failure for polynomial fit');
 const grid=Array.from({length:801},(_,i)=>-1+2*i/800),curve=grid.map(t=>polynomial(solution.x,t)),errors=grid.map((t,i)=>curve[i]-regressionTarget(t));
 return {nodes,samples,coefficients:solution.x,grid,curve,trainingRms:solution.residualNorm/Math.sqrt(m),gridRms:norm(errors)/Math.sqrt(grid.length),gridMax:Math.max(...errors.map(Math.abs))};
}
