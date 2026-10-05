// Exact formulas for the small matrix families used in the demonstrations.
export function planeScores(degrees){
  const t=degrees*Math.PI/180;
  return {weakest:Math.hypot(3*Math.cos(t),Math.sin(t)),strongest:Math.hypot(5*Math.cos(t),3*Math.sin(t))};
}
export function perturbedHermitian(t,kind='off-diagonal'){
  const values=kind==='shift'?[4+t,1+t]:[(5+Math.hypot(3,2*t))/2,(5-Math.hypot(3,2*t))/2];
  return {values,norm:Math.abs(t),intervals:[4,1].map(x=>[x-Math.abs(t),x+Math.abs(t)])};
}
export function jordanSpectrum(n,p){
  const radius=10**(-p/n);
  return {radius,amplificationExponent:p*(1-1/n),roots:Array.from({length:n},(_,k)=>({real:1+radius*Math.cos(2*Math.PI*k/n),imag:radius*Math.sin(2*Math.PI*k/n)}))};
}
export function augmentedSpectrum(t,direction='weak'){
  const values=(direction==='weak'?[3,Math.hypot(1,t)]:[Math.hypot(3,t),1]).sort((a,b)=>b-a);
  return {values,condition:values[0]/values[1]};
}
