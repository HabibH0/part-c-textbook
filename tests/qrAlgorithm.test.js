import test from 'node:test';
import assert from 'node:assert/strict';
import {denseQRSequence,baseQR,hessenbergReduction,denseHessenbergInput,hessenbergQRStep,benchmarkHessenberg,benchmarkSpectrum,runQR,filterLog,doubleShiftPolynomial,refinementA,balanceExample,multiply,transpose,identity,difference,frobenius,trace} from '../src/qrAlgorithmMath.js';
import {exerciseMap} from '../content/catalog.js';
const near=(a,b,t=1e-11)=>assert(Math.abs(a-b)<=t,`${a} differs from ${b}`);
const matrixNear=(A,B,t=1e-11)=>near(frobenius(difference(A,B)),0,t);
const orthogonal=Q=>matrixNear(multiply(transpose(Q),Q),identity(Q.length));
const hessenberg=H=>H.forEach((row,i)=>row.forEach((v,j)=>{if(i>j+1)near(v,0);}));

test('QR accumulated identities hold for nonnormal inputs, shifted powers and singular shifts',()=>{
 for(const A of [baseQR,[[1,4,2],[2,3,-1],[0,1,2]],[[0,1],[0,0]]])for(const shift of [0,0.9,1,3]){
  for(const f of denseQRSequence(A,8,shift)){
   orthogonal(f.U);matrixNear(multiply(multiply(transpose(f.U),A),f.U),f.B);
   near(frobenius(difference(multiply(f.U,f.S),f.product))/Math.max(1,frobenius(f.product)),0);
   f.S.forEach((row,i)=>row.forEach((v,j)=>{if(i>j)near(v,0);}));
  }
 }
 const exact=denseQRSequence(baseQR,1,1).at(-1);near(exact.B[1][0],0);near(exact.B[0][0],3);near(exact.B[1][1],1);
});
test('two-sided Hessenberg reduction preserves similarity and every previously cleared column',()=>{
 for(const A of [denseHessenbergInput,[[1,2,3],[0,2,4],[0,0,3]],[[0,0,0],[0,0,0],[0,0,0]],[[1,2],[3,4]]]){
  const result=hessenbergReduction(A);hessenberg(result.H);
  for(const f of result.frames){
   orthogonal(f.U);matrixNear(multiply(multiply(transpose(f.U),A),f.U),f.H);
   for(let j=0;j<f.stage;j++)for(let i=j+2;i<A.length;i++){near(f.H[i][j],0);near(f.left[i][j],0);}
   if(f.v)for(let j=0;j<f.stage;j++)near(f.v[j],0);
  }
 }
});
test('local Givens steps preserve Hessenberg shape and full embedded similarity including couplings',()=>{
 const full=hessenbergReduction(denseHessenbergInput).H;
 for(const active of [2,3,4,5])for(const shift of [0,-2.5,3]){
  const H=full.map(row=>[...row]);if(active<5)H[active][active-1]=0;
  const f=hessenbergQRStep(H,shift,active);hessenberg(f.H);orthogonal(f.Q);
  matrixNear(multiply(multiply(transpose(f.Q),H),f.Q),f.H);
  near(trace(H),trace(f.H));assert.equal(f.rotations.length,active-1);
  for(let i=active;i<5;i++)for(let j=active;j<5;j++)near(f.H[i][j],H[i][j]);
 }
 const f=hessenbergQRStep([[1,2,7],[3,4,8],[0,0,9]],1,2);
 assert(Math.abs(f.H[0][2]-7)>0.1,'The upper coupling must actually be updated.');
});
test('computed convergence histories recover the known spectrum with controlled deflations',()=>{
 const H=benchmarkHessenberg(),runs=['none','trailing'].map(strategy=>runQR(H,strategy));
 for(const run of runs){
  assert(run.complete);assert.equal(run.deflations.length,4);orthogonal(run.U);assert(run.relativeResidual<1e-10);
  run.eigenvalues.slice().sort((a,b)=>a-b).forEach((v,i)=>near(v,benchmarkSpectrum[i],1e-10));
  for(let i=0;i<run.frames.length;i++){
   const f=run.frames[i];hessenberg(f.H);if(i)assert(f.active<=run.frames[i-1].active);
   for(let j=f.active;j<5;j++)assert(f.H[j][j-1]===0);
  }
  for(const d of run.deflations){const f=run.frames[d.k],j=d.index;assert(d.removed<=1e-12*Math.max(Math.abs(f.H[j-1][j-1])+Math.abs(f.H[j][j]),Number.EPSILON*frobenius(H)));}
 }
 assert(runs[0].steps>100);assert(runs[1].steps<30);assert(runs[1].steps<runs[0].steps);
});
test('scalar teaching loop reports stalls and nonreal pairs as incomplete rather than false eigenvalues',()=>{
 for(const H of [[[0,1],[1,0]],[[0,-1],[1,0]]]){
  const f=runQR(H,'trailing',1e-12,12);assert.equal(f.complete,false);assert.equal(f.eigenvalues,null);assert.equal(f.steps,12);assert.equal(f.active,2);assert(f.relativeResidual<1e-12);
 }
 const diagonal=runQR([[3,4,5],[0,2,6],[0,0,1]]);assert(diagonal.complete);assert.equal(diagonal.steps,0);assert.deepEqual(diagonal.eigenvalues,[3,2,1]);
});
test('filter values and real paired-shift polynomials match independently evaluated scalar identities',()=>{
 near(10**(filterLog(1,0.9,2)-filterLog(3,0.9,2)),1/441);
 for(const z of [-1,0,1,2,4])for(const k of [1,2,8])near(filterLog(z,0.9,k,true),-filterLog(z,0.9,k));
 assert.equal(filterLog(1,1,2),-Infinity);assert.equal(filterLog(1,1,2,true),Infinity);
 // Real/imaginary multiplication of (A-(a+ib)I)(A-(a-ib)I).
 for(const a of [0,1.5,3])for(const b of [0.25,1,2]){
  const X=refinementA.map((row,i)=>row.map((v,j)=>v-(i===j?a:0))),P=doubleShiftPolynomial(refinementA,a,b);
  const expected=multiply(X,X).map((row,i)=>row.map((v,j)=>v+(i===j?b*b:0)));matrixNear(P,expected);
  matrixNear(doubleShiftPolynomial([[1,0],[0,4]],a,b),[[(1-a)**2+b*b,0],[0,(4-a)**2+b*b]]);
 }
});
test('balancing changes norms but preserves spectrum and transports perturbations consistently',()=>{
 for(const p of [-2,-1,0,0.5,1,2]){
  const f=balanceExample(p);near(f.trace,3);near(f.determinant,1);near(f.scaleCondition,Math.max(...f.d)/Math.min(...f.d));
  const D=f.d.map((v,i)=>f.d.map((_,j)=>i===j?v:0)),Di=f.d.map((v,i)=>f.d.map((_,j)=>i===j?1/v:0));matrixNear(multiply(multiply(Di,f.B),D),f.A);
  const E=[[0,1],[0,0]],transported=multiply(multiply(Di,E),D);assert(frobenius(transported)<=f.scaleCondition*frobenius(E)+1e-12);
 }
 matrixNear(balanceExample(1).B,[[1,1],[1,2]]);near(balanceExample(1).balancedNorm,Math.sqrt(7));assert(balanceExample(2).balancedNorm>balanceExample(1).balancedNorm);
});
test('numeric exercise keys agree with separate matrix products and arithmetic',()=>{
 const key=(id,part)=>part===undefined?exerciseMap.get('qra-'+id).answer:exerciseMap.get('qra-'+id).parts[part].answer;
 const check=(a,b)=>{assert.equal(a.length,b.length);a.forEach((v,i)=>near(v,b[i]));};
 check(key('a3'),multiply([[5,4],[0,3]],[[2,-1],[1,2]]).flat().map(v=>v/5));
 check(key('am1',0),multiply([[10,6],[0,8]],[[3,-1],[1,3]]).flat().map(v=>v/10));
 check(key('b3'),[0.1/2.1,(0.1/2.1)**2]);check(key('bm1',0),[0.5/3.5,(0.5/3.5)**3]);
 check(key('d3'),[(2+3),Number(3<=2+3)]);check(key('d5'),[3*[2,3,4,5].reduce((s,m)=>s+m*m,0)]);
 check(key('dm1',0),[4+6,Number(12<=4+6)]);check(key('dm2',1),[2*(4+9+16)]);
 check(key('e1'),[-2*2,2**2+3**2]);check(key('e3'),balanceExample(1).B.flat());
 check(key('e4',0),[balanceExample(1).scaleCondition]);check(key('e4',1),[balanceExample(1).balancedNorm**2]);
 check(key('e5'),[(1-2)**2+1,(4-2)**2+1]);check(key('em1',0),[2,(-1)**2+2**2]);check(key('em1',1),[(3+1)**2+4]);
 const D=[[1,0],[0,4]],Di=[[1,0],[0,0.25]];check(key('em2',0),multiply(multiply(D,[[3,16],[1,4]]),Di).flat());
});
