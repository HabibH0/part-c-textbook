import test from 'node:test';
import assert from 'node:assert/strict';
import {planeScores,perturbedHermitian,jordanSpectrum,augmentedSpectrum} from '../src/minmaxMath.js';
const near=(a,b,tolerance=1e-10)=>assert(Math.abs(a-b)<=tolerance,`${a} differs from ${b}`);

test('plane extrema bracket the second singular value and attain both bounds',()=>{
  near(planeScores(0).weakest,3);near(planeScores(90).strongest,3);
  for(const angle of [0,15,45,63,90]){
    const {weakest,strongest}=planeScores(angle);assert(weakest<=3+1e-12);assert(strongest>=3-1e-12);
    // Sample actual vectors in each plane and verify the claimed minimum/maximum.
    const t=angle*Math.PI/180;
    for(let j=0;j<=90;j++){
      const a=Math.cos(j*Math.PI/180),b=Math.sin(j*Math.PI/180);
      assert(Math.hypot(5*a,3*b*Math.cos(t),b*Math.sin(t))>=weakest-1e-12);
      assert(Math.hypot(5*b*Math.cos(t),3*b*Math.sin(t),a)<=strongest+1e-12);
    }
  }
});
test('Weyl explorer eigenvalues satisfy the characteristic polynomial and norm bounds',()=>{
  for(const t of [-2,-0.8,0,0.25,2])for(const kind of ['off-diagonal','shift']){
    const {values,norm,intervals}=perturbedHermitian(t,kind);
    values.forEach((v,i)=>{
      assert(v>=intervals[i][0]-1e-12&&v<=intervals[i][1]+1e-12);
      const d=kind==='shift'?t:0,off=kind==='shift'?0:t;
      near((4+d-v)*(1+d-v)-off*off,0);
      if(kind==='shift')near(Math.abs(v-[4,1][i]),norm);
    });
  }
});
test('Jordan roots obey the eigenvector recurrence and reproduce the extreme example',()=>{
  for(const [n,p] of [[2,4],[3,3],[5,5]]){
    const {radius,roots}=jordanSpectrum(n,p);
    for(const root of roots){
      const z={r:root.real-1,i:root.imag};let power={r:1,i:0};
      for(let j=0;j<n;j++)power={r:power.r*z.r-power.i*z.i,i:power.r*z.i+power.i*z.r};
      near(power.r,10**(-p),1e-13);near(power.i,0,1e-13);near(Math.hypot(z.r,z.i),radius);
    }
  }
  const extreme=jordanSpectrum(100,100);near(extreme.radius,0.1);near(extreme.amplificationExponent,99);assert.equal(extreme.roots.length,100);
});
test('augmentation preserves sorted-value bounds, handles crossing and can worsen conditioning',()=>{
  for(const t of [0,1,Math.sqrt(8),4,6])for(const direction of ['weak','strong']){
    const {values}=augmentedSpectrum(t,direction);assert(values[0]>=values[1]);assert(values[0]>=3-1e-12);assert(values[1]>=1-1e-12);
    // Trace and determinant of the actual augmented Gram matrix.
    near(values[0]**2+values[1]**2,10+t*t);
    near((values[0]*values[1])**2,direction==='weak'?9*(1+t*t):9+t*t);
  }
  near(augmentedSpectrum(Math.sqrt(8),'weak').condition,1);
  near(augmentedSpectrum(4,'strong').condition,5);
  near(augmentedSpectrum(4,'weak').values[0]**2,17);
});
