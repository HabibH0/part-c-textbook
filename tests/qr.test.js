import test from 'node:test';
import assert from 'node:assert/strict';
import {reflector,reflect,householderQR,leastSquares,givens,givensHessenberg,hessenbergExample,gramComparison,polynomialFit,polynomial,regressionTarget,multiply,transpose,matvec,maxEntry,difference,norm} from '../src/qrMath.js';
import {identity} from '../src/luMath.js';
import {exerciseMap} from '../content/catalog.js';
const near=(a,b,tolerance=1e-10)=>assert(Math.abs(a-b)<=tolerance,`${a} differs from ${b}`);
const matrixNear=(A,B,tol=1e-10)=>near(maxEntry(difference(A,B)),0,tol);
test('Householder construction handles axial and zero vectors and preserves lengths',()=>{
 for(const x of [[3,4],[5,0],[-5,0],[0,0],[1,1e-12],[0,4,-3]]){
  const {v,alpha,active}=reflector(x),out=reflect(v,x);near(norm(out),norm(x));near(out[0],alpha);out.slice(1).forEach(a=>near(a,0));
  const twice=reflect(v,out);twice.forEach((a,i)=>near(a,x[i]));if(active)near(norm(v),1);
 }
});
test('Householder QR reconstructs tall, square and deficient inputs and applies QF transpose consistently',()=>{
 for(const A of [[[3,3],[4,4],[0,5]],[[1,2],[3,4]],[[0,1],[0,2],[0,3]],[[1,2],[2,4],[3,6]],[[0,0],[0,0],[0,0]]]){
  const b=A.map((_,i)=>i-2),f=householderQR(A,{b,record:true});
  matrixNear(multiply(f.Q,f.R),A);matrixNear(multiply(transpose(f.QF),f.QF),identity(A.length));
  const expected=matvec(transpose(f.QF),b);f.transformed.forEach((a,i)=>near(a,expected[i]));
  f.frames.forEach((frame,k)=>{for(let j=0;j<k;j++)for(let i=j+1;i<A.length;i++)near(frame.work[i][j],0);});
 }
});
test('Givens rotations annihilate the right coordinate and reconstruct structured QR',()=>{
 for(const [a,b] of [[3,4],[-5,12],[0,0],[0,-2]]){const {c,s,r}=givens(a,b);near(c*c+s*s,1);near(c*a+s*b,r);near(-s*a+c*b,0);}
 const f=givensHessenberg(hessenbergExample);matrixNear(multiply(f.Q,f.R),hessenbergExample);matrixNear(multiply(transpose(f.Q),f.Q),identity(5));
 for(let i=0;i<5;i++)for(let j=0;j<i;j++)near(f.R[i][j],0);
 for(const frame of f.frames)for(let j=0;j<frame.stage;j++)for(let i=j+1;i<5;i++)near(frame.work[i][j],0);
});
test('least-squares projection satisfies orthogonality and the optimality identity',()=>{
 const A=[[1,0],[0,1],[1,1]],b=[1,1,0],f=leastSquares(A,b);f.x.forEach(a=>near(a,1/3));near(f.residualNorm**2,4/3);f.orthogonality.forEach(a=>near(a,0));
 for(const h of [[1,0],[-2,3],[0.1,-0.2]]){const other=f.x.map((v,i)=>v+h[i]),r=matvec(A,other).map((v,i)=>v-b[i]);near(norm(r)**2,f.residualNorm**2+norm(matvec(A,h))**2);}
 const consistent=leastSquares(A,[1,2,3]);near(consistent.residualNorm,0);near(consistent.x[0],1);near(consistent.x[1],2);
});
test('formed Gram matrix loses the weak direction while QR retains the example solution',()=>{
 const normal=gramComparison(4);assert(normal.normalX);near(normal.qrX[0],1,1e-7);near(normal.qrX[1],-1,1e-7);
 const lost=gramComparison(8);assert.equal(lost.G[0][0],1);assert.equal(lost.normalX,null);near(lost.qrX[0],1,1e-7);near(lost.qrX[1],-1,1e-7);near(lost.condition**2/lost.gramCondition,1);
});
test('actual degree-ten regression reproduces interpolation and oversampling behaviour',()=>{
 const interpolation=polynomialFit(11,10),oversampled=polynomialFit(100,10);
 assert(interpolation.trainingRms<1e-10);assert(interpolation.gridMax>1);assert(oversampled.gridRms<interpolation.gridRms/3);assert(oversampled.gridMax<interpolation.gridMax/3);
 for(let i=0;i<11;i++)near(polynomial(interpolation.coefficients,interpolation.nodes[i]),regressionTarget(interpolation.nodes[i]),1e-9);
 // Independent orthogonality checks against all monomial columns.
 for(let j=0;j<=10;j++){let sum=0;for(let i=0;i<100;i++)sum+=oversampled.nodes[i]**j*(polynomial(oversampled.coefficients,oversampled.nodes[i])-oversampled.samples[i]);near(sum,0,1e-8);}
 const lower=polynomialFit(100,5);assert(lower.trainingRms>=oversampled.trainingRms);
});
test('fresh QR numeric answer keys agree with independent matrix identities',()=>{
 const [c,s]=exerciseMap.get('qr-cm1').answer;near(c*5+s*12,13);near(-s*5+c*12,0);
 const entries=exerciseMap.get('qr-e1').answer,A=[[1,0],[0,1],[1,1]];matrixNear([entries.slice(0,2),entries.slice(2,4)],multiply(transpose(A),A));
 const residual=exerciseMap.get('qr-d3').answer;matvec(transpose(A),residual).forEach(a=>near(a,0));
});
