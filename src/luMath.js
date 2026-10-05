export const copy=A=>A.map(row=>[...row]);
export const identity=n=>Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>Number(i===j)));
export const transpose=A=>A[0].map((_,j)=>A.map(row=>row[j]));
export const multiply=(A,B)=>A.map(row=>B[0].map((_,j)=>row.reduce((sum,a,k)=>sum+a*B[k][j],0)));
export const matvec=(A,x)=>A.map(row=>row.reduce((sum,a,j)=>sum+a*x[j],0));
export const maxEntry=A=>Math.max(...A.flat().map(Math.abs));
export const difference=(A,B)=>A.map((row,i)=>row.map((v,j)=>v-B[i][j]));
export const outer=(a,b)=>a.map(x=>b.map(y=>x*y));
export const exampleLU=[[2,1,1],[4,3,3],[8,7,9]];
export const lateSwap=[[4,1,0],[2,1,1],[1,3,1]];
export const growthExample=[[1,0,1],[-1,1,1],[-1,-1,1]];

// Snapshots preserve LU = PA at every completed elimination step.
export function factorLU(A,pivot=true){
 const n=A.length,L=identity(n),U=copy(A),permutation=Array.from({length:n},(_,i)=>i),steps=[];
 let peak=maxEntry(A);
 const capture=(stage,message,swap=null)=>steps.push({stage,message,swap,L:copy(L),U:copy(U),permutation:[...permutation],growth:peak/(maxEntry(A)||1)});
 capture(0,'Original matrix; no columns eliminated.');
 for(let k=0;k<n;k++){
  let p=k;
  if(pivot)for(let i=k+1;i<n;i++)if(Math.abs(U[i][k])>Math.abs(U[p][k]))p=i;
  if(U[p][k]===0){capture(k+1,`Zero pivot in column ${k+1}; division is not performed.`);return {L,U,permutation,steps,complete:false,failedColumn:k,growth:peak/(maxEntry(A)||1)};}
  if(p!==k){[U[k],U[p]]=[U[p],U[k]];[permutation[k],permutation[p]]=[permutation[p],permutation[k]];for(let j=0;j<k;j++)[L[k][j],L[p][j]]=[L[p][j],L[k][j]];}
  const pivotValue=U[k][k];
  for(let i=k+1;i<n;i++){L[i][k]=U[i][k]/pivotValue;for(let j=k+1;j<n;j++)U[i][j]-=L[i][k]*U[k][j];U[i][k]=0;}
  peak=Math.max(peak,maxEntry(U));
  capture(k+1,`${p!==k?`Swap rows ${k+1} and ${p+1}${k?' and their stored multipliers':''}; `:''}${k===n-1?'accept the final pivot.':`eliminate below pivot ${k+1}.`}`,p!==k?[k,p]:null);
 }
 return {L,U,permutation,steps,complete:true,growth:peak/(maxEntry(A)||1)};
}

export function rankOneFrames(A){
 const {L,U,complete}=factorLU(A,false);if(!complete)throw new Error('This example needs nonzero unpivoted pivots.');
 let sum=A.map(row=>row.map(()=>0));const frames=[{sum:copy(sum),residual:copy(A),term:copy(sum)}];
 for(let k=0;k<A.length;k++){
  const term=outer(L.map(row=>row[k]),U[k]);sum=sum.map((row,i)=>row.map((v,j)=>v+term[i][j]));frames.push({sum:copy(sum),residual:difference(A,sum),term});
 }
 return {L,U,frames};
}

export function solveTriangularTrace(L,U,b){
 const n=b.length,y=Array(n).fill(null),x=Array(n).fill(null),steps=[{phase:'Ready',index:null,y:[...y],x:[...x],rhs:null,sum:0,diagonal:null,value:null}];
 const save=(phase,index,rhs,sum,diagonal,value)=>steps.push({phase,index,rhs,sum,diagonal,value,y:[...y],x:[...x]});
 for(let i=0;i<n;i++){if(L[i][i]===0)throw new Error('Singular lower triangular factor');let sum=0;for(let j=0;j<i;j++)sum+=L[i][j]*y[j];y[i]=(b[i]-sum)/L[i][i];save('Forward',i,b[i],sum,L[i][i],y[i]);}
 for(let i=n-1;i>=0;i--){if(U[i][i]===0)throw new Error('Singular upper triangular factor');let sum=0;for(let j=i+1;j<n;j++)sum+=U[i][j]*x[j];x[i]=(y[i]-sum)/U[i][i];save('Backward',i,y[i],sum,U[i][i],x[i]);}
 return {x,y,steps};
}

export function choleskySteps(A){
 const n=A.length,C=A.map(row=>row.map(()=>0)),steps=[{C:copy(C),residual:copy(A),pivot:null,message:'Original matrix; no columns computed.'}];
 for(let j=0;j<n;j++){
  const pivot=A[j][j]-C[j].slice(0,j).reduce((s,v)=>s+v*v,0);
  if(pivot<=0){steps.push({C:copy(C),residual:difference(A,multiply(C,transpose(C))),pivot,message:pivot===0?'Zero active pivot: the positive-definite algorithm stops; a semidefinite factor may still exist.':'Negative active pivot: a real Cholesky square root is unavailable.'});return {C,steps,complete:false,pivot};}
  C[j][j]=Math.sqrt(pivot);
  for(let i=j+1;i<n;i++){let sum=0;for(let k=0;k<j;k++)sum+=C[i][k]*C[j][k];C[i][j]=(A[i][j]-sum)/C[j][j];}
  steps.push({C:copy(C),residual:difference(A,multiply(C,transpose(C))),pivot,message:`Column ${j+1}: take the positive square root of ${pivot}.`});
 }
 return {C,steps,complete:true};
}
export const choleskyFamily=t=>[[4,2,2],[2,5,3],[2,3,2+t]];
