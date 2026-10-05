import {identity,copy,multiply,transpose,matvec,difference} from './luMath.js';
import {reflector} from './qrMath.js';
import {hessenbergReduction,hessenbergQRStep,frobenius} from './qrAlgorithmMath.js';
export {multiply,transpose,difference,frobenius,identity,matvec};
export const symmetricInput=[[4,1,2,0,1],[1,3,-1,2,0],[2,-1,1,1,2],[0,2,1,2,-1],[1,0,2,-1,5]];
export const symmetricReduction=()=>hessenbergReduction(symmetricInput);
export function wilkinson(a,b,d){if(b===0)return d;const delta=(a-d)/2;return d-(delta>=0?1:-1)*b*b/(Math.abs(delta)+Math.hypot(delta,b));}
export function symmetricQR(A=symmetricInput,tolerance=1e-12,maxSteps=100){
 const reduced=hessenbergReduction(A);let T=copy(reduced.H),Z=identity(A.length),active=A.length,k=0;const scale=frobenius(A),frames=[];
 const split=()=>{while(active>1){const j=active-1;if(Math.abs(T[j][j-1])>tolerance*Math.max(Math.abs(T[j-1][j-1])+Math.abs(T[j][j]),Number.EPSILON*scale))break;T[j][j-1]=T[j-1][j]=0;active--;}};
 const record=shift=>frames.push({k,T:copy(T),active,shift});
 split();record(null);
 while(active>1&&k<maxSteps){const j=active-1,shift=wilkinson(T[j-1][j-1],T[j][j-1],T[j][j]);const f=hessenbergQRStep(T,shift,active);T=f.H;Z=multiply(Z,f.Q);k++;split();record(shift);}
 const V=multiply(reduced.U,Z);
 return {frames,T,V,steps:k,complete:active===1,values:active===1?T.map((r,i)=>r[i]):null,residual:frobenius(difference(multiply(multiply(V,T),transpose(V)),A))/(scale||1)};
}
export function rationalSign(z,steps){if(z===0)return null;let r=z;for(let i=0;i<steps;i++)r=(r+1/r)/2;return {r,projector:(1+r)/2,error:Math.abs(r-Math.sign(z))};}
export const bidiagonalInput=[[3,1,2,0],[4,2,-1,1],[1,3,2,2],[0,1,4,-1],[2,0,1,3]];
export function bidiagonalise(A){
 const m=A.length,n=A[0].length;if(m<n)throw new Error('This demonstration uses m ≥ n.');
 let B=copy(A),L=identity(m),R=identity(n);const frames=[];
 const record=(label,v=null)=>frames.push({label,B:copy(B),L:copy(L),R:copy(R),v});
 record('Original matrix');
 for(let k=0;k<n;k++){
  const {v:tail,active}=reflector(B.slice(k).map(row=>row[k])),v=[...Array(k).fill(0),...tail];
  if(active){
   for(let j=0;j<n;j++){let d=0;for(let i=k;i<m;i++)d+=v[i]*B[i][j];for(let i=k;i<m;i++)B[i][j]-=2*v[i]*d;}
   for(let i=0;i<m;i++){let d=0;for(let j=k;j<m;j++)d+=L[i][j]*v[j];for(let j=k;j<m;j++)L[i][j]-=2*d*v[j];}
  }
  for(let i=k+1;i<m;i++)B[i][k]=0;record('Left reflector '+(k+1),v);
  if(k<n-2){
   const {v:tailR,active:activeR}=reflector(B[k].slice(k+1)),w=[...Array(k+1).fill(0),...tailR];
   if(activeR){
    for(let i=0;i<m;i++){let d=0;for(let j=k+1;j<n;j++)d+=B[i][j]*w[j];for(let j=k+1;j<n;j++)B[i][j]-=2*d*w[j];}
    for(let i=0;i<n;i++){let d=0;for(let j=k+1;j<n;j++)d+=R[i][j]*w[j];for(let j=k+1;j<n;j++)R[i][j]-=2*d*w[j];}
   }
   for(let j=k+2;j<n;j++)B[k][j]=0;record('Right reflector '+(k+1),w);
  }
 }
 return {B,L,R,frames};
}
export function gramLoss(power){
 const epsilon=10**(-power),A=[[1,1],[epsilon,0],[0,epsilon]],G=multiply(transpose(A),A),smallSquared=G[0][0]-G[0][1];
 return {epsilon,A,G,small:epsilon,gramSmall:Math.sqrt(Math.max(0,smallSquared)),lost:smallSquared===0,large:Math.hypot(Math.SQRT2,epsilon)};
}
export function symmetricEigen2(a,b,d){
 const theta=Math.atan2(2*b,a-d)/2,c=Math.cos(theta),s=Math.sin(theta),radius=Math.hypot((a-d)/2,b),mid=(a+d)/2;
 return {values:[mid-radius,mid+radius],Y:[[-s,c],[c,s]]};
}
export function spdPencil(b=4,coupling=1){
 const A=[[2,coupling],[coupling,3]],B=[[b,0],[0,1]],S=[[2/b,coupling/Math.sqrt(b)],[coupling/Math.sqrt(b),3]],{values,Y}=symmetricEigen2(S[0][0],S[0][1],S[1][1]),X=[Y[0].map(v=>v/Math.sqrt(b)),[...Y[1]]];
 const residuals=values.map((lambda,j)=>{const x=X.map(row=>row[j]),ax=matvec(A,x),bx=matvec(B,x);return Math.hypot(...ax.map((v,i)=>v-lambda*bx[i]));});
 return {A,B,S,X,values,residuals,orthogonality:frobenius(difference(multiply(multiply(transpose(X),B),X),identity(2)))};
}
export function homogeneousPair(alpha,beta){return beta!==0?{kind:'finite',value:alpha/beta}:alpha!==0?{kind:'infinite',value:null}:{kind:'indeterminate',value:null};}
export function quadraticExample(r1=1,r2=2){
 const b=-(r1+r2),c=r1*r2,M=[[0,1],[-c,-b]],roots=[r1,r2],residuals=roots.map(r=>{const x=[1,r],v=matvec(M,x);return Math.hypot(...v.map((a,i)=>a-r*x[i]));});
 return {b,c,M,roots,residuals};
}
export function taylorExp(x,degree){let term=1,sum=1;for(let k=1;k<=degree;k++){term*=x/k;sum+=term;}return sum;}
export function exponentialApproximation(degree=2){
 let lo=0,hi=2;for(let k=0;k<60;k++){const mid=(lo+hi)/2;if(taylorExp(mid,degree)<2)lo=mid;else hi=mid;}
 const root=(lo+hi)/2;return {root,exact:Math.log(2),residual:Math.expm1(root)-1,polynomialResidual:taylorExp(root,degree)-2};
}
export function spectralCosts(n=100,m=n,degree=2){return {symmetricValues:4/3*n**3,symmetricVectors:9*n**3,generalValues:10*n**3,generalVectors:15*n**3,svdSquareLike:8/3*m*n*n,svdReduction:4*m*n*n-4/3*n**3,svdVectors:20*m*n*n,qz:50*n**3,polynomial:20*(n*degree)**3,expanded:n*degree};}
