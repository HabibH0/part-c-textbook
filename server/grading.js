export function grade(exercise, raw) {
  if(typeof raw!=='string') return false;
  if(exercise.type==='multi') {
    try {const values=JSON.parse(raw);return Array.isArray(values)&&values.length===exercise.parts.length&&exercise.parts.every((part,i)=>grade(part,values[i]));} catch {return false;}
  }
  if (exercise.type === 'choice') return raw === exercise.answer;
  if (exercise.type !== 'numeric') return false;
  const parts = raw.trim().split(/[,;\s]+/).filter(Boolean);
  const numbers = parts.map(part => {
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?(?:\/[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)?$/i.test(part)) return NaN;
    const [a,b] = part.split('/').map(Number); return b === undefined ? a : a/b;
  });
  return numbers.length === exercise.answer.length && numbers.every((n,i) => Number.isFinite(n) && Math.abs(n-exercise.answer[i]) <= 1e-6 * Math.max(1,Math.abs(exercise.answer[i])));
}
