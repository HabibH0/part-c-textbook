import test from 'node:test';
import assert from 'node:assert/strict';
import {exampleLU,lateSwap,growthExample,factorLU,rankOneFrames,solveTriangularTrace,choleskySteps,choleskyFamily,multiply,transpose,matvec,difference,maxEntry} from '../src/luMath.js';
import {exerciseMap} from '../content/catalog.js';
const near=(a,b,tolerance=1e-10)=>assert(Math.abs(a-b)<=tolerance,`${a} differs from ${b}`);
const matrixNear=(A,B)=>near(maxEntry(difference(A,B)),0);

test('LU demonstrations preserve PA=LU at every stage including later row swaps',()=>{
 for(const A of [exampleLU,lateSwap,growthExample,[[0,1],[1,0]],[[0,2,3],[1,0,4],[5,6,0]]]){
  const f=factorLU(A,true);assert(f.complete);
  for(const s of f.steps){matrixNear(multiply(s.L,s.U),s.permutation.map(i=>A[i]));assert.equal(new Set(s.permutation).size,A.length);}
  for(let i=0;i<A.length;i++)for(let j=0;j<A.length;j++){if(i>j)near(f.U[i][j],0);if(i<j)near(f.L[i][j],0);if(i===j)near(f.L[i][j],1);if(i>j)assert(Math.abs(f.L[i][j])<=1+1e-12);}
 }
 const late=factorLU(lateSwap,true);assert.deepEqual(late.permutation,[0,2,1]);near(late.L[1][0],0.25);near(late.L[2][0],0.5);near(late.L[2][1],2/11);
 assert(!factorLU([[0,1],[1,0]],false).complete);
 assert(!factorLU([[1,2],[2,4]],true).complete);
});
test('outer products reconstruct the input and clear the first k rows and columns',()=>{
 const {L,U,frames}=rankOneFrames(exampleLU);matrixNear(multiply(L,U),exampleLU);
 frames.forEach((f,k)=>{
  matrixNear(f.sum.map((row,i)=>row.map((v,j)=>v+f.residual[i][j])),exampleLU);
  for(let i=0;i<3;i++)for(let j=0;j<3;j++)if(i<k||j<k)near(f.residual[i][j],0);
 });
 matrixNear(frames[3].sum,exampleLU);near(maxEntry(frames[3].residual),0);
});
test('triangular trace solves each row in dependency order and agrees with independent right-hand sides',()=>{
 const {L,U}=factorLU(exampleLU,false);
 for(const expected of [[1,2,1],[2,-1,0],[1,0,0],[-3,4,0.5]]){
  const b=matvec(exampleLU,expected),{x,y,steps}=solveTriangularTrace(L,U,b);
  x.forEach((v,i)=>near(v,expected[i]));matvec(L,y).forEach((v,i)=>near(v,b[i]));matvec(U,x).forEach((v,i)=>near(v,y[i]));
  assert.deepEqual(steps.slice(1).map(s=>s.index),[0,1,2,2,1,0]);assert.deepEqual(steps[1].x,[null,null,null]);
 }
 assert.throws(()=>solveTriangularTrace([[0]],[[1]],[1]),/Singular/);
});
test('partial pivoting controls small-pivot growth but can still grow by a factor four',()=>{
 const A=[[0.0001,1],[1,1]],no=factorLU(A,false),yes=factorLU(A,true);
 near(no.L[1][0],10000);near(no.U[1][1],-9999);near(yes.L[1][0],0.0001);near(yes.U[1][1],0.9999);
 near(no.growth,9999);near(yes.growth,1);near(factorLU(growthExample,true).growth,4);
});
test('Cholesky reconstructs positive inputs and reports zero/negative pivots without invalid division',()=>{
 for(const t of [0.25,1,4,6]){const A=choleskyFamily(t),f=choleskySteps(A);assert(f.complete);matrixNear(multiply(f.C,transpose(f.C)),A);f.C.forEach((r,i)=>assert(r[i]>0));
  for(let k=1;k<f.steps.length;k++)for(let i=0;i<3;i++)for(let j=0;j<3;j++)if(i<k||j<k)near(f.steps[k].residual[i][j],0);
 }
 const boundary=choleskySteps(choleskyFamily(0));assert(!boundary.complete);near(boundary.pivot,0);matrixNear(multiply(boundary.C,transpose(boundary.C)),choleskyFamily(0));
 const negative=choleskySteps(choleskyFamily(-1));assert(!negative.complete);near(negative.pivot,-1);assert(negative.C.flat().every(Number.isFinite));
 // An independently constructed positive-definite matrix, not just the slider family.
 const C=[[3,0,0],[-2,4,0],[5,-1,2]],A=multiply(C,transpose(C));matrixNear(choleskySteps(A).C,C);
});
test('numeric exercise keys agree with factorisation and solve identities',()=>{
 const solve=solveTriangularTrace(factorLU(exampleLU,false).L,factorLU(exampleLU,false).U,[5,13,31]);
 assert.deepEqual(exerciseMap.get('lu-b4').parts[0].answer,solve.y);assert.deepEqual(exerciseMap.get('lu-b4').parts[1].answer,solve.x);
 for(const [id,A] of [['lu-d3',[[9,6],[6,8]]],['lu-dm1',[[4,2],[2,10]]]]){
  const [a,b,c]=exerciseMap.get(id).answer;matrixNear(multiply([[a,0],[b,c]],[[a,b],[0,c]]),A);
 }
});
