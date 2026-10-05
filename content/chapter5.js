const R=String.raw;
const N=(prompt,...answer)=>({type:'numeric',prompt,answer});
const C=(prompt,answer,...options)=>({type:'choice',prompt,answer:String(answer),options:options.map((label,i)=>[String(i),label])});
const ids=['qr-gram-schmidt','qr-householder','qr-givens','qr-least-squares','qr-normal-equations','qr-regression'];
export const chapter5Lessons=[
 ['Gram–Schmidt and orthogonal coordinates','Gram–Schmidt','Turn an orthonormal basis construction into a triangular factorisation.','30–40 min',['State the dimensions and rank assumptions of thin QR','Derive Gram–Schmidt and prove A = QR','Recognise loss of orthogonality and dependent columns','Explain triangular orthogonalisation and CholeskyQR']],
 ['Householder reflectors and QR','Householder QR','Reflect a column onto a coordinate axis and build a stable factorisation.','40–50 min',['Prove the reflection identities and equal-length mapping','Handle exceptional vectors and avoid cancellation','Track full and thin QR and the order of reflector products','Explain compact application, cost, stability and optional rank revelation']],
 ['Givens rotations and structured QR','Givens rotations','Eliminate selected entries while working on only two rows at a time.','25–35 min',['Construct a rotation that zeros one component','Apply row and column rotations with the right signs','Triangularise an upper Hessenberg matrix without spoiling earlier zeros','Recover Q using transposed rotations and understand fill-in']],
 ['Least squares as an orthogonal projection','Least squares','Separate the part of the data a model can fit from the unavoidable residual.','35–45 min',['Prove the QR least-squares formula and uniqueness','Calculate the fitted vector and orthogonal residual','Implement the solve using stored reflectors','Compare QR, LU and SVD and retain the optional 1-norm distinction']],
 ['Normal equations and best approximation','Normal equations','Understand the fast alternative to QR and the conditioning it squares.','35–45 min',['Derive the normal equations and their positivity','Prove the condition-number identity and explain rounding risk','Prove the inner-product best-approximation characterisation','Connect a square root and QR to Cholesky existence']],
 ['Polynomial regression and sampling','Regression','Fit a function from samples and distinguish interpolation from oversampled regression.','30–40 min',['Build a Vandermonde matrix with correct dimensions','Prove full column rank for enough distinct nodes','Reproduce the degree-ten 11-versus-100-sample comparison','Interpret training error, evaluation error and the optional Lebesgue bound']]
].map(([title,short,description,readTime,objectives],i)=>({id:ids[i],chapter:'qr',number:String(i+1).padStart(2,'0'),title,short,description,readTime,objectives,lab:ids[i]}));
const Q=(id,section,level,title,task,hints,solution,mastery=false)=>({id:`qr-${id}`,lesson:ids[section],level,title,...(Array.isArray(task)?{type:'multi',prompt:'Complete each part.',parts:task}:task),hints,solution,mastery});
export const chapter5Exercises=[
 Q('a1',0,1,'Thin factor dimensions',N('For full-column-rank A of size 7×3, enter the rows and columns of thin Q and R, in that order.',7,3,3,3),['Q has the same shape as A.','R is square with one row per column of A.'],'Thin Q is 7×3 and R is 3×3.'),
 Q('a2',0,1,'The first normalisation',N('For a₁=(3,4,0)ᵀ, enter r₁₁, then the three entries of q₁.',5,0.6,0.8,0),['The Euclidean length is 5.','Divide every coordinate by 5.'],'r₁₁=5 and q₁=(3/5,4/5,0)ᵀ.'),
 Q('a3',0,2,'Remove a projection',N('With q₁=(3/5,4/5,0)ᵀ and a₂=(3,4,5)ᵀ, enter r₁₂, followed by the three entries of w₂=a₂−r₁₂q₁.',5,0,0,5),['Take the inner product first.','Subtract the parallel component.'],'r₁₂=5 and w₂=(0,0,5)ᵀ.'),
 Q('a4',0,3,'Finish and reconstruct',[
 N('For the preceding example, enter r₂₂ and the three entries of q₂.',5,0,0,1),
 C('Which column equation is correct?',1,R`$a_2=r_{22}q_1+r_{12}q_2$`,R`$a_2=r_{12}q_1+r_{22}q_2$`,R`$a_2=q_1+q_2$ always`)
 ],['Normalise w₂.','Read column two of QR.'],'r₂₂=5, q₂=(0,0,1)ᵀ, and a₂=5q₁+5q₂.'),
 Q('a5',0,3,'Dependence and rectangular Q',[
 C('If a₂=2a₁ exactly, what happens to the second Gram–Schmidt residual?',0,'It is zero and cannot be normalised.','Its norm is always one.','It proves no QR factorisation exists.'),
 C('For tall thin Q with QᵀQ=I, what is QQᵀ?',2,'Always the identity on the entire output space.','Always zero.','The orthogonal projection onto the column space of Q.')
 ],['A multiple is removed entirely by its projection.','Thin Q has fewer columns than rows.'],'Dependence makes w₂=0, so the simple algorithm stops; a rank-deficient QR still exists. QQᵀ projects onto range(Q).'),
 Q('a6',0,4,'Prove the Gram–Schmidt claims',[
 C('Why is qₖᵀwⱼ=0 for k<j?',2,'All input columns are orthogonal.',R`$r_{kj}=0$ by definition.`,R`$q_k^Tw_j=q_k^Ta_j-r_{kj}$ using $q_k^Tq_i=\delta_{ki}$.`),
 C('What ensures wⱼ is nonzero?',0,'Full column rank: otherwise aⱼ belongs to the span of earlier columns.','Every input entry is positive.','The number of rows is even.'),
 C('Why is R upper triangular?',1,'Every orthogonal matrix is triangular.','The formula for aⱼ only uses q₁,…,qⱼ.','The lower entries are discarded approximations.')
 ],['Expand the inner product with the residual.','Use linear independence for the normalisation step.'],'Orthonormality cancels all but the kth projection coefficient. Full rank prevents a zero residual. Collecting the column equations gives upper triangular R and A=QR.'),
 Q('a7',0,4,'Check CholeskyQR',[
 C('Which sequence defines single-pass CholeskyQR?',1,'Factor A by LU, then call L orthogonal.','Form AᵀA=RᵀR, then solve QR=A.','Form AAᵀ and set Q=A.'),
 C('Which identity proves exact orthogonality?',0,R`$Q^TQ=R^{-T}A^TAR^{-1}=I$.`,R`$Q^TQ=A^TA$ always.`,R`$R^TR=I$ always.`),
 C('Does this exact identity establish floating-point stability?',2,'Yes, without any qualifications.','Yes, because triangular matrices never cause error.','No; forming the Gram matrix can lose crucial information.')
 ],['Substitute Q=AR⁻¹.','Distinguish an algebraic identity from a rounding-error statement.'],'The identity holds in exact arithmetic. Forming AᵀA squares conditioning and can make this fast algorithm lose orthogonality.'),
 Q('a8',0,5,'Interpret a tiny residual',[
 C('A classical Gram–Schmidt residual is tiny after subtracting large terms. Why is normalising risky?',1,'Tiny vectors are automatically zero in real arithmetic.','Rounding error can be large relative to the residual and be amplified by normalisation.','Normalisation multiplies its norm by zero.'),
 C('What distinguishes triangular orthogonalisation from orthogonal triangularisation?',0,'The former obtains Q through triangular combinations; the latter applies orthogonal maps to obtain R.','They mean every intermediate matrix is both types.','They require identical floating-point operations.')
 ],['Compare error with the size of the remainder.','Think Q=AR⁻¹ versus H⋯HA=[R;0].'],'Cancellation followed by normalisation can magnify errors. Gram–Schmidt/CholeskyQR and Householder QR reach the same factorisation through different operations.'),
 Q('b1',1,1,'Reflection eigenvalues',N('For a Householder reflector in R⁵, enter the multiplicity of eigenvalue +1 and then of −1.',4,1),['The reflecting hyperplane has dimension 4.','The normal direction changes sign.'],'The multiplicities are 4 and 1.'),
 Q('b2',1,1,'A simple reflector',N('For v=(1,0)ᵀ and x=(2,3)ᵀ, enter Hx where H=I−2vvᵀ.',-2,3),['Reflect the first coordinate.','The direction orthogonal to v stays fixed.'],'H=diag(−1,1), so Hx=(−2,3).'),
 Q('b3',1,2,'Map to the positive axis',N(R`For $H=\begin{pmatrix}3/5&4/5\\4/5&-3/5\end{pmatrix}$, enter $H(3,4)^T$ and then $H(5,0)^T$.`,5,0,3,4),['Multiply each row by the vector.','H is its own inverse.'],'The outputs are (5,0) and (3,4).'),
 Q('b4',1,3,'Prove the equal-length mapping',[
 C('For distinct equal-length a,b with length ρ, what is ‖a−b‖²?',0,R`$2\rho^2-2a^Tb$`,R`$\rho^2-a^Tb$`,R`$2-2a^Tb$ for every ρ`),
 C('For v=(a−b)/‖a−b‖, what follows?',2,R`$vv^Ta=a-b$`,R`$vv^Ta=0$`,R`$vv^Ta=(a-b)/2$, hence $Ha=b$.`)
 ],['Expand the squared distance.','The numerator (a−b)ᵀa is half that denominator.'],'The shared length must be retained: (a−b)ᵀa=ρ²−aᵀb. Therefore vvᵀa=(a−b)/2 and Ha=b.'),
 Q('b5',1,3,'Safe targets and exceptional vectors',[
 N('For x=(3,4)ᵀ, enter the practical target α=−sign(x₁)‖x‖.',-5),
 C('If the active tail is zero, what should the algorithm do?',1,'Divide it by its norm anyway.','Skip the transformation.','Declare all QR factorisations impossible.'),
 C('Why choose the opposite sign for a nearly axial nonzero vector?',0,'To avoid cancellation in x₁−α.','To make H nonorthogonal.','To require every R diagonal entry to be positive.')
 ],['The norm is 5.','The target sign does not affect the zero tail.'],'Choose α=−5. A zero tail needs no reflector; the opposite-sign target avoids subtracting nearly equal leading entries.'),
 Q('b6',1,4,'Recover full and thin QR',[
 C('If H₃H₂H₁A=[R;0], which is QF?',2,'H₃H₂H₁','H₁+H₂+H₃','H₁H₂H₃'),
 N('For A of size 8×3, enter the sizes of full QF, thin Q, and Q⊥, row then column counts.',8,8,8,3,8,5),
 C('Why do later reflectors preserve earlier zeros?',0,'Their defining vectors have leading zeros, so they act as identity on earlier coordinates.','All reflectors commute.','Earlier columns are deleted.')
 ],['Invert the product in reverse order.','Separate the first n columns of the full orthogonal factor.'],'QF=H₁H₂H₃. The sizes are 8×8, 8×3, 8×5. Embedded leading zeros protect the completed columns.'),
 Q('b7',1,4,'Compact cost and application',[
 N('Evaluate 2mn²−2n³/3 for m=30,n=6.',2016),
 C('How should Ha be computed?',1,'Form a dense m×m H every time.','Compute a−2v(vᵀa), using O(m) operations.','Use a matrix inverse.'),
 C('To apply QFᵀ=H₃H₂H₁ to b, which reflector acts first?',0,'H₁','H₃','All commute, so it never matters.')
 ],['2×30×36=2160.','Subtract 2×216/3=144.'],'The leading count is 2016. Compact rank-one application is linear in vector length; H₁ acts first on b.'),
 Q('b8',1,5,'Stability versus rank revelation',[
 C('What does Householder backward stability mean?',1,'All computed entries are exact.','The factors reconstruct a nearby matrix, with orthogonality accurate to rounding scale.','Every ill-conditioned solve has tiny forward error.'),
 C('Why might column pivoting still be used?',2,'Unpivoted Householder QR cannot exist.','It is always required to avoid roundoff instability.','To help expose numerical rank and a leading independent column set.'),
 C('Can full QR exist for deficient tall A?',0,'Yes; zero active tails can be skipped and R may be singular.','No, because Q must be singular.','Only if all entries vanish.')
 ],['Separate factorisation stability from rank selection.','A zero column tail needs no division.'],'Householder QR does not need pivoting for its usual stability property. Pivoting can help rank revelation. Rank deficiency makes R singular, not QR nonexistent.'),
 Q('c1',2,1,'A three-four rotation',N('To zero the second component of (3,4)ᵀ using G=[[c,s],[−s,c]], enter c,s and the surviving component.',0.6,0.8,5),['Use the hypotenuse 5.','Set c=a/r,s=b/r.'],'c=3/5,s=4/5, and the result is (5,0).'),
 Q('c2',2,1,'The inverse matters',C('The inverse of a general Givens rotation is…',2,'always itself.','the zero matrix.','its transpose.'),['G is orthogonal.','Unlike a reflector, it need not be symmetric.'],'G⁻¹=Gᵀ, generally different from G.'),
 Q('c3',2,2,'Update the other entries too',N('Apply c=3/5,s=4/5 to row-pair entries (1,2)ᵀ in another column. Enter both new entries.',2.2,0.4),['Use c×1+s×2.','Then −s×1+c×2.'],'The entries become 11/5 and 2/5.'),
 Q('c4',2,3,'Non-neighbouring coordinates',N('A rotation with c=0,s=1 acts on coordinates 1 and 3 of x=(2,7,5,9)ᵀ. Enter the transformed vector.',5,7,-2,9),['The selected pair becomes (5,−2).','Coordinates 2 and 4 are untouched.'],'The result is (5,7,−2,9).'),
 Q('c5',2,3,'Rows versus columns',[
 C('Left multiplication by an embedded G changes…',0,'the selected two rows.','every row equally.','only the selected two columns.'),
 C('For right multiplication with [[c,s],[−s,c]], the new first selected column is…',1,'c times the old first plus s times the old second.','c times the old first minus s times the old second.','always unchanged.'),
 C('Why retain both original rows during a row-pair update?',2,'It makes the matrix square.','To force symmetry.','Both new rows depend on both old rows.')
 ],['Write each side of the matrix product explicitly.','An in-place overwrite can corrupt the second formula.'],'Left multiplication combines rows, right multiplication combines columns with the stated minus sign. Both old rows must remain available.'),
 Q('c6',2,4,'Prove the structured zero pattern',[
 N('How many adjacent Givens rotations triangularise a 7×7 upper Hessenberg matrix?',6),
 C('Why do rows k,k+1 preserve earlier cleared columns?',1,'Every sparse matrix has no fill-in.','Both rows have zeros in those earlier positions.','The rotations are diagonal.'),
 C('What is the leading order of this structured triangularisation?',0,'O(n²)','O(n⁴)','O(1)')
 ],['One subdiagonal entry per column needs clearing.','There are n−1 rotations, each updating O(n) entries.'],'Six rotations suffice. Mixing shared zeros preserves them; total work is quadratic for this structure.'),
 Q('c7',2,4,'Recover Q from rotations',[
 C('If G₄G₃G₂G₁A=R, which is Q?',2,'G₄G₃G₂G₁','G₁G₂G₃G₄','G₁ᵀG₂ᵀG₃ᵀG₄ᵀ'),
 C('Why is this Q orthogonal?',0,'It is a product of orthogonal matrices.','Every triangular matrix is orthogonal.','The rotations are symmetric.')
 ],['Invert the entire product.','Inversion reverses the order and transposes each rotation.'],'A=G₁ᵀG₂ᵀG₃ᵀG₄ᵀR. Products of orthogonal matrices are orthogonal.'),
 Q('c8',2,5,'Local does not mean no fill',[
 C('Can rotating two sparse rows create a new nonzero entry?',1,'No, every zero is preserved.','Yes, if one row has a nonzero where the other has zero.','Only if G is nonorthogonal.'),
 C('For a pair (0,0), which valid choice avoids division by zero?',0,'c=1,s=0','c=0,s=0','c=1,s=1'),
 C('What usually makes Householder attractive for dense QR?',2,'It needs no arithmetic.','It is the only orthogonal transformation.','One reflector can clear a whole column tail.')
 ],['Locality limits affected rows, not their resulting nonzero positions.','Choose the identity for a zero pair.'],'Fill can occur inside the affected rows. The identity handles a zero pair, while dense Householder steps clear many entries at once.'),
 Q('d1',3,1,'What is being minimised?',C('For an overdetermined least-squares problem, the goal is…',0,'minimise ‖Ax−b‖₂, even when it cannot be zero.','solve every equation exactly in all cases.','minimise only the first n residual entries.'),['All observations contribute.','Overdetermined does not imply consistent.'],'Least squares minimises the residual over every row.'),
 Q('d2',3,1,'The triangular equation',C('With full-column-rank A=QR, the least-squares coefficients solve…',2,'Rx=b for any tall A.','Qx=b.','Rx=Qᵀb.'),['Qᵀb has n components.','R is n×n.'],'Solve Rx=Qᵀb; explicit R⁻¹ is unnecessary.'),
 Q('d3',3,2,'Fit and residual',N('For A with rows (1,0),(0,1),(1,1), b=(1,1,0)ᵀ, and x=(1/3,1/3)ᵀ, enter r=b−Ax.',2/3,2/3,-2/3),['Compute Ax=(1/3,1/3,2/3).','Subtract from b.'],'The residual is (2/3,2/3,−2/3).'),
 Q('d4',3,3,'Verify optimality',[
 N('For that residual and matrix, enter the two entries of Aᵀr, then ‖r‖₂².',0,0,4/3),
 C('What makes the coefficient vector unique?',1,'There are more rows than columns, regardless of rank.','Full column rank makes R nonsingular.','The minimum residual is always zero.')
 ],['Each column inner product adds two residual entries.','The squared norm is three copies of 4/9.'],'Aᵀr=(0,0) and the squared residual is 4/3. Full column rank ensures a unique coefficient vector.'),
 Q('d5',3,3,'The unavoidable residual block',N('In full QR coordinates, Qᵀb=(2,5)ᵀ, Q⊥ᵀb=(3,4)ᵀ, and R=diag(2,5). Enter the minimiser and the minimum residual norm.',1,1,5),['Set the controllable first block to zero.','The other block has length 5.'],'The minimiser is (1,1), with minimum residual norm √(9+16)=5.'),
 Q('d6',3,4,'Prove the least-squares theorem',[
 C('Why may the residual be multiplied by QFᵀ without changing its norm?',0,'QF is square orthogonal.','Every rectangular Qᵀ preserves every vector norm.','R is upper triangular.'),
 C('Which identity completes the minimisation?',2,R`$\|Ax-b\|^2=\|Rx-Q^Tb\|^2$ always`,R`$\|Ax-b\|^2=0$ always`,R`$\|Ax-b\|^2=\|Rx-Q^Tb\|^2+\|Q_\perp^Tb\|^2$`),
 C('What changes when A is rank deficient?',1,'There is no best fitted vector.','Coefficient minimisers are nonunique, although the fitted vector is unique.','Every residual is zero.')
 ],['Use the full orthogonal extension, not a thin norm-preservation claim.','Null vectors change coefficients without changing the fit.'],'Full QF preserves the whole norm. Only the first block depends on x. Rank deficiency permits null-space changes to coefficients, not multiple distinct best projections.'),
 Q('d7',3,4,'Compare methods and guarantees',[
 C('Which is the backward-stable interpretation of a QR least-squares result?',1,'It exactly solves the original data in every floating-point run.','It minimises a Euclidean residual for slightly perturbed A and b.','It guarantees tiny relative coefficient errors for every input.'),
 N('For square dense factorisation, enter the leading QR-to-LU flop ratio.',2),
 C('Which SVD route handles deficient least squares with minimum coefficient norm?',0,R`$x=V\Sigma^+U^Tb$`,R`$x=U\Sigma V^Tb$`,R`$x=A^Tb$ always`)
 ],['Backward error concerns nearby data.','Use reciprocal nonzero singular values in Σ⁺.'],'QR solves nearby least-squares data stably; conditioning still matters. The leading square cost ratio is 2, and the pseudoinverse supplies the minimum-norm solution.'),
 Q('d8',3,5,'Changing the residual norm',[
 N('Fit a constant to data 0,0,9. Enter the 2-norm least-squares optimum, then the 1-norm optimum.',3,0),
 C('In this 1-norm formulation, sparsity is encouraged in…',2,'the matrix dimensions.','necessarily the coefficient vector.','the residual being penalised.'),
 C('Does truncated-SVD optimality apply to every matrix norm?',1,'Yes, with no restriction.','No; the universal statement uses unitarily invariant norms.','It never applies to the spectral norm.')
 ],['The squared-error fit uses the mean; the absolute-error fit uses a median.','Distinguish the regression residual from coefficients and matrix approximation.'],'The optima are 3 and 0. The latter leaves two zero residuals. Truncated SVD need not be optimal for norms that are not unitarily invariant.'),
 Q('e1',4,1,'Form the normal equations',N('A has rows (1,0),(0,1),(1,1), and b=(1,1,0)ᵀ. Enter AᵀA row by row, then Aᵀb.',2,1,1,2,1,1),['Take column inner products.','Then take each column inner product with b.'],'AᵀA=[[2,1],[1,2]] and Aᵀb=(1,1).'),
 Q('e2',4,1,'When is the Gram matrix positive definite?',C('AᵀA is positive definite exactly when…',0,'A has full column rank.','A has full row rank regardless of its shape.','A contains only positive entries.'),['Use zᵀAᵀAz=‖Az‖².','A nonzero null vector prevents strict positivity.'],'Full column rank means Az≠0 for every nonzero z.'),
 Q('e3',4,2,'Squared conditioning',N('If κ₂(A)=300, enter κ₂(AᵀA).',90000),['Square the condition number.','300×300.'],'The Gram condition number is 90,000.'),
 Q('e4',4,3,'The weak Gram direction',[
 N('For Aε with rows (1,1),(ε,0),(0,ε), take ε=0.1. Enter the smaller and larger Gram eigenvalues.',0.01,2.01),
 C('When ε² is lost while adding it to 1 in floating point, what can happen?',2,'The exact columns become dependent.','QR factorisation ceases to exist mathematically.','The formed Gram matrix can appear singular despite full exact rank of Aε.')
 ],['The eigenvalues are ε² and 2+ε².','Rounding changes the represented Gram matrix.'],'The values are 0.01 and 2.01. Losing the small diagonal increment can erase the weak direction in the formed matrix.'),
 Q('e5',4,3,'A continuous least-squares fit',N('For the integral inner product on [−1,1], approximate t² by a+bt. Enter a,b and the squared integral error.',1/3,0,8/45),['Orthogonality to 1 and t gives 2/3−2a=0 and −2b/3=0.','Integrate (t²−1/3)².'],'a=1/3,b=0; the error is 2/5−4/9+2/9=8/45.'),
 Q('e6',4,4,'Prove best approximation',[
 C('If f−p* is orthogonal to the subspace, which identity proves optimality?',1,R`$\|f-p_*-q\|^2=\|f-p_*\|^2-\|q\|^2$`,R`$\|f-p_*-q\|^2=\|f-p_*\|^2+\|q\|^2$`,R`$\|f-p_*-q\|^2=0$`),
 C('Why is the approximating element unique?',0,'Equality requires ‖q‖²=0, hence q=0.','Every basis is unique.','The subspace has only one point.'),
 C('How is orthogonality shown necessary in the real case?',2,'Assume it without proof.','Take determinants.','Expand the error at p*+tq; a minimum at t=0 forces the linear coefficient to vanish.')
 ],['The cross term vanishes.','Vary in every direction in the subspace.'],'Pythagoras proves sufficiency and uniqueness. A directional quadratic expansion proves necessity.'),
 Q('e7',4,4,'Connect QR to Cholesky',[
 C('For SPD A=BᵀB and B=QR, which identity follows?',0,'A=RᵀR','A=RRᵀ for this same R in all cases','A=QᵀQ'),
 C('If R has first row rᵀ and remaining rows R₂, what is the first-update remainder?',2,'Always negative definite.','Always the identity.','R₂ᵀR₂, which is PSD with a zero first row and column.'),
 C('Why is its active trailing block PD?',1,'The whole padded remainder is PD.','The trailing triangular block of nonsingular R is nonsingular.','Every principal block of every matrix is PD.')
 ],['Cancel QᵀQ in BᵀB.','Use the triangular zero pattern of R₂.'],'A=RᵀR and the remainder is R₂ᵀR₂. Its padded zero direction prevents strict positivity of the whole remainder, but its trailing block is PD.'),
 Q('e8',4,5,'Which problem is being solved stably?',[
 C('A stable Cholesky solve of the formed Gram system implies…',1,'unconditional backward stability for the original least-squares data.','a reliable solve of that Gram system, which may already contain damaging formation error.','that Gram formation has no rounding error.'),
 C('Why does κ₂(AᵀA)=κ₂(A)²?',2,'All entries are individually squared.','AᵀA is orthogonal.','Its eigenvalues are the squared singular values of A.'),
 C('When is the normal-equations speed advantage most naturally seen in the leading count?',0,'For tall problems where forming the symmetric Gram matrix can use about mn² rather than QR’s 2mn² leading work.','For every shape with exactly the same runtime ratio.','Only when A is zero.')
 ],['Distinguish A,b from their derived Gram system.','Use the SVD to identify the extreme eigenvalues.'],'The method can be fast, especially for tall problems, while squaring conditioning and losing information before the stable inner solve begins.'),
 Q('f1',5,1,'Count polynomial coefficients',N('For degree at most 4 and 20 samples, enter the number of coefficients and the rows and columns of A.',5,20,5),['Include the constant coefficient.','Each sample supplies a row.'],'There are 5 coefficients and A is 20×5.'),
 Q('f2',5,1,'A Vandermonde row',N('For degree at most 3 and a sample at z=−2, enter its Vandermonde row in increasing powers.',1,-2,4,-8),['Start with z⁰=1.','Then z,z²,z³.'],'The row is (1,−2,4,−8).'),
 Q('f3',5,2,'Evaluate the model',N('For coefficients c=(2,−3,1) in increasing powers, enter p(2) and p(−1).',0,6),['p(t)=2−3t+t².','Substitute each input with its sign.'],'p(2)=0 and p(−1)=6.'),
 Q('f4',5,3,'Fit the three samples',[
 N('Fit a line to z=(−1,0,1) and y=(1,0,1). Enter c₀,c₁ and the squared residual norm.',2/3,0,2/3),
 N('A quadratic interpolates these samples. Enter its coefficients c₀,c₁,c₂.',0,0,1)
 ],['Symmetry gives slope zero and the mean gives the constant.','The samples are values of t².'],'The line is 2/3 with squared residual 2/3. The quadratic t² has coefficients (0,0,1) and zero sample error.'),
 Q('f5',5,3,'The degree-ten comparison',[
 N('For degree 10, enter the number of coefficients, then the number of excess equations with 100 samples.',11,89),
 C('What changes between 11 and 100 samples at fixed degree ten?',1,'The number of coefficients grows to 100.','The same 11 coefficients are constrained at many more locations.','The function must change.'),
 C('Does zero interpolation residual certify small error between nodes?',0,'No.','Yes, for every continuous function.','Yes, because QR is stable.')
 ],['Degree and coefficient count differ by one.','Training error only examines the sample locations.'],'There are 11 coefficients and 89 excess equations. Oversampling changes the data constraints, not the degree; interpolation can still behave poorly between nodes.'),
 Q('f6',5,4,'Prove Vandermonde rank',[
 C('If Ac=0 at d+1 distinct nodes, what does the associated polynomial satisfy?',2,'It has degree exactly d+1.','It is necessarily positive.','It has at least d+1 distinct roots despite degree at most d.'),
 C('Why does this imply full column rank?',0,'Only the zero polynomial can have that many distinct roots, so c=0.','Every rectangular matrix is full rank.','All Vandermonde matrices are orthogonal.'),
 C('Why is simply counting many repeated samples insufficient?',1,'Repeated points always add new independent columns.','Repeated nodes may give identical equations rather than independent constraints.','A polynomial has no values at repeated points.')
 ],['Apply the root-count theorem.','Distinctness is part of the hypothesis.'],'A nonzero degree-at-most-d polynomial has at most d distinct roots. Thus the null space is zero when there are enough distinct nodes; repeated nodes need not help.'),
 Q('f7',5,4,'Use the Lebesgue bound',[
 N('If the interpolation Lebesgue constant is 12 and every sample error is at most 0.001, enter the bound on the maximum interpolant change.',0.012),
 C('What inequality supplies this bound?',2,'Every Lagrange basis function is at most one in magnitude everywhere.',R`$\delta p=0$ always.`,R`$|\delta p(t)|\le\sum_i|\ell_i(t)|\max_i|\delta y_i|$.`),
 N('If the best degree-d uniform approximation error is at most 0.02 and Λ=12, enter the resulting (1+Λ) error bound for interpolation.',0.26)
 ],['Multiply the data error by Λ.','For approximation use 1+Λ, not Λ alone.'],'The perturbation bound is 0.012. The best-approximation bound is 13×0.02=0.26.'),
 Q('f8',5,5,'Separate three kinds of error',[
 C('What does a stable QR solve guarantee about an unsuitable polynomial model?',1,'It makes every function exactly polynomial.','It controls the numerical solve; it does not remove model or sampling error.','It guarantees accurate extrapolation.'),
 C('When degree increases with fixed samples, which exact-arithmetic statement holds?',0,'The optimal training residual cannot increase because the model spaces are nested.','The continuous uniform error must decrease.','The condition number must decrease.'),
 C('What does a maximum error measured on a finite dense grid represent?',2,'A certified supremum over every real input.','The exact Lebesgue constant.','An evaluation-grid estimate of between-sample error.')
 ],['Keep the model, sampling, and arithmetic issues separate.','Nested spaces guarantee a training-objective statement, not universal prediction improvement.'],'QR stability concerns numerical arithmetic. Expanded model spaces cannot worsen the optimal sample fit, but conditioning and unseen-point error can worsen; a finite-grid maximum is an estimate.'),
 Q('am1',0,3,'Fresh thin-QR dimensions',N('A is 9×4. Enter the sizes of thin Q and R.',9,4,4,4),['Q has four orthonormal columns.','R is square.'],'Q is 9×4 and R is 4×4.',true),
 Q('am2',0,3,'Fresh projection residual',N('For q₁=(1,0,0)ᵀ and a₂=(2,0,3)ᵀ, enter r₁₂ and r₂₂.',2,3),['Project onto e₁.','The remainder is (0,0,3).'],'The entries are 2 and 3.',true),
 Q('am3',0,4,'A valid normalisation',C('What hypothesis ensures all simple Gram–Schmidt residuals are nonzero?',1,'Symmetry of A.','Full column rank.','An even row count.'),['Dependence causes zero residuals.','The hypothesis concerns columns.'],'Full column rank makes every new column independent of its predecessors.',true),
 Q('bm1',1,3,'Fresh reflection',N('For v=(0,1)ᵀ and x=(−2,7)ᵀ, enter (I−2vvᵀ)x.',-2,-7),['Reverse the component parallel to v.','The first coordinate is orthogonal to v.'],'The result is (−2,−7).',true),
 Q('bm2',1,3,'Fresh compact-QR count',N('Evaluate the leading square Householder cost 4n³/3 for n=12.',2304),['12³=1728.','Multiply by 4/3.'],'The count is 2304.',true),
 Q('bm3',1,4,'Reflector ordering',C('If H₂H₁A=[R;0], then A equals…',0,'H₁H₂[R;0]','H₂H₁[R;0] in every case','(H₁+H₂)[R;0]'),['Invert the product.','Each H is its own inverse, but the order reverses.'],'A=H₁H₂[R;0].',true),
 Q('cm1',2,3,'Fresh rotation coefficients',N('To send (5,12)ᵀ to the positive first axis, enter c,s.',5/13,12/13),['The hypotenuse is 13.','Use a/r,b/r.'],'c=5/13,s=12/13.',true),
 Q('cm2',2,3,'Fresh Hessenberg count',N('How many adjacent Givens rotations are needed for an 8×8 upper Hessenberg triangularisation?',7),['One for each subdiagonal entry.','There are n−1 such positions.'],'Seven rotations.',true),
 Q('cm3',2,4,'The proper inverse',C('To undo a rotation on the left, multiply by…',2,'the same rotation in every case.','its negative.','its transpose.'),['Orthogonality gives the inverse.','Symmetry is not assumed.'],'Use Gᵀ.',true),
 Q('dm1',3,3,'Fresh QR solve',N('R=diag(3,2), Qᵀb=(6,−2)ᵀ. Enter the least-squares coefficients.',2,-1),['Back substitution is division for diagonal R.','Divide each corresponding entry.'],'The solution is (2,−1).',true),
 Q('dm2',3,3,'Fresh irreducible residual',N('The perpendicular transformed component is (−6,8)ᵀ. Enter the minimum residual norm.',10),['Take the Euclidean length.','36+64=100.'],'The minimum residual norm is 10.',true),
 Q('dm3',3,4,'Optimal residual geometry',C('At a Euclidean least-squares minimiser, b−Ax is…',0,'orthogonal to every column of A.','always zero.','parallel to every column of A.'),['It is the part outside the column space.','Use the projection split.'],'The optimal residual is orthogonal to range(A).',true),
 Q('em1',4,3,'Fresh squared condition number',N('κ₂(A)=80. Enter κ₂(AᵀA).',6400),['Square 80.','Use the full-column-rank identity.'],'The answer is 6400.',true),
 Q('em2',4,3,'Best constant in an integral norm',N('Approximate f(t)=t²+2 on [−1,1] by a constant in the integral 2-norm. Enter that constant.',7/3),['Average f over the interval of length two.','The average of t² is 1/3.'],'The best constant is 2+1/3=7/3.',true),
 Q('em3',4,4,'A formed Gram system',C('Why can normal equations lose accuracy even with a stable Cholesky solve?',1,'Cholesky always fails on SPD matrices.','The formation step and squared conditioning can damage the derived system.','AᵀA has negative exact eigenvalues for full-rank A.'),['Separate data formation from the subsequent solve.','The Gram eigenvalues are squared singular values.'],'The Gram matrix may already have lost small-scale information before Cholesky starts.',true),
 Q('fm1',5,3,'Fresh regression dimensions',N('For degree at most 6 and 40 samples, enter the number of coefficients and the number of excess equations.',7,33),['Include degree zero.','Subtract coefficients from samples.'],'There are 7 coefficients and 33 excess equations.',true),
 Q('fm2',5,3,'Fresh perturbation bound',N('Λ=5 and maximum sample error is 0.002. Enter the interpolation perturbation bound.',0.01),['Multiply the two quantities.','5×0.002.'],'The bound is 0.01.',true),
 Q('fm3',5,4,'Training versus prediction',C('An interpolating polynomial has zero residual at its nodes. What follows between nodes?',2,'Its error is necessarily zero.','It must minimise every continuous error norm.','No small-error guarantee follows from the sample residual alone.'),['The objective only examined the nodes.','Node pattern and function behaviour still matter.'],'A perfect training fit does not certify between-node accuracy.',true)
];
