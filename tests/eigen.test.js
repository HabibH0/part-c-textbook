import test from 'node:test';
import assert from 'node:assert/strict';
import {companion,companionExperiment,polynomialAt,complex,schurExperiment,powerExperiment,pageRankExperiment,rankNetworks,transitionMatrix,solveDense,inverseExperiment,shiftDistances,multiply,transpose,matvec,frobenius} from '../src/eigenMath.js';
import {identity,difference} from '../src/luMath.js';
import {exerciseMap} from '../content/catalog.js';
const near=(a,b,t=1e-11)=>assert(Math.abs(a-b)<=t,`${a} differs from ${b}`);
const matrixNear=(A,B)=>near(frobenius(difference(A,B)),0);

test('companion construction matches real and complex polynomial roots including repeated and zero roots',()=>{
 assert.deepEqual(companion([-6,11,-6]),[[6,-11,6],[1,0,0],[0,1,0]]);
 for(const [r,a,b] of [[2,0,1],[1,1,0],[0,0,0],[-3,2,2],[0.25,-1.5,0.75]]){
  const f=companionExperiment(r,a,b);
  for(const check of f.checks){near(check.polynomial.re,0);near(check.polynomial.im,0);near(check.residual,0);}
  // Independent characteristic determinant at values that need not be roots.
  for(const z of [-2,0.5,4]){
   const M=f.C.map((row,i)=>row.map((v,j)=>(i===j?z:0)-v));
   const determinant=M[0][0]*(M[1][1]*M[2][2]-M[1][2]*M[2][1])-M[0][1]*(M[1][0]*M[2][2]-M[1][2]*M[2][0])+M[0][2]*(M[1][0]*M[2][1]-M[1][1]*M[2][0]);
   near(determinant,(z-r)*((z-a)**2+b*b));near(polynomialAt(f.coefficients,complex(z)).re,determinant);
  }
 }
});
test('constructed Schur forms preserve similarity, spectra and the normality distinction',()=>{
 for(const angle of [0,30,75,180])for(const coupling of [0,1,5])for(const rotation of [false,true]){
  const f=schurExperiment(angle,coupling,rotation);
  matrixNear(multiply(transpose(f.U),f.U),identity(2));matrixNear(multiply(multiply(transpose(f.U),f.A),f.U),f.T);
  const trace=f.A[0][0]+f.A[1][1],det=f.A[0][0]*f.A[1][1]-f.A[0][1]*f.A[1][0];
  near(trace,rotation?0:3);near(det,rotation?1:2);
  if(rotation||coupling===0)near(f.normalDefect,0);else assert(f.normalDefect>0.1);
  if(!rotation){near(f.firstResidual,0);near(f.secondResidual,Math.abs(coupling));}
 }
});
test('power iterates agree with exact component ratios and Rayleigh quotients',()=>{
 for(const negative of [false,true])for(const k of [0,1,3,10]){
  const f=powerExperiment(1,45,k,negative),v=f.latest.x,first=(negative?-3:3)**k,length=Math.hypot(first,1);
  near(v[0],first/length);near(v[1],1/length);
  near(f.latest.rho,((negative?-3:3)*9**k+1)/(9**k+1));near(Math.hypot(...v),1);
  const E=matvec(f.A,v).map((a,i)=>v.map(x=>-(a-f.latest.rho*v[i])*x));
  matvec(f.A.map((row,i)=>row.map((a,j)=>a+E[i][j])),v).forEach((a,i)=>near(a,f.latest.rho*v[i]));
 }
});
test('power method exposes missing components, tied magnitudes, negative signs and zero products',()=>{
 const missing=powerExperiment(1,90,30);assert.deepEqual(missing.latest.x,[0,1]);assert.equal(missing.latest.rho,1);assert.equal(missing.latest.residual,0);
 const tied=powerExperiment(-3,45,4);near(tied.frames[0].x[0],tied.latest.x[0]);near(tied.frames[0].x[1],tied.latest.x[1]);assert(tied.latest.residual>2.9);
 const zero=powerExperiment(0,90,2);assert.match(zero.status,/Zero product/);assert.equal(zero.frames.length,1);
 const neg=powerExperiment(1,45,4,true);assert(neg.frames[1].x[0]<0&&neg.frames[2].x[0]>0);
});
test('PageRank handles dangling links, preserves probability and obeys contraction and residual bounds',()=>{
 assert.deepEqual(transitionMatrix([[0],[0]]),[[1,1],[0,0]]);
 for(const network of Object.keys(rankNetworks))for(const alpha of [0.5,0.85,0.95])for(const start of ['uniform','one']){
  const f=pageRankExperiment(network,alpha,40,start),n=f.P.length;
  for(let j=0;j<n;j++){near(f.P.reduce((s,row)=>s+row[j],0),1);near(f.A.reduce((s,row)=>s+row[j],0),1);}
  f.stationary.forEach(v=>assert(v>0));near(f.stationary.reduce((s,v)=>s+v,0),1);
  matvec(f.A,f.stationary).forEach((v,i)=>near(v,f.stationary[i]));
  let previous=Infinity;
  for(const frame of f.frames){near(frame.x.reduce((s,v)=>s+v,0),1);assert(frame.x.every(v=>v>=0));const distance=frame.x.reduce((s,v,i)=>s+Math.abs(v-f.stationary[i]),0);assert(distance<=alpha*previous+1e-13);previous=distance;}
  assert(f.distance<=f.bound+1e-13);
 }
 const dangling=transitionMatrix(rankNetworks.dangling.links);assert.deepEqual(dangling.map(row=>row[2]),[0.25,0.25,0.25,0.25]);
 matrixNear([pageRankExperiment('cycle',0.85,0).stationary],[[0.25,0.25,0.25,0.25]]);
});
test('shifted inverse iteration solves correctly, reuses factors, and handles singular and tied shifts',()=>{
 assert.deepEqual(solveDense([[0,1],[2,3]],[1,5]),[1,1]);
 const f=inverseExperiment(1.8,5);assert.equal(f.factorizations,1);assert.equal(f.solves,5);near(f.factor,0.25);
 near(f.frames[1].rho,533/273);
 for(const frame of f.frames){near(frame.x[0]/frame.x[1],(-0.25)**frame.k);near(frame.x[2]/frame.x[1],(1/16)**frame.k);}
 const singular=inverseExperiment(2,5);assert.match(singular.status,/Singular/);assert.equal(singular.solves,0);assert.equal(singular.frames.length,1);
 assert(shiftDistances([1,2,5],1.5).tied);assert(shiftDistances([1,2,5],2).singular);
 const tied=inverseExperiment(1.5,8);assert(tied.latest.residual>0.49);assert(tied.tied);
});
test('Rayleigh iteration displays actual local acceleration, stops on residual, and reports rounded singular shifts',()=>{
 const f=inverseExperiment(1.8,8,true);assert.match(f.status,/Converged/);assert(f.latest.residual<5e-13);assert.equal(f.factorizations,f.solves);assert(f.solves<8);near(f.latest.rho,2);
 for(let i=1;i<f.frames.length;i++)near(f.frames[i].shift,f.frames[i-1].rho);
 const r=f.frames.map(v=>v.residual);assert(r[3]<r[2]**2);assert(r[4]<r[3]**2);
 const rounded=inverseExperiment(1.8,8,true,true);assert.match(rounded.status,/working precision/);assert(rounded.latest.residual>5e-13);assert.equal(rounded.latest.rho,2);assert.equal(rounded.factorizations,rounded.solves+1);
});
test('new numeric exercise answers match independent eigenvalue and stationary calculations',()=>{
 const key=id=>exerciseMap.get('eig-'+id);
 assert.deepEqual(key('a2').answer,companion([-6,11,-6])[0]);
 assert.deepEqual(key('a3').answer.slice(3),matvec(companion([-6,11,-6]),key('a3').answer.slice(0,3)));
 near(key('c2').answer[0],powerExperiment(1,45,1).latest.rho);
 near(key('c4').parts[1].answer[0],powerExperiment(1,45,3).latest.rho);
 const P=transitionMatrix([[0],[0]]),A=P.map(row=>row.map(v=>0.8*v+0.1));
 assert.deepEqual(key('d3').answer,A.flat());
 matvec(A,key('d4').parts[0].answer.slice(0,2)).forEach((v,i)=>near(v,key('d4').parts[0].answer[i]));
 near(key('e4').parts[0].answer[1],inverseExperiment(1.8,1).latest.rho);
 assert.deepEqual(key('em1').answer,[shiftDistances([1,4,9],3.5).target,shiftDistances([1,4,9],3.5).factor]);
});
