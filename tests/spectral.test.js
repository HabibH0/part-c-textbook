import test from 'node:test';
import assert from 'node:assert/strict';
import {symmetricInput,symmetricReduction,symmetricQR,wilkinson,rationalSign,bidiagonalInput,bidiagonalise,gramLoss,spdPencil,homogeneousPair,quadraticExample,exponentialApproximation,taylorExp,spectralCosts,multiply,transpose,difference,frobenius,identity,matvec} from '../src/spectralMath.js';
import {exerciseMap} from '../content/catalog.js';
const near=(a,b,t=1e-10)=>assert(Math.abs(a-b)<=t,a+' differs from '+b);
const matrixNear=(A,B,t=1e-10)=>near(frobenius(difference(A,B)),0,t);
const orthogonal=Q=>matrixNear(multiply(transpose(Q),Q),identity(Q.length));

test('symmetric reduction preserves both halves of the zero pattern and the full similarity',()=>{
 for(const f of symmetricReduction().frames){
  orthogonal(f.U);matrixNear(f.H,transpose(f.H));matrixNear(multiply(multiply(transpose(f.U),symmetricInput),f.U),f.H);
  for(let j=0;j<f.stage;j++)for(let i=j+2;i<5;i++){near(f.H[i][j],0);near(f.H[j][i],0);}
 }
});
test('Wilkinson shifts are trailing-block eigenvalues and the symmetric iteration reconstructs input',()=>{
 for(const [a,b,d] of [[4,2,1],[2,1,2],[10,0,3],[-2,0.25,4],[1,1e-8,3]]){
  const s=wilkinson(a,b,d);near((a-s)*(d-s)-b*b,0);const other=a+d-s;assert(Math.abs(s-d)<=Math.abs(other-d)+1e-12);
 }
 near(wilkinson(4,2,1),0);near(wilkinson(2,1,2),1);
 for(const A of [symmetricInput,[[0,1],[1,0]],[[2,0,0],[0,2,0],[0,0,2]],[[0,0],[0,0]]]){
  const f=symmetricQR(A);assert(f.complete);assert(f.residual<1e-10);orthogonal(f.V);
  matrixNear(multiply(multiply(f.V,f.T),transpose(f.V)),A);
  for(const frame of f.frames){matrixNear(frame.T,transpose(frame.T));frame.T.forEach((row,i)=>row.forEach((v,j)=>{if(Math.abs(i-j)>1)near(v,0);}));}
  f.values.forEach((lambda,j)=>{const v=f.V.map(row=>row[j]);near(Math.hypot(...matvec(A,v).map((a,i)=>a-lambda*v[i])),0);});
 }
 const cap=symmetricQR(symmetricInput,1e-12,0);assert(!cap.complete);assert.equal(cap.values,null);
});
test('rational sign filtering converges to complementary projectors and reports a threshold collision',()=>{
 assert.equal(rationalSign(0,3),null);near(rationalSign(2,1).r,1.25);near(rationalSign(2,1).projector,1.125);
 for(const z of [-4,-2,-0.5,0.5,1,2,4]){
  const f=rationalSign(z,8);near(f.r,Math.sign(z));near(f.projector,z>0?1:0);
  near(rationalSign(z,3).projector+rationalSign(-z,3).projector,1);
 }
});
test('alternating bidiagonal reflectors preserve orthogonality, singular spectrum and all stage reconstructions',()=>{
 for(const A of [bidiagonalInput,[[1,0,0],[0,0,0],[0,0,2],[0,0,0]],[[3],[4]],[[0,0],[0,0]],[[1,2],[3,4]]]){
  const f=bidiagonalise(A);
  for(const stage of f.frames){
   orthogonal(stage.L);orthogonal(stage.R);matrixNear(multiply(multiply(stage.L,stage.B),transpose(stage.R)),A);
   matrixNear(multiply(transpose(stage.B),stage.B),multiply(multiply(transpose(stage.R),multiply(transpose(A),A)),stage.R));
  }
  f.B.forEach((row,i)=>row.forEach((v,j)=>{if(j!==i&&j!==i+1)near(v,0);}));
  near(frobenius(f.B),frobenius(A));
 }
 assert.deepEqual(bidiagonalise(bidiagonalInput).frames.map(f=>f.label),['Original matrix','Left reflector 1','Right reflector 1','Left reflector 2','Right reflector 2','Left reflector 3','Left reflector 4']);
 assert.throws(()=>bidiagonalise([[1,2,3],[4,5,6]]),/m ≥ n/);
});
test('Gram example demonstrates actual small-value loss in floating point, not display rounding',()=>{
 const mild=gramLoss(2),lost=gramLoss(8);assert(!mild.lost);assert(lost.lost);assert.equal(lost.gramSmall,0);assert.equal(lost.small,1e-8);
 near(mild.gramSmall,mild.epsilon,1e-12);
 for(const p of [1,4,8,12]){
  const f=gramLoss(p),v=[1/Math.SQRT2,-1/Math.SQRT2],av=matvec(f.A,v);
  near(Math.hypot(...av)/f.epsilon,1);
 }
});
test('positive-definite pencil eigenpairs obey the original equation and B-orthogonality',()=>{
 for(const b of [0.25,1,4,8])for(const t of [-3,-0.5,0,1,3]){
  const f=spdPencil(b,t);matrixNear(f.S,transpose(f.S));near(f.orthogonality,0);
  for(const lambda of f.values)near((2-lambda*b)*(3-lambda)-t*t,0);
  f.residuals.forEach(r=>near(r,0));
  matrixNear(multiply(multiply(transpose(f.X),f.A),f.X),f.values.map((lambda,i)=>f.values.map((_,j)=>i===j?lambda:0)));
 }
 assert.deepEqual(homogeneousPair(6,2),{kind:'finite',value:3});assert.equal(homogeneousPair(3,0).kind,'infinite');assert.equal(homogeneousPair(0,0).kind,'indeterminate');assert.equal(homogeneousPair(0,2).value,0);
});
test('quadratic linearisation matches original roots and nonlinear approximation residuals remain distinct',()=>{
 for(const [r1,r2] of [[1,2],[-3,0],[1,1],[-0.25,2.5]]){
  const f=quadraticExample(r1,r2);f.residuals.forEach(r=>near(r,0));
  for(const z of [-2,0.25,4])near(z*(z+f.b)+f.c,(z-r1)*(z-r2));
 }
 near(exponentialApproximation(1).root,1);near(exponentialApproximation(2).root,Math.sqrt(3)-1);
 let last=Infinity;for(let degree=1;degree<=8;degree++){const f=exponentialApproximation(degree);near(taylorExp(f.root,degree),2);near(f.residual,Math.exp(f.root)-2);assert(Math.abs(f.residual)<last);last=Math.abs(f.residual);assert(f.root>=Math.log(2)-1e-12);}
 assert(Math.abs(exponentialApproximation(2).residual)>0.01);
});
test('cost estimates distinguish additional vector work, aspect ratio and polynomial dimension',()=>{
 const a=spectralCosts(30,60,3),b=spectralCosts(60,120,3),c=spectralCosts(30,60,6);
 near(b.symmetricValues/a.symmetricValues,8);near(b.svdReduction/a.svdReduction,8);near(c.polynomial/a.polynomial,8);
 near(a.expanded,90);near(spectralCosts(3,3).svdReduction,72);near(spectralCosts(3,3).svdSquareLike,72);assert(a.svdReduction!==a.svdSquareLike);
 near(a.generalValues+a.generalVectors,25*30**3);
});
test('new numerical answer keys agree with independent calculations and matrix equations',()=>{
 const key=(id,part)=>part===undefined?exerciseMap.get('sp-'+id).answer:exerciseMap.get('sp-'+id).parts[part].answer;
 const check=(a,b)=>{assert.equal(a.length,b.length);a.forEach((v,i)=>near(v,b[i]));};
 check(key('a2'),[8+7]);check(key('a3'),[2,4,wilkinson(3,1,3)]);check(key('am2',0),[0,5,wilkinson(4,2,1)]);
 check(key('am3',0),[rationalSign(2,1).r,rationalSign(2,1).projector]);
 check(key('b3'),multiply(transpose([[3,4],[0,2]]),[[3,4],[0,2]]).flat());
 const G=multiply(transpose([[2,1,0],[0,3,2],[0,0,4]]),[[2,1,0],[0,3,2],[0,0,4]]);
 check(key('bm1',0),[G[0][0],G[1][1],G[2][2],G[0][1],G[1][2]]);check(key('bm1',1),[G[0][0]+G[1][1]+G[2][2]]);
 check(key('bm3',0),[spectralCosts(3,3).svdReduction]);
 check(key('c4'),multiply(multiply([[0.5,0],[0,1]],[[4,2],[2,3]]),[[0.5,0],[0,1]]).flat());
 check(key('c5',0),[0.5,0,4*0.5**2]);check(key('cm3',0),[1,1]);
 check(key('d3'),[...quadraticExample(2,3).M.flat(),2,3]);check(key('d4',0),[30,20*30**3]);check(key('d7',0),[0.02+0.003]);check(key('dm2',0),[0.004*2+0.001]);
 check(key('dm1',0),[0.5,2]);for(const r of key('dm1',0))near(2*r*r-5*r+2,0);
});
