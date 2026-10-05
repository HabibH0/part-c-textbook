const S=String.raw;
const N=(prompt,...answer)=>({type:'numeric',prompt,answer});
const C=(prompt,answer,...options)=>({type:'choice',prompt,answer:String(answer),options:options.map((label,i)=>[String(i),label])});
const ids=['eigen-polynomials','eigen-schur','eigen-power','eigen-pagerank','eigen-inverse'];
export const chapter7Lessons=[
 ['Eigenvalues and polynomial roots','Polynomial roots','Turn polynomial roots into eigenvalues and understand why general solvers iterate.','30–40 min',['Construct a companion matrix and prove the root correspondence','Interpret the scope of the radical-formula obstruction','Connect eigenvalue iteration with the SVD','Find polynomial extrema using critical points and endpoints']],
 ['Schur form and unitary similarity','Schur form','Triangularise any complex square matrix without sacrificing an orthonormal basis.','35–45 min',['Prove Schur existence by induction','Prove the diagonal-if-normal characterisation','Distinguish Schur vectors from eigenvectors','Interpret real 2×2 blocks and the limits of diagonalization']],
 ['The power method','Power iteration','Use repeated matrix–vector products to find a dominant eigendirection.','35–45 min',['Implement normalisation, Rayleigh quotients and residuals','Prove the geometric convergence factor and identify its assumptions','Recognise sign alternation, missing components and tied magnitudes','Relate powers to QR columns and Krylov spaces']],
 ['PageRank and stationary distributions','PageRank','Use a directed network to turn a ranking problem into an eigenvector calculation.','30–40 min',['Construct a column-stochastic link matrix','Handle dangling nodes and teleportation','Compute and interpret a positive stationary distribution','Use contraction and residual bounds to assess convergence']],
 ['Shifted inverse and Rayleigh iteration','Shifted methods','Target a nearby eigenvalue by solving shifted systems.','35–45 min',['Derive inverse eigenvalues and the shifted convergence factor','Reuse factors for fixed shifts and compare computational costs','Handle complex, tied and singular shifts','Explain the local quadratic and cubic rates of Rayleigh quotient iteration']]
].map(([title,short,description,readTime,objectives],i)=>({id:ids[i],chapter:'eigenvalues',number:String(i+1).padStart(2,'0'),title,short,description,readTime,objectives,lab:ids[i]}));
const Q=(id,section,level,title,task,hints,solution,mastery=false)=>({id:`eig-${id}`,lesson:ids[section],level,title,...(Array.isArray(task)?{type:'multi',prompt:'Complete each part.',parts:task}:task),hints,solution,mastery});
export const chapter7Exercises=[
 Q('a1',0,1,'Recognise an eigenvalue',C('λ is an eigenvalue of a square matrix A exactly when…',1,'A=λI.','det(λI−A)=0.','every vector satisfies Ax=λx.'),['An eigenvector must be a nonzero null vector of λI−A.','A square matrix has a nonzero null vector exactly when it is singular.'],'The determinant condition is equivalent to a nontrivial nullspace.'),
 Q('a2',0,1,'Read the companion row',N('For p(z)=z³−6z²+11z−6, enter the first row of its companion matrix in the convention of this lesson.',6,-11,6),['Negate the coefficients below the leading one.','Keep their descending order.'],'The row is (6,−11,6); the remaining nonzero entries are subdiagonal ones.'),
 Q('a3',0,2,'Check an eigenvector',N('For that companion matrix and λ=2, enter v=(λ²,λ,1), followed by Cv.',4,2,1,8,4,2),['The eigenvector uses descending powers.','Compute 6×4−11×2+6 for the first component.'],'v=(4,2,1) and Cv=(8,4,2)=2v.'),
 Q('a4',0,3,'A complex pair',[
 N('Expand (z−2)(z²+1). Enter a₂,a₁,a₀ and then the first row of the companion matrix.',-2,1,-2,2,-1,2),
 C('What are the eigenvalues?',2,'2,1,−1','−2,i,i','2,i,−i')
 ],['Distribute z−2 across z²+1.','The quadratic factor vanishes at ±i.'],'p=z³−2z²+z−2; the companion row is (2,−1,2) and the eigenvalues are 2,±i.'),
 Q('a5',0,3,'Normalise a polynomial',N('For 2z³+4z²−6z+8, divide by the leading coefficient, then enter the companion matrix first row.',-2,3,-4),['The monic polynomial is z³+2z²−3z+4.','Negate those three lower coefficients.'],'The first row is (−2,3,−4). Scaling the polynomial by a nonzero constant leaves its roots unchanged.'),
 Q('a6',0,4,'Complete both directions of the proof',[
 C('If p(λ)=0, why does the first component of Cv(λ) equal λⁿ?',0,'The polynomial equation rearranges to λⁿ=−Σ aⱼλʲ.','Every first row sums to one.','λ must be real.'),
 C('If Cw=λw, what do the lower rows imply?',2,'Every wⱼ equals 1.','w₁=0 necessarily.','wⱼ₋₁=λwⱼ for j=2,…,n.'),
 C('Why can the last entry wₙ not vanish?',1,'All eigenvectors have norm n.','The recurrence would force every entry to vanish.','Every eigenvalue is nonzero.')
 ],['Use the coefficient row for the forward direction.','Run the shift recurrence upward for the reverse direction.'],'The polynomial equation supplies the first component; lower rows shift powers. Conversely a nonzero eigenvector has wₙ≠0 and is a multiple of the power vector, forcing p(λ)=0.'),
 Q('a7',0,4,'Qualify the obstruction',[
 C('What does Abel–Ruffini rule out for general degree at least five?',1,'All finite symbolic descriptions of roots.','A universal formula using arithmetic operations and radicals.','Approximation of roots to high accuracy.'),
 C('Does iteration imply poor eigenvalue accuracy?',0,'No; carefully designed iterative algorithms can be backward stable.','Yes; every iterative answer is unusable.','Only if the matrix is triangular.')
 ],['The theorem concerns a particular kind of formula.','Approximation and accuracy are different questions.'],'The obstruction has an arithmetic-and-radicals scope. Iteration can still achieve high accuracy appropriate to conditioning.'),
 Q('a8',0,5,'Optimise using eigenvalues',[
 N('For g(t)=t⁴−2t² on [−2,2], enter the three real critical points in increasing order.',-1,0,1),
 N('Enter g(−2),g(0),g(1), then the global minimum value.',8,0,-1,-1),
 C('Why must endpoints be compared?',2,'They are always critical points of the derivative.','Companion matrices contain no eigenvalues.','An interval minimum can occur at its boundary.')
 ],['g′/4=t³−t=t(t−1)(t+1).','Evaluate all critical points and both endpoints.'],'The candidates give endpoint value 8, central value 0 and values −1 at ±1. The global minimum is −1 at both ±1.'),
 Q('b1',1,1,'The Schur assumptions',C('Complex Schur form A=UTU* exists for…',2,'only symmetric matrices.','only matrices with distinct eigenvalues.','every complex square matrix.'),['The induction uses one complex eigenvector at a time.','A full eigenbasis is not assumed.'],'Every complex square matrix has Schur form, including defective matrices.'),
 Q('b2',1,1,'Read the spectrum',N('T=[[2,4,7],[0,−1,3],[0,0,2]] is a Schur factor. Enter its eigenvalues in diagonal order, including multiplicity.',2,-1,2),['The determinant of zI−T is a product of diagonal terms.','Repeated diagonal entries count repeatedly.'],'The eigenvalues are 2,−1,2.'),
 Q('b3',1,2,'A Schur vector need not be an eigenvector',N('For T=[[2,4],[0,1]] and U=I, enter Te₂, followed by an eigenvector for eigenvalue 1 whose second component is 1.',4,1,-4,1),['The second column is (4,1).','Solve (2−1)x₁+4=0.'],'Te₂=(4,1); an eigenvector for 1 is (−4,1).'),
 Q('b4',1,3,'Extract a real block pair',N('For the real block [[2,−3],[3,2]], enter the real part and the positive imaginary part of its eigenvalue pair.',2,3),['The characteristic polynomial is (z−2)²+9.','The roots are 2±3i.'],'The requested values are 2 and 3.'),
 Q('b5',1,3,'Distinguish two diagonalizations',[
 C('If A is diagonalizable but nonnormal, can its complex Schur factor be diagonal?',0,'No; a diagonal unitary Schur form would make A normal.','Yes; every invertible eigenbasis is unitary.','Yes; off-diagonal entries never matter.'),
 C('Does a defective Jordan block still have Schur form?',2,'No, because it lacks a full eigenbasis.','Only after deleting an eigenvalue.','Yes; an upper triangular Jordan block is already a Schur form with U=I.')
 ],['Unitary diagonalization is stronger than general diagonalization.','Schur requires triangular rather than diagonal.'],'A nonnormal diagonalizable matrix needs a nonunitary eigenbasis for diagonalization. A defective matrix can still be triangular.'),
 Q('b6',1,4,'Complete the Schur induction',[
 C('For unit v with Av=λv and U₁=[v,V⊥], the first column of U₁*AU₁ is…',1,'v itself','λe₁','the all-ones vector'),
 C('Which embedded change reduces the trailing block while preserving the first coordinate?',0,'diag(1,V)','diag(V,1) in all dimensions','V+I'),
 C('If T=W*U₁*AU₁W, which is the final unitary basis?',2,'WU₁','U₁+W','U₁W')
 ],['Apply U₁* to Av.','Undo the similarities in the correct order.'],'The first column is λe₁; W=diag(1,V) preserves it, and U=U₁W gives A=UTU*.'),
 Q('b7',1,4,'Prove normal triangular means diagonal',[
 C('For normal upper triangular T, comparison of the first diagonal entries of T*T and TT* gives…',2,S`$|t_{11}|=0$.`,S`$\sum_jt_{1j}=1$.`,S`$|t_{11}|^2=\sum_j|t_{1j}|^2$.`),
 C('What follows for the other first-row entries?',0,'They all vanish.','They all equal 1.','They are arbitrary.'),
 C('How does the proof finish?',1,'Assume all eigenvectors were known.','Apply the same argument to the normal trailing triangular block.','Delete the triangular assumption.')
 ],['The first column of a triangular matrix has only one possible nonzero entry.','A sum of nonnegative squared magnitudes can vanish only termwise.'],'Normality makes the row norm equal the column norm. The first row decouples, and induction forces every off-diagonal entry to vanish.'),
 Q('b8',1,5,'Real arithmetic and sensitive reductions',[
 C('Why can a real orthogonal Schur form need a 2×2 block?',1,'Real matrices cannot have eigenvalues.','A real triangular diagonal cannot display a nonreal conjugate pair.','Every 2×2 matrix is defective.'),
 C('A unitary Schur basis guarantees…',2,'insensitive eigenvalues for every nonnormal matrix.','an orthonormal eigenbasis for every A.','norm-preserving transformations, while spectral sensitivity can remain.'),
 C('Why can further diagonalization be delicate?',0,'It can require nonunitary transforms and poorly separated Sylvester solves, or fail to exist.','Sylvester equations always have condition number one.','Schur form has removed all conditioning issues.')
 ],['Separate real block form from complex triangular form.','Backward stability does not eliminate conditioning.'],'Real blocks encode complex pairs. Schur is a stable computational target, but a nonunitary diagonalization may be sensitive or unavailable.'),
 Q('c1',2,1,'One power step',N('For A=diag(3,1), start in direction (1,1). Enter the first normalised iterate.',3/Math.sqrt(10),1/Math.sqrt(10)),['Multiply first to get (3,1).','Its Euclidean norm is √10.'],'The iterate is (3,1)/√10.'),
 Q('c2',2,1,'Rayleigh estimate',N('For that normalised iterate, enter its Rayleigh quotient for A=diag(3,1).',2.8),['Use the squared components 9/10 and 1/10.','Weight them by the diagonal entries.'],'ρ=3×9/10+1×1/10=14/5.'),
 Q('c3',2,2,'A convergence ratio',N('A diagonalizable matrix has eigenvalues −6,3,1 with an admissible starting vector. Enter the power-method convergence factor.',0.5),['Order by magnitude, not signed value.','Divide the next magnitude by the largest.'],'The factor is |3/(−6)|=1/2.'),
 Q('c4',2,3,'Track a complete family',[
 N('For A=diag(3,1) and equal initial components, enter the unwanted/wanted component ratio after 3 iterations.',1/27),
 N('Enter the Rayleigh quotient after those 3 iterations.',2188/730)
 ],['The component ratio is 3⁻ᵏ.','Use (3×9ᵏ+1)/(9ᵏ+1).'],'The ratio is 1/27 and ρ=(3×729+1)/(729+1)=2188/730.'),
 Q('c5',2,3,'Failure modes',[
 C('For diag(3,1) started exactly at e₂, what happens in exact arithmetic?',0,'It remains at e₂ and finds eigenvalue 1.','It must eventually produce e₁.','Every step divides by zero.'),
 C('For diag(3,−3) with both components nonzero, what can happen?',2,'The magnitudes force a unique dominant eigenvector.','Both eigenvalues disappear.','The relative sign alternates and the eigendirection need not converge.'),
 C('If Ax=0, the next normalisation…',1,'is automatically the zero eigenvector.','cannot be performed because its divisor is zero.','creates a unit vector in every direction.')
 ],['A diagonal product cannot create a missing coordinate.','Check the strict dominance and nonzero-product assumptions.'],'Missing components remain missing; tied magnitudes can cycle; a zero product must be handled explicitly.'),
 Q('c6',2,4,'Complete the convergence proof',[
 C('Which factorisation isolates the dominant term in Aᵏx₀?',2,S`$\lambda_1^k\sum_i c_iv_i$.`,S`$\sum_i c_i\lambda_i v_i$ for every k.`,S`$\lambda_1^k(c_1v_1+\sum_{i>1}c_i(\lambda_i/\lambda_1)^kv_i)$.`),
 C('Which conditions make the trailing ratios decay relative to a wanted component?',0,'|λ₁|>|λ₂| and c₁≠0, with an eigenbasis for this proof.','Only that A is square.','Only that x₀ has length one.'),
 C('For a negative dominant eigenvalue, convergence should be interpreted…',1,'only as entrywise convergence with a fixed positive sign.','up to sign, as convergence of an eigendirection.','as failure of the theorem in every case.')
 ],['Apply Aᵏ to each eigenvector separately.','Factor out λ₁ᵏ and compare magnitudes.'],'The eigenbasis expansion gives geometric decay of the trailing ratios. Normalisation removes magnitude but not sign or phase.'),
 Q('c7',2,4,'A residual proves a nearby problem',[
 C('For unit x and r=Ax−ρx, which perturbation makes x exact?',1,'E=rx*','E=−rx*','E=0 always'),
 C('What is its spectral norm?',2,'‖A‖₂ always','|ρ| always','‖r‖₂'),
 C('Does a zero residual certify the dominant eigenvalue?',0,'No; any exact eigenpair has zero residual.','Yes, automatically.','Only if x has length one.')
 ],['Require Ex=−r.','Use x*x=1 and the norm of a rank-one matrix.'],'E=−rx* gives (A+E)x=ρx and ‖E‖₂=‖r‖₂. Dominance needs separate information.'),
 Q('c8',2,5,'Connect eigenvalue accuracy and QR',[
 C('For symmetric A, why is Rayleigh-quotient error second order in angle near an eigenvector?',0,'The cross terms vanish because Av=λv and A=Aᵀ.','Every quotient is exact.','Every matrix is diagonal in the original coordinates.'),
 C('If Aᵏ=QₖRₖ and its first column is nonzero, the first Qₖ column is parallel to…',1,'the last row of A','Aᵏe₁','every eigenvector at once'),
 C('What controls the leading dense cost of one power step?',2,'Forming Aᵏ explicitly.','An n×n inverse every time.','One matrix–vector product, O(n²).')
 ],['Expand the quotient along v and an orthogonal direction.','Read the first column equation of QR.'],'Symmetry cancels linear cross terms. The first QR column tracks a power iterate; explicit powers are unnecessary.'),
 Q('d1',3,1,'Read the direction of a link',C('With the column-stochastic convention, Pᵢⱼ describes…',1,'a link from page i to page j.','mass sent from page j to page i.','only the diagonal score of page j.'),['The source chooses a column.','Multiplication collects destinations in rows.'],'Column j distributes the mass currently at page j.'),
 Q('d2',3,1,'Normalise a link column',N('Page 2 links equally to pages 1 and 3 in a three-page network. Enter column 2 of P.',0.5,0,0.5),['There are two outgoing links.','No mass goes to page 2 itself.'],'The column is (1/2,0,1/2)ᵀ.'),
 Q('d3',3,2,'Apply teleportation',N('For P=[[1,1],[0,0]] and α=4/5, enter the four row-major entries of A=αP+(1−α)11ᵀ/2.',0.9,0.9,0.1,0.1),['The uniform addition to every entry is 1/10.','Multiply each P entry by 4/5 first.'],'A=[[9/10,9/10],[1/10,1/10]].'),
 Q('d4',3,3,'Find the stationary probabilities',[
 N('For that A, enter A(1/2,1/2)ᵀ, then its stationary eigenvalue.',0.9,0.1,1),
 C('Does Euclidean normalisation necessarily make scores sum to one?',2,'Yes, because all norms agree.','Yes, for every positive vector.','No; divide by the sum when reporting probabilities.')
 ],['Both columns of A are identical.','Length one and sum one are different constraints.'],'One step gives v=(0.9,0.1), and Av=v. Euclidean scaling preserves ranking but not probability normalisation.'),
 Q('d5',3,3,'Handle a dangling page',[
 N('A page has no outgoing links in a four-page network. Enter its replacement column under the uniform convention.',0.25,0.25,0.25,0.25),
 C('Why must a dangling column be handled before using the stochastic argument?',0,'A zero column does not sum to one and can lose probability mass.','A zero column is automatically stochastic.','It makes every other column negative.')
 ],['Spread its mass uniformly.','Check the column sum required by the proof.'],'Replace it by four entries of 1/4; then mass is preserved.'),
 Q('d6',3,4,'Prove the stationary eigenvalue and positivity',[
 C('For 0<α<1, every entry of the teleported A is at least…',2,'α/n','0 with no stronger bound','(1−α)/n'),
 C('Why is the eigenvalue of a stationary positive normalised vector exactly 1?',1,'All positive matrices have eigenvalues equal to 1.','Multiply Av=λv by 1ᵀ and use the column sums and 1ᵀv=1.','Every row of P is necessarily uniform.'),
 C('Does plain nonnegativity alone guarantee a unique stationary vector and convergence?',0,'No; positivity from teleportation supplies stronger conditions.','Yes, for every nonnegative matrix.','Only if all column sums vanish.')
 ],['The added uniform term is strictly positive.','Distinguish nonnegative from strictly positive.'],'Teleportation makes A positive and stochastic. Multiplying by 1ᵀ forces λ=1; Perron–Frobenius supplies simplicity and a positive stationary direction.'),
 Q('d7',3,4,'Derive a contraction bound',[
 C('For probability vectors x,y, why does teleportation disappear from A(x−y)?',1,'P is zero.','1ᵀ(x−y)=0.','α equals 1.'),
 C('Which inequality follows from column-stochasticity?',0,S`$\|Pz\|_1\le\|z\|_1$.`,S`$\|Pz\|_1\ge10\|z\|_1$.`,S`$Pz=0$ always.`),
 N('If α=0.8 and ‖Ax−x‖₁=0.002, enter the bound ‖Ax−x‖₁/(1−α).',0.01)
 ],['Both probability vectors sum to one.','Use the triangle inequality to bound the absolute row sums, then rearrange the residual estimate.'],'A(x−y)=αP(x−y), giving contraction by at most α. The residual bound is 0.002/0.2=0.01.'),
 Q('d8',3,5,'Interpret a ranking',[
 C('Increasing α toward 1 makes the stated worst-case contraction guarantee…',2,'stronger because αᵏ becomes smaller.','identically zero.','weaker, because the contraction factor approaches 1.'),
 C('A few iterations give two almost tied scores. What is justified?',0,'Their ordering may change with further iterations or small model changes.','Their order is certainly exact forever.','The scores establish the truth of both pages.'),
 C('Why avoid explicitly storing the dense teleportation matrix?',1,'Teleportation has no effect.','For probability vectors its action is just the constant vector (1−α)1/n.','Dense matrices cannot have eigenvalues.')
 ],['Compare αᵏ at fixed k.','The rank-one action is known directly.'],'A large α can slow guaranteed convergence. Near ties need care; the uniform contribution can be applied with vector operations.'),
 Q('e1',4,1,'Transform the spectrum',N('A=diag(1,2,5) and μ=1.8. Enter the eigenvalues of (A−μI)⁻¹ in the same order.',-1.25,5,0.3125),['Subtract the shift first.','Take reciprocals of −0.8,0.2,3.2.'],'The eigenvalues are −5/4,5,5/16.'),
 Q('e2',4,1,'Pick the target',N('For that shifted problem, enter the original target eigenvalue and its asymptotic convergence factor.',2,0.25),['The nearest eigenvalue is 2.','The nearest two distances are 0.2 and 0.8.'],'The target is 2 and the factor is 1/4.'),
 Q('e3',4,2,'Perform a shifted solve',N('Solve (diag(1,2,5)−1.8I)y=(1,1,1)ᵀ. Enter y before normalisation.',-1.25,5,0.3125),['This is three independent scalar divisions.','The right-hand side here is unnormalised.'],'y=(−1.25,5,0.3125). Its direction is unaffected by the scale of the starting vector.'),
 Q('e4',4,3,'Estimate the original eigenvalue',[
 N('After that solve the direction is (−4,16,1). Enter its squared norm and its Rayleigh quotient for the original A.',273,533/273),
 C('Which matrix belongs in the quotient when reporting the original eigenvalue?',0,'A','Only (A−μI)⁻¹','The identity regardless of A')
 ],['Square and sum the vector entries.','Weight those squares by 1,2,5.'],'The squared norm is 273 and xᵀAx is 533 before normalisation, so ρ=533/273.'),
 Q('e5',4,3,'Ties and singular shifts',[
 C('For diag(1,2,5) and μ=1.5, what fails in the unique-target proof?',2,'A is not diagonalizable.','The shift is an eigenvalue.','Two eigenvalues have the same closest distance.'),
 C('For μ=2 and a nonconverged starting vector, what should happen?',1,'Divide by zero and continue.','Report the singular shifted system and change strategy or shift.','Declare every vector an exact eigenvector.'),
 C('For a nonreal shift applied to a real matrix, the iterates…',0,'can become complex and need a conjugate-transpose quotient.','must remain real.','always vanish.')
 ],['Compare distances to 1 and 2.','An inverse exists only off the spectrum.'],'The midpoint is a distance tie; the exact eigenvalue shift is singular. Complex shifts require complex arithmetic.'),
 Q('e6',4,4,'Prove the shifted rate',[
 C('Why are eigenvectors unchanged under inversion of A−μI?',1,'Every inverse is diagonal.','(A−μI)vᵢ=(λᵢ−μ)vᵢ, so applying the inverse scales the same vector.','Every eigenvalue becomes zero.'),
 C('Relative to the wanted component, an unwanted component acquires which factor after k steps?',2,S`$(\lambda_i-\mu)^k$ only.`,S`$\lambda_i/\lambda_1$ regardless of μ.`,S`$((\lambda_{\sigma(1)}-\mu)/(\lambda_i-\mu))^k$.`),
 C('Which conditions support the stated linear convergence proof?',0,'A suitable eigenbasis, nonzero wanted coefficient and a unique closest nonsingular shift target.','Only that μ is real.','Only that A has positive entries.')
 ],['Apply the eigenpair equation to the shifted matrix.','Divide each reciprocal-power coefficient by the wanted reciprocal-power coefficient.'],'The eigenvectors survive and the relative coefficients decay at the distance ratio when the assumptions hold.'),
 Q('e7',4,4,'Account for the work',[
 C('For a fixed shift, how many shifted factorizations are normally needed for k inverse steps?',0,'One, with factors reused.','k²','None for a general dense matrix'),
 C('What is the leading total dense cost with fixed shift and reused factors?',1,'O(k) independent of n','O(n³+kn²)','O(n⁵) necessarily'),
 C('If RQI changes μ at every step, what usually changes?',2,'All new systems use identical factors automatically.','The matrix–vector products vanish.','The shifted matrix usually needs a new factorization.')
 ],['Separate factorization from triangular substitution.','An adaptive shift changes the matrix being factored.'],'Fixed shifts amortise one O(n³) factorization; each solve is O(n²). Adaptive shifts generally require refactorization.'),
 Q('e8',4,5,'Explain the local cubic rate',[
 C('Near a simple symmetric eigenvector, the Rayleigh shift error has size…',1,'O(1) necessarily','O(θ²)','exactly θ for every matrix'),
 C('The inverse step then gives a new angular error of order…',0,'θ×θ²=θ³','θ⁰','1/θ'),
 C('What must be checked before solving with an exact eigenvector’s Rayleigh shift?',2,'Whether the vector has negative entries.','Whether the diagonal entries are all positive.','Whether the original residual is already small enough to stop; the shifted matrix is singular.'),
 C('Are cubic and quadratic RQI rates global guarantees from every start?',1,'Yes, without exceptions.','No; they are local results with simple-eigenpair and successful-solve assumptions.','Only if no normalisation is used.')
 ],['Combine second-order shift accuracy with the inverse-iteration distance ratio.','At convergence the shift hits the eigenvalue.'],'Locally the next angle is O(θ³) in the symmetric case. Stop by the original residual before an unnecessary singular solve; arbitrary starts need not enter this local regime.'),
 Q('am1',0,5,'A new companion row',N('For p(z)=z³+2z²−5z+4, enter the companion first row.',-2,5,-4),['Use the negative coefficients.','Keep descending order.'],'The row is (−2,5,−4).',true),
 Q('am2',0,5,'A zero root still has a vector',N('For a degree-three companion matrix with a₀=0, enter v(0)=(0²,0,1).',0,0,1),['The last component is always 1.','No division by the eigenvalue is needed.'],'v=(0,0,1) is nonzero.',true),
 Q('am3',0,5,'Critical versus minimal',C('Finding every real root of g′ on a closed interval establishes the global minimum only after…',2,'discarding all endpoint values.','choosing the largest root automatically.','evaluating g at the interior candidates and the endpoints.'),['Derivative roots are candidates.','Include the boundary.'],'Compare objective values at every candidate and endpoint.',true),
 Q('bm1',1,5,'A new real Schur block',N('For [[1,−2],[2,1]], enter the real part and positive imaginary part of its eigenvalues.',1,2),['The roots solve (z−1)²+4=0.','Write 1±2i.'],'The entries are 1 and 2.',true),
 Q('bm2',1,5,'The invariant subspace',C('The first j columns of a unitary Schur basis span…',1,'a subspace always mapped to zero.','an A-invariant subspace.','all of Cⁿ regardless of j.'),['Use AU=UT.','Column j of UT uses only the first j columns of U.'],'Upper triangularity makes each leading column span invariant.',true),
 Q('bm3',1,5,'Normality in the right field',C('A real rotation with eigenvalues ±i is normal. Which conclusion is correct?',0,'Its complex triangular Schur form is diagonal, while its real Schur form may retain a 2×2 block.','Its real triangular diagonal must contain i.','Normality forbids complex eigenvalues.'),['Distinguish complex triangular form from real block form.','A real diagonal has real entries.'],'The real and complex forms use different block structures.',true),
 Q('cm1',2,5,'A fresh power rate',N('For eigenvalues 8,−2,1 and an admissible start, enter the power convergence factor.',0.25),['Compare the two largest magnitudes.','2/8=1/4.'],'The factor is 1/4.',true),
 Q('cm2',2,5,'A fresh Rayleigh quotient',N('For A=diag(4,1) and x=(3/5,4/5), enter xᵀAx.',2.08),['x already has norm 1.','Use 4×9/25+16/25.'],'The quotient is 52/25.',true),
 Q('cm3',2,5,'A negative dominant eigenvalue',C('Normalised power iterates approach ±v on alternating steps. What can this indicate?',2,'No eigenpair exists.','The residual must be large forever.','A negative dominant eigenvalue, with convergence to its eigendirection.'),['Normalisation removes magnitude, not sign.','The quotient is unchanged when a vector is negated.'],'Alternating signs can accompany successful directional convergence.',true),
 Q('dm1',3,5,'A fresh teleportation floor',N('For n=5 and α=0.9, enter the lower bound (1−α)/n on each entry of A.',0.02),['The teleportation probability is 0.1.','Distribute it across five pages.'],'The floor is 0.02.',true),
 Q('dm2',3,5,'A fresh residual bound',N('For α=0.75 and stationary residual norm 0.005, enter the 1-norm distance bound.',0.02),['Divide by 1−α.','0.005/0.25=0.02.'],'The bound is 0.02.',true),
 Q('dm3',3,5,'Left versus right',C('For a column-stochastic matrix, the all-ones row is a left eigenvector; the probability ranking is…',1,'necessarily the same uniform row.','a right eigenvector with eigenvalue 1, normalised to sum one.','an eigenvector with eigenvalue zero.'),['Mass preservation and stationary redistribution are different equations.','Use Av=v for the ranking.'],'The stationary distribution is a right eigenvector.',true),
 Q('em1',4,5,'A new shift target',N('A has eigenvalues 1,4,9 and μ=3.5. Enter the target eigenvalue and nearest/next-nearest distance ratio.',4,0.2),['The distances are 2.5,0.5,5.5.','Use 0.5/2.5.'],'The target is 4 and the factor is 1/5.',true),
 Q('em2',4,5,'A shifted diagonal solve',N('Solve (diag(2,6)−I)y=(1,1)ᵀ. Enter y.',1,0.2),['The shifted diagonal is (1,5).','Divide each right-hand-side component by its diagonal.'],'y=(1,1/5).',true),
 Q('em3',4,5,'The final inverse step',C('RQI has reached an exact eigenvector. The next action should be…',0,'accept convergence from the residual before trying the singular shifted solve.','form the inverse of a singular matrix.','discard the eigenpair because convergence is impossible.'),['Its Rayleigh quotient is exactly the eigenvalue.','The original eigenpair residual is zero.'],'Stop; another inverse step is unnecessary and undefined.',true)
];
