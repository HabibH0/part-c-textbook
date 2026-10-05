import test from 'node:test';
import assert from 'node:assert/strict';
import {roundBinary,harmonicSimulation,subtractionSensitivity,diagonalPerturbation,growthExperiment,roundedOuter,gramSchmidt,qrStabilityExperiment,frobenius} from '../src/stabilityMath.js';
import {multiply,transpose,identity,difference,matvec} from '../src/luMath.js';
import {exerciseMap} from '../content/catalog.js';
const near=(a,b,t=1e-12)=>assert(Math.abs(a-b)<=t,`${a} differs from ${b}`);

test('toy binary rounding handles both tie directions, sign, exponent changes and relative-error bounds',()=>{
 near(roundBinary(1.0625,4),1);near(roundBinary(1.1875,4),1.25);
 near(roundBinary(-1.1875,4),-1.25);near(roundBinary(1.9375,4),2);
 near(roundBinary(1.2,4),1.25);near(roundBinary(0,4),0);
 for(let p=4;p<=16;p++)for(const x of [1/3,-1/7,1.99,3.7,100.3,0.0000311]){
  const y=roundBinary(x,p);assert(Math.abs(y-x)<=2**(-p)*Math.abs(x));near(roundBinary(y,p),y);
 }
});
test('harmonic simulation really stagnates and every subsequent smaller term leaves the value unchanged',()=>{
 let previous=0;
 for(let p=4;p<=12;p++){
  const f=harmonicSimulation(p);assert(f.stop>previous);previous=f.stop;
  for(let n=f.stop;n<f.stop+100;n++)assert.equal(roundBinary(f.sum+roundBinary(1/n,p),p),f.sum);
  assert(f.points.length>5);assert(f.reference>0);near(f.points.at(-1).sum,f.sum);
 }
});
test('affine relative sensitivity matches finite changes on either side and at different scales',()=>{
 for(const p of [1,3,6,10])for(const direction of [-1,1]){
  const f=subtractionSensitivity(p,direction);near(f.forward,f.predicted,1e-10);assert.equal(Math.sign(f.actualDelta),direction);
  near(f.output,f.changed-1);assert(f.condition>=10);
 }
});
test('diagonal perturbation obeys the finite bound and its residual supplies a valid backward perturbation',()=>{
 for(const p of [0,4,12])for(const t of [0.01,0.1,0.9]){
  const f=diagonalPerturbation(p,t),perturbed=f.A.map((row,i)=>row.map((v,j)=>v+f.deltaA[i][j]));
  matvec(perturbed,f.xhat).forEach((v,i)=>near(v,f.b[i]));near(f.condition*f.inputError,t);
  assert(f.forward<=f.bound);near(f.forward,t/((1-t)*Math.sqrt(2)));
  const normSquared=f.xhat.reduce((s,v)=>s+v*v,0),D=f.residual.map(r=>f.xhat.map(x=>r*x/normSquared));
  matvec(D,f.xhat).forEach((v,i)=>near(v,f.residual[i]));near(frobenius(D),f.backward);
 }
});
test('partial-pivoting growth family doubles its final column while exactly reconstructing its input',()=>{
 for(let n=3;n<=10;n++){
  const f=growthExperiment(n);assert(f.complete);assert.equal(f.growth,2**(n-1));assert.equal(f.relativeResidual,0);
  assert.deepEqual(f.U.map(row=>row[n-1]),Array.from({length:n},(_,i)=>2**i));
  assert(f.L.flat().every(x=>Math.abs(x)<=1));
 }
});
test('rounded outer products have the exact rank obstruction at every offered toy precision',()=>{
 for(let p=4;p<=16;p++){
  const f=roundedOuter(p);near(f.exact[0][0]*f.exact[1][1]-f.exact[0][1]*f.exact[1][0],0,0);
  near(f.determinant,-f.delta*f.delta,0);assert(f.determinant!==0);
  assert(f.relativeError<=2**(-p));assert(f.relativeError>0);
 }
});
test('Gram–Schmidt variants and second-pass factor update satisfy independent QR identities',()=>{
 const A=[[3,3],[4,4],[0,5]];
 for(const modified of [false,true]){
  const f=gramSchmidt(A,modified);assert(f.complete);
  near(frobenius(difference(multiply(f.Q,f.R),A)),0);
  near(frobenius(difference(multiply(transpose(f.Q),f.Q),identity(2))),0);
 }
 assert.equal(gramSchmidt([[1,1],[0,0]],true).complete,false);
 for(const p of [1,4,8,12]){
  const f=qrStabilityExperiment(p);assert(f.results.every(r=>r.complete&&Number.isFinite(r.orthogonality)));
  const [cgs,mgs,twice,hh]=f.results;assert(twice.orthogonality<1e-12);assert(hh.orthogonality<1e-12);
  for(const r of f.results)assert(r.reconstruction<1e-12);
  if(p>=8){assert(cgs.orthogonality>0.1);assert(mgs.orthogonality<cgs.orthogonality);assert(twice.orthogonality<mgs.orthogonality);}
 }
});
test('stability numerical answer keys agree with independent calculations',()=>{
 const key=id=>exerciseMap.get('st-'+id);
 assert.deepEqual(key('a4').parts[0].answer,[roundBinary(1.0625,4),roundBinary(1.1875,4)]);
 near(key('b4').answer[0]**2,4.0401);near(key('b4').answer[2],(4.0401-4)/4);
 near(key('c3').answer[1],(20*0.01)/(1-20*0.01));
 assert.deepEqual(key('d4').parts[0].answer,growthExperiment(6).U.map(row=>row[5]));
 near(key('e3').answer[0],roundedOuter(8).determinant);
 assert.deepEqual(key('e5').answer,matvec(transpose([[0,-1],[1,0]]),[0.01,-0.02]));
 assert.deepEqual(key('f5').answer,multiply([[1,0.5],[0,2]],[[2,1],[0,3]]).flat());
});
