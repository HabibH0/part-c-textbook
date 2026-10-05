import {useMemo,useState} from 'react';
import {MathText} from './MathText';
import {harmonicSimulation,subtractionSensitivity,diagonalPerturbation,growthExperiment,roundedOuter,qrStabilityExperiment,unitRoundoff} from './stabilityMath';
const S=String.raw;
const fmt=x=>x===0?'0':Math.abs(x)<0.0001||Math.abs(x)>=1e6?x.toExponential(4):Number(x.toPrecision(7)).toLocaleString('en-GB',{maximumFractionDigits:8});
function Slider({label,value,onChange,min,max,step=1}){return <label className="slider-label"><span>{label}<b>{fmt(value)}</b></span><input aria-label={label} type="range" min={min} max={max} step={step} value={value} style={{'--fill':`${(value-min)/(max-min)*100}%`}} onChange={e=>onChange(Number(e.target.value))}/></label>;}
function Results({rows}){return <dl className="lab-results" aria-live="polite">{rows.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;}
function Matrix({A,label}){return <figure className="lu-matrix"><figcaption>{label}</figcaption><table aria-label={label}><tbody>{A.map((r,i)=><tr key={i}>{r.map((v,j)=><td key={j}>{fmt(v)}</td>)}</tr>)}</tbody></table></figure>;}
function Floating(){const[p,setP]=useState(8),f=useMemo(()=>harmonicSimulation(p),[p]),last=f.points.at(-1),X=n=>35+380*n/last.n,Y=y=>250-210*y/last.reference;const path=key=>f.points.map((v,i)=>`${i?'L':'M'}${X(v.n)},${Y(v[key])}`).join(' ');return <>
 <p>Accumulate 1/n in a small binary system. Each division and addition rounds to the selected precision, using ties to even. The exponent range is unrestricted; this isolates significand rounding.</p>
 <Slider label="Significant binary digits p" value={p} min={4} max={12} onChange={setP}/><div className="preset-row"><button onClick={()=>setP(4)}>4 bits</button><button onClick={()=>setP(12)}>12 bits</button></div>
 <Results rows={[["Toy unit roundoff",fmt(2**(-p))],["First addition that leaves the sum unchanged",f.stop?`n = ${f.stop}`:'Not reached'],["Stored sum",fmt(f.sum)],["Binary64 partial sum at that index",fmt(f.reference)]]}/>
 <svg className="plot" viewBox="0 0 450 310" role="img" aria-label={`Harmonic sum stagnates at term ${f.stop}, stored value ${fmt(f.sum)}, compared with binary64 partial sum ${fmt(f.reference)}.`}><line className="axis" x1="35" x2="415" y1="250" y2="250"/><line className="axis" x1="35" x2="35" y1="25" y2="250"/><path d={path('reference')} fill="none" stroke="var(--gold)" strokeWidth="2"/><path d={path('sum')} fill="none" stroke="var(--accent)" strokeWidth="2"/><text x="35" y="271">1</text><text x="370" y="271">{f.stop}</text><text x="35" y="299">Gold: binary64 reference · Blue: toy arithmetic</text></svg>
 <p>The binary64 curve is a finite reference sum, not the exact infinite series. After stagnation, all later toy terms are too small to change the stored sum.</p>
 <Results rows={[["Actual binary64 unit roundoff",fmt(unitRoundoff)],["Actual (sqrt(2)² − 2) × 10¹⁵",((Math.sqrt(2)**2-2)*1e15).toPrecision(8)]]}/>
 </>;}
function Errors(){const[p,setP]=useState(3),[direction,setDirection]=useState(1),f=subtractionSensitivity(p,direction);return <>
 <MathText>{S`For $f(x)=x-1$, the absolute condition number is 1 but the relative condition number is $|x|/|x-1|$. Set $x=1+10^{-p}$ and perturb the stored input by approximately $10^{-8}$.`}</MathText>
 <Slider label="Closeness exponent p" value={p} min={1} max={10} onChange={setP}/><div className="preset-row"><button aria-pressed={direction===1} onClick={()=>setDirection(1)}>Positive perturbation</button><button aria-pressed={direction===-1} onClick={()=>setDirection(-1)}>Negative perturbation</button></div>
 <Results rows={[["Stored input x",f.x.toPrecision(16)],["Original output x − 1",fmt(f.y)],["Perturbed output",fmt(f.output)],["Absolute condition number",'1'],["Relative condition number",fmt(f.condition)],["Relative input change η",fmt(f.backward)],["Relative output change",fmt(f.forward)],["κrel × η",fmt(f.predicted)]]}/>
 <p>The displayed finite changes use actual binary64 operations. This affine example has an exact linear sensitivity relation for the stored inputs. Small absolute changes can produce large relative changes in a small output. This experiment measures problem sensitivity; it does not prove an algorithm unstable.</p>
 </>;}
function Conditioning(){const[p,setP]=useState(4),[t,setT]=useState(0.1),f=diagonalPerturbation(p,t);return <>
 <MathText>{S`Solve $A=\operatorname{diag}(1,s)$, $b=(1,s)^T$, where $s=10^{-p}$. Change only the second diagonal to $(1-t)s$. The exact original answer is $(1,1)^T$; the perturbed answer is $(1,1/(1-t))^T$.`}</MathText>
 <Slider label="Small singular-value exponent p" value={p} min={0} max={12} onChange={setP}/><Slider label="Fractional change t in the small diagonal" value={t} min={0.01} max={0.9} step={0.01} onChange={setT}/>
 <Results rows={[["κ₂(A)",fmt(f.condition)],["Chosen relative matrix perturbation ε",fmt(f.inputError)],["εκ₂(A)",fmt(t)],["Perturbed solution",f.xhat.map(fmt).join(', ')],["Relative forward error",fmt(f.forward)],["Rigorous upper bound t/(1 − t)",fmt(f.bound)],["Minimum unstructured matrix-only backward error",fmt(f.backward)]]}/>
 <p>Increasing p makes the same change in the answer come from a smaller relative input perturbation. The chosen diagonal perturbation is one explanation; the minimum unstructured backward error can be smaller. The bound is an upper bound, not a prediction of equality.</p>
 </>;}
function Solvers(){const[n,setN]=useState(6),f=useMemo(()=>growthExperiment(n),[n]);return <>
 <p>Use the partial-pivoting family with −1 below the diagonal, zeros above it, and a final column of ones. Ties keep the first largest pivot. All entries remain exactly representable in this experiment.</p>
 <Slider label="Matrix size n" value={n} min={3} max={10} onChange={setN}/><div className="preset-row"><button onClick={()=>setN(3)}>3 × 3</button><button onClick={()=>setN(10)}>10 × 10</button></div>
 <Results rows={[["Largest original entry in magnitude",'1'],["Largest entry generated in U",fmt(f.growth)],["Predicted growth 2ⁿ⁻¹",fmt(2**(n-1))],["Measured relative reconstruction error",fmt(f.relativeResidual)]]}/>
 <p><b>Final column of U:</b> {f.U.map(row=>fmt(row[n-1])).join(', ')}</p>
 <svg className="plot" viewBox="0 0 450 280" role="img" aria-label={`Upper-factor final column doubles to ${f.growth} for matrix size ${n}.`}><line className="axis" x1="30" x2="425" y1="230" y2="230"/>{f.U.map((row,i)=>{const h=190*row[n-1]/f.growth,w=360/n;return <g key={i}><rect x={40+i*w} y={230-h} width={w-5} height={h} fill="var(--accent)"/><text x={40+i*w} y="250">{i+1}</text></g>;})}<text x="30" y="20">Linear height: final-column entry</text></svg>
 <p>A zero measured error here is compatible with large growth: powers of two are exact. The growth factor measures a weakness in a general rounding-error bound, not a mandatory error in every calculation.</p>
 </>;}
function Products(){const[p,setP]=useState(8),f=roundedOuter(p);return <>
 <p>Round each entry of a rank-one outer product in a toy binary system with p significant bits and ties to even. The input column is a=(1, 1+δ)ᵀ, where δ=2⁻⌈p/2⌉, and the row is its transpose.</p>
 <Slider label="Outer-product precision p" value={p} min={4} max={16} onChange={setP}/><div className="lu-matrices"><Matrix A={f.exact} label="Exact outer product"/><Matrix A={f.computed} label="Rounded product"/></div>
 <Results rows={[["δ",fmt(f.delta)],["Exact-product rank",'1'],["Determinant of rounded matrix",fmt(f.determinant)],["Rounded-product rank",f.determinant===0?'1':'2'],["Relative Frobenius forward error",fmt(f.relativeError)]]}/>
 <p>The determinant shown is computed exactly by binary64 for these small binary inputs and precision choices. No perturbed 2 × 1 and 1 × 2 factors can produce a rank-two result. Small forward error therefore coexists with failure of any exact backward interpretation of this factor shape.</p>
 </>;}
function Qr(){const[p,setP]=useState(4),f=useMemo(()=>qrStabilityExperiment(p),[p]);return <>
 <MathText>{S`Use $A_\delta=\begin{pmatrix}1&1&1\\\delta&0&0\\0&\delta&0\\0&0&\delta\end{pmatrix}$ with $\delta=10^{-p}$. All four algorithms below run in actual binary64 arithmetic.`}</MathText>
 <Slider label="Near-dependence exponent p" value={p} min={1} max={12} onChange={setP}/><div className="preset-row"><button onClick={()=>setP(2)}>Mild dependence</button><button onClick={()=>setP(8)}>Strong dependence</button></div>
 <Results rows={[["κ₂(Aδ)",fmt(f.condition)]]}/>
 <div className="stability-comparison" aria-live="polite">{f.results.map(r=><section key={r.name}><h3>{r.name}</h3>{r.complete?<Results rows={[["Orthogonality defect (Frobenius)",fmt(r.orthogonality)],["Relative reconstruction error (Frobenius)",fmt(r.reconstruction)]]}/>:<p>A residual lost numerical rank; this basis cannot be completed.</p>}</section>)}</div>
 <p>These are measured errors, not the theoretical upper bounds. A second modified Gram–Schmidt pass updates R as R₂R₁. Compare orthogonality and reconstruction separately: one may be excellent while the other fails.</p>
 </>;}
const demos={'stability-floating':Floating,'stability-errors':Errors,'stability-conditioning':Conditioning,'stability-solvers':Solvers,'stability-products':Products,'stability-qr':Qr};
export default function StabilityLab({type}){const Demo=demos[type];return <Demo/>;}
