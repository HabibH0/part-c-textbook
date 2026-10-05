const N=(prompt,...answer)=>({type:'numeric',prompt,answer});
const C=(prompt,answer,...options)=>({type:'choice',prompt,answer:String(answer),options:options.map((label,i)=>[String(i),label])});
const ids=['spectral-symmetric','spectral-bidiagonal','spectral-generalised','spectral-extensions'];
export const chapter9Lessons=[
 ['Symmetric QR and spectral splitting','Symmetric QR','Exploit tridiagonal structure and separate invariant subspaces with rational filters.','35–45 min',['Prove that symmetric Hessenberg reduction is tridiagonal','Distinguish band updates from eigenvector accumulation','Apply a Wilkinson shift and symmetric deflation','Explain tridiagonal alternatives and spectral divide-and-conquer']],
 ['Computing the SVD by bidiagonalisation','Bidiagonal SVD','Alternate left and right transformations while protecting small singular-value information.','40–50 min',['Explain the accuracy cost of forming a Gram matrix','Trace every stage of Golub–Kahan bidiagonalisation','Recover both families of singular vectors','Interpret bidiagonal solvers and rectangular work estimates']],
 ['Generalised eigenvalues and the QZ algorithm','Generalised eigenvalues','Solve a matrix-pair problem and distinguish finite, infinite and indeterminate eigenvalues.','40–50 min',['Define regular pencils and finite versus infinite eigenvalues','Prove reality for symmetric positive-definite pairs','Derive the generalised Schur diagonal ratios','Explain QZ preprocessing and its implicit QR connection']],
 ['Polynomial and nonlinear spectral problems','Beyond linear eigenproblems','Turn polynomial problems into larger pencils and check nonlinear approximations in the original equation.','30–40 min',['Compare dense spectral cost models','Derive a quadratic linearisation and recover eigenvectors','Bound the residual introduced by polynomial approximation','Distinguish eigenvalue nonlinearity from eigenvector nonlinearity']]
].map(([title,short,description,readTime,objectives],i)=>({id:ids[i],chapter:'spectral-methods',number:String(i+1).padStart(2,'0'),title,short,description,readTime,objectives,lab:ids[i]}));
const Q=(id,section,level,title,task,hints,solution,mastery=false)=>({id:'sp-'+id,lesson:ids[section],level,title,...(Array.isArray(task)?{type:'multi',prompt:'Complete each part.',parts:task}:task),hints,solution,mastery});
export const chapter9Exercises=[
 Q('a1',0,1,'Use both structures',C('A real symmetric upper Hessenberg matrix is necessarily…',1,'diagonal.','tridiagonal.','upper triangular.'),['Hessenberg removes entries below the first subdiagonal.','Symmetry removes the transposed entries too.'],'Only the main diagonal and its two neighbouring diagonals can remain.'),
 Q('a2',0,1,'Count the stored entries',N('How many independent diagonal and off-diagonal numbers represent a symmetric tridiagonal 8×8 matrix?',15),['Store 8 diagonal entries.','The two off-diagonals share 7 numbers.'],'8+7=15 independent numbers, or 2n−1 in general.'),
 Q('a3',0,2,'Choose a trailing-block shift',N('The trailing block is [3,1;1,3]. Enter its eigenvalues in increasing order, followed by the Wilkinson shift under the convention sign(0)=+1.',2,4,2),['The eigenvalues are 3±1.','In the stable formula δ=0, so subtract 1 from d.'],'The eigenvalues are 2 and 4. Both are equally close to 3; the stated convention chooses 2.'),
 Q('a4',0,3,'Separate the two costs',[
 C('A structured eigenvalue-only tridiagonal sweep costs…',0,'O(n).','O(n²) necessarily.','O(n³) necessarily.'),
 C('Applying its O(n) rotations to all n dense eigenvectors generally costs…',2,'O(1).','O(n).','O(n²).'),
 N('Doubling the dense input dimension multiplies the leading reduction cost by what factor?',8)
 ],['A local band update touches only a bounded number of entries.','A dense vector matrix has n entries along each rotated pair.'],'Band work is O(n); accumulating dense vectors is O(n²) per sweep. The cubic reduction grows by 2³=8.'),
 Q('a5',0,3,'Remove a symmetric coupling',[
 N('Removing the two symmetric entries t₂₃=t₃₂=−0.03 creates a perturbation of what spectral norm?',0.03),
 C('Why is the norm not twice that number?',1,'The perturbation is zero.','The nonzero 2×2 block has eigenvalues ±0.03.','Spectral norm sums all absolute entries.')
 ],['Restrict to rows and columns 2 and 3.','The spectral norm of a symmetric matrix is its largest absolute eigenvalue.'],'The block [0,0.03;0.03,0] has eigenvalues ±0.03 and norm 0.03.'),
 Q('a6',0,4,'Prove the structured reduction',[
 C('For symmetric A and orthogonal V, (VᵀAV)ᵀ equals…',1,'VAVᵀ always','VᵀAV','−VᵀAV'),
 C('Combining symmetry with zeros for i>j+1 also forces zeros when…',0,'j>i+1.','i=j.','|i−j|=1.'),
 C('If T=VᵀAV and T=ZΛZᵀ, an eigenvector matrix for A is…',2,'ZV','V+Z','VZ')
 ],['Transpose the product in reverse order.','Substitute the second factorisation into the first.'],'Orthogonal similarity preserves symmetry. The transposed Hessenberg zeros give tridiagonality, and A=(VZ)Λ(VZ)ᵀ.'),
 Q('a7',0,4,'Make a spectral projector',[
 N('For eigenvalues −3,−1,2,5 and threshold μ=0, enter the diagonal filter values (1+sign(λ−μ))/2 in that order.',0,0,1,1),
 C('Which space does this exact filter project onto?',0,'The invariant subspace for eigenvalues above μ.','The entire space for every threshold.','The nullspace of A regardless of μ.'),
 C('Why avoid a threshold exactly at an eigenvalue in the rational sign construction?',2,'It makes the matrix dimension odd.','It changes all eigenvalues to infinity.','The shifted operator has a zero eigenvalue, so an inverse-based sign step is undefined.')
 ],['The sign is −1 below the threshold and +1 above it.','Convert signs to zeros and ones.'],'The filter values are 0,0,1,1. A threshold in a gap defines complementary spectral subspaces; a zero shifted eigenvalue invalidates the inverse step.'),
 Q('a8',0,5,'Explain recursive separation',[
 C('A good approximate sign filter alone is not yet a block diagonalisation. What is needed next?',2,'Round every matrix entry to an integer.','Discard the smaller eigenvalues.','Obtain orthonormal subspace bases and check the transformed off-block couplings.'),
 C('After a split into sizes 3 and 2, what can a spectral divide-and-conquer method do?',1,'Stop because every block is scalar.','Recursively split both blocks.','Treat the upper-right block as another eigenproblem of size 5.'),
 C('Which statement about alternatives is accurate?',0,'Tridiagonal divide-and-conquer and HODLR methods exploit additional structure; costs depend on outputs and implementation.','Every alternative has exactly the same flop count.','HODLR means every matrix is exactly rank one.')
 ],['A filter helps find subspaces; a basis change exposes the blocks.','Recursion ends when the required spectral pieces are resolved.'],'Orthonormal bases and coupling checks turn separation into useful blocks, which can be split recursively. Structured alternatives have different costs and output tradeoffs.'),
 Q('b1',1,1,'Identify the SVD reduction',C('The usual Golub–Kahan reduction for m≥n produces…',2,'a general upper Hessenberg matrix.','a diagonal matrix immediately.','an upper bidiagonal matrix with any extra bottom rows zero.'),['One diagonal and one superdiagonal remain.','The full SVD still has a reduced problem to solve.'],'The reduction leaves an upper bidiagonal active block, not the completed diagonal singular-value matrix.'),
 Q('b2',1,1,'Which spectrum is preserved?',C('Independent left and right orthogonal multiplications preserve…',0,'singular values.','all eigenvalues of every square matrix.','every matrix entry.'),['Write B=LᵀAR.','Compare BᵀB with AᵀA.'],'BᵀB=RᵀAᵀAR, so their eigenvalues and hence the singular values agree.'),
 Q('b3',1,2,'Form the tridiagonal Gram matrix',N('For B=[3,4;0,2], enter BᵀB in row-major order.',9,12,12,20),['Use the inner products of the columns (3,0) and (4,2).','The final diagonal is 4²+2².'],'BᵀB=[9,12;12,20].'),
 Q('b4',1,3,'Follow all reflector stages',[
 N('For the generic 5×4 bidiagonalisation described in the lesson, give the number of left reflectors and nontrivial right elimination stages.',4,2),
 C('Why is a third right elimination stage unnecessary?',1,'The matrix has become symmetric.','Row 3 has only one possible entry beyond its diagonal.','All singular values are already on the diagonal.')
 ],['Each of four columns has a tail to clear.','Right transformations clear entries beyond the superdiagonal.'],'Four left stages clear the column tails. Only rows 1 and 2 have more than one active entry to their right, so two right stages suffice.'),
 Q('b5',1,3,'See squared conditioning',[
 N('A full-column-rank matrix has κ₂(A)=1000. What is κ₂(AᵀA)?',1000000),
 C('If forming AᵀA rounds a small squared singular value to zero, taking a square root later…',2,'restores the missing value exactly.','always doubles the correct value.','cannot recover the information already lost.')
 ],['The singular values are squared.','A square root is applied to the rounded result.'],'κ₂(AᵀA)=10⁶. Once the small eigenvalue information is lost in the Gram matrix, a square root cannot restore it.'),
 Q('b6',1,4,'Prove invariance and recover vectors',[
 C('If B=LᵀAR with orthogonal L,R, then BᵀB equals…',1,'LᵀAᵀAL','RᵀAᵀAR','AᵀA in the same coordinates always'),
 C('If B=U_BΣV_Bᵀ, the left vectors for A are…',0,'LU_B','RU_B','LᵀU_B'),
 C('The right vectors for A are…',2,'LV_B','RᵀV_B','RV_B')
 ],['Cancel LLᵀ in the Gram product.','Substitute the reduced SVD into A=LBRᵀ.'],'BᵀB=RᵀAᵀAR proves singular-value invariance. The factors are U=LU_B and V=RV_B.'),
 Q('b7',1,4,'Preserve zeros during reduction',[
 C('At the second left stage, why is the cleared first column safe?',0,'Its entries in the active rows are already zero.','The first column is never multiplied on the left.','Every orthogonal transformation preserves every zero.'),
 C('The second right reflector fixes which leading coordinates?',2,'None','Only coordinate 1','Coordinates 1 and 2'),
 C('For a wide input m<n, a useful way to reuse the tall construction is…',1,'Pad arbitrary nonzero rows without tracking them.','Bidiagonalise Aᵀ and exchange the left/right roles on transposing back.','Form AᵀA to avoid any accuracy issue.')
 ],['Inspect the supports of the two reflectors.','Transposition exchanges row and column transformations.'],'The active tail of column 1 is zero; the right reflector fixes the first two columns. Wide inputs can use the transposed construction.'),
 Q('b8',1,5,'Choose the numerical interpretation',[
 C('The relation to QR on BᵀB means an accurate SVD implementation must…',2,'explicitly form BᵀB in every case.','treat the diagonal of B as singular values.','use the relation mathematically while applying appropriate transformations to B without unnecessarily squaring it.'),
 C('Which optional algorithm is chiefly a singular-value method?',0,'dqds','A general dense eigenvector accumulator','A triangular back substitution alone'),
 C('Normwise backward stability of bidiagonalisation guarantees…',1,'arbitrarily high relative accuracy for all tiny singular values.','a small perturbation of the input in norm, not a universal relative-accuracy promise.','that all singular values are nonzero.')
 ],['Separate an algebraic explanation from its floating-point implementation.','Recall the distinction between absolute and relative error.'],'Avoiding explicit squaring is central. dqds targets values; normwise stability does not by itself guarantee tiny relative errors for arbitrarily small singular values.'),
 Q('c1',2,1,'Recognise a pencil',C('The finite generalised eigenvalues of a regular pair satisfy…',1,'det(A+B)=0 for all λ.','det(A−λB)=0.','A=λI always.'),['Move λBx to the left.','A nonzero null vector requires singularity.'],'A−λB must be singular, so its determinant vanishes.'),
 Q('c2',2,1,'Read a diagonal pair',N('For A=diag(6,10) and B=diag(2,5), give the generalised eigenvalues in coordinate order.',3,2),['Each coordinate satisfies aᵢxᵢ=λbᵢxᵢ.','Divide the corresponding diagonal entries.'],'The ratios are 6/2=3 and 10/5=2.'),
 Q('c3',2,2,'Distinguish infinity from indeterminacy',[
 C('A homogeneous eigenvalue pair (3,0) represents…',2,'the finite value 0.','an ordinary missing decimal.','an infinite eigenvalue.'),
 C('The pair (0,0) represents…',0,'an indeterminate ratio requiring further analysis.','the eigenvalue 1.','the eigenvalue 0 automatically.')
 ],['The finite representation is α/β.','Do not assign a value to 0/0.'],'A nonzero numerator over zero represents infinity. A 0/0 pair is indeterminate, rather than a finite eigenvalue.'),
 Q('c4',2,3,'Perform the symmetric transformation',N('For A=[4,2;2,3], B=diag(4,1), C=diag(2,1), enter C⁻¹AC⁻ᵀ in row-major order.',1,1,1,3),['Scale row 1 and column 1 each by 1/2.','The lower-right entry stays 3.'],'The result is [1,1;1,3], which is symmetric.'),
 Q('c5',2,3,'Recover and normalise an eigenvector',[
 N('Let B=diag(4,1), C=diag(2,1), and transformed unit eigenvector y=(1,0)ᵀ. Enter x=C⁻ᵀy, then xᵀBx.',0.5,0,1),
 C('The recovered vectors are naturally orthonormal in…',1,'the ordinary Euclidean inner product for every B.','the B inner product.','no inner product.')
 ],['Undo the Cholesky coordinate map.','Compute 4(1/2)².'],'x=(1/2,0)ᵀ and xᵀBx=1. The transformation preserves B-orthogonality, not necessarily Euclidean orthogonality.'),
 Q('c6',2,4,'Prove the real spectrum',[
 C('With B=CCᵀ positive definite and A symmetric, which transformed matrix is symmetric?',2,'C⁻¹A alone','B⁻¹A necessarily in ordinary coordinates','C⁻¹AC⁻ᵀ'),
 C('Why must its eigenvalues be real?',0,'The spectral theorem applies to a real symmetric matrix.','Every matrix with real entries has real eigenvalues.','Its trace is positive.'),
 C('What fails if B is symmetric indefinite?',1,'A can no longer be a square matrix.','The positive-definite Cholesky reduction and positive denominator argument no longer apply.','Every eigenvalue must then be infinite.')
 ],['Transpose C⁻¹AC⁻ᵀ.','Identify exactly where positive definiteness was used.'],'The transformed matrix is symmetric and has real eigenvalues. An indefinite B does not provide that reduction or a positive quadratic denominator.'),
 Q('c7',2,4,'Derive the QZ ratios',[
 C('For S=Q*AZ and T=Q*BZ, S−λT equals…',1,'Z*(A−λB)Q','Q*(A−λB)Z','Q*A−λBZ with no other factors'),
 C('If both are upper triangular and tᵢᵢ≠0, the corresponding eigenvalue is…',2,'tᵢᵢ/sᵢᵢ','sᵢᵢ+tᵢᵢ','sᵢᵢ/tᵢᵢ'),
 C('To recover an eigenvector from (S−λT)y=0, use…',0,'x=Zy.','x=Qy always.','x=y in every coordinate system.')
 ],['Factor the common left and right transformations.','Use the triangular determinant and substitute x=Zy.'],'The transformed determinant differs by a nonzero factor. Its roots are diagonal ratios when denominators are nonzero, and right eigenvectors transform through Z.'),
 Q('c8',2,5,'Why work on the pair?',[
 C('The first structural QZ reduction targets…',2,'two arbitrary diagonal matrices immediately.','two unrelated QR factorisations with no coordination.','a Hessenberg first matrix and triangular second matrix.'),
 C('For invertible B, T⁻¹S equals…',0,'Z*B⁻¹AZ.','Q*B⁻¹AQ.','B⁻¹A with no basis change always.'),
 C('Why avoid explicitly forming B⁻¹A?',1,'It never has the correct eigenvalues.','It can add rounding and lose structure, and cannot cover singular B.','It makes every problem symmetric.')
 ],['Invert the product Q*BZ in reverse order.','Cancel the adjacent unitary factors.'],'T⁻¹S=Z*B⁻¹AZ explains implicit QR. Coordinated pair transformations retain structure and avoid an explicit inverse, including for regular singular-B pencils.'),
 Q('d1',3,1,'Count the polynomial degree',N('For P(λ)=A₀+λA₁+λ²A₂+λ³A₃ with nonzero A₃ and 5×5 coefficients, enter the degree and usual linearisation dimension.',3,15),['The largest power is three.','Multiply matrix size by degree.'],'The degree is 3 and the linearisation has dimension nk=15.'),
 Q('d2',3,1,'Distinguish two nonlinearities',C('Which problem is nonlinear in the eigenvector itself?',2,'Ax=λx with fixed A.','(Ae^λ+B)x=0 with fixed A,B.','A(x)x=λx.'),['Ask whether changing x changes the operator.','Dependence on λ is a different type of nonlinearity.'],'In A(x)x=λx, the operator changes with the unknown vector.'),
 Q('d3',3,2,'Build a scalar linearisation',N('For λ²−5λ+6=0, enter the row-major matrix [0,1;−C,−B], then the roots in increasing order.',0,1,-6,5,2,3),['Here B=−5 and C=6.','Factor the quadratic.'],'The matrix is [0,1;−6,5], and (λ−2)(λ−3)=0 gives roots 2 and 3.'),
 Q('d4',3,3,'Understand expanded cost',[
 N('For n=10 and degree k=3, enter nk and the estimate 20(nk)³.',30,540000),
 N('Holding n fixed, doubling k multiplies that estimate by what factor?',8)
 ],['The expanded matrix has size 30.','Cube the expanded dimension.'],'20·30³=540000. Doubling k doubles the dimension and multiplies the cubic estimate by eight.'),
 Q('d5',3,3,'Check a nonlinear approximation',[
 N('The linear approximation to e^λ−2 is 1+λ−2. What root does it predict?',1),
 C('Which quantity checks that candidate against the original equation?',0,'|e¹−2|','|1+1−2| alone','The matrix dimension'),
 C('A zero polynomial residual guarantees…',2,'the candidate is an exact nonlinear root everywhere.','the nonlinear problem has only one complex root.','only that the approximation is solved; the original residual must still be checked.')
 ],['Solve the linear polynomial.','Substitute into the exponential equation separately.'],'The polynomial root is 1, but e−2 is not zero. Solving an approximation exactly does not eliminate approximation error.'),
 Q('d6',3,4,'Prove the quadratic correspondence',[
 C('The first row of [0,I;−C,−B]y=λ[I,0;0,A]y implies…',1,'y₁=0 always.','y₂=λy₁.','y₂=y₁/λ in every case.'),
 C('Substituting into the second row yields…',2,'(A+B+C)y₁=0.','Ay₁=0 only.','(λ²A+λB+C)y₁=0.'),
 C('Why can a finite nonzero y not have y₁=0?',0,'The first relation would also force y₂=0.','A must be diagonal.','λ must be positive.')
 ],['Write y as two n-component blocks.','Substitute the first block equation into the second.'],'The first block gives y₂=λy₁. The second is precisely the polynomial equation, and y₁=0 would force the entire eigenvector to vanish.'),
 Q('d7',3,4,'Bound the original residual',[
 N('At a candidate λ, ||N−P||≤0.02, ||x||=1 and ||P(λ)x||≤0.003. Give the resulting bound on ||N(λ)x||.',0.023),
 C('Does that bound alone guarantee eigenvalue error at most 0.023?',1,'Yes, for every nonlinear problem.','No; translating residual to eigenvalue error needs conditioning information.','Only if the polynomial degree is even.')
 ],['Write Nx=(N−P)x+Px.','Apply the triangle inequality and the operator-norm bound.'],'The bound is 0.02·1+0.003=0.023. It controls a residual, not the forward eigenvalue error without further assumptions.'),
 Q('d8',3,5,'Choose a defensible solver strategy',[
 C('Why specify a region when replacing N(λ) by a polynomial?',2,'Polynomials cannot be evaluated outside the real line.','It makes every approximation exact.','Accuracy is regional and a nonlinear problem may have infinitely many roots globally.'),
 C('Why can normalization be part of A(x)x=λx?',0,'Scaling x may change A(x), so arbitrary rescaling need not preserve the equation.','All eigenvectors must have integer entries.','It eliminates every nonlinear difficulty.'),
 C('Why avoid dense linearisation blindly for a large sparse problem?',1,'Linearisation is never mathematically valid.','It can enlarge the dimension and destroy useful sparsity or other structure.','Sparse matrices have no eigenvalues.')
 ],['Separate the finite approximation from the original problem.','Track how size and structure change.'],'A region controls approximation validity. Vector-dependent operators need a specified normalization, and linearisation must respect cost, structure and conditioning.'),
 Q('am1',0,5,'A fresh tridiagonal argument',[
 N('A symmetric 6×6 dense reduction clears how many entries below the first subdiagonal in stages 1,2,3,4?',4,3,2,1),
 C('What happens to their reflected positions above the diagonal after each completed similarity?',1,'They can remain arbitrary.','They vanish by symmetry.','They become eigenvalues.'),
 N('How many independent entries remain in the final symmetric tridiagonal matrix?',11)
 ],['Stage j clears rows j+2 through n in column j.','Use symmetry and 2n−1 storage.'],'The counts are 4,3,2,1; symmetric counterparts vanish too. The result has 6+5=11 independent entries.',true),
 Q('am2',0,5,'A new Wilkinson calculation',[
 N('For trailing block [4,2;2,1], enter its eigenvalues in increasing order and the one closest to d=1.',0,5,0),
 C('If b is already zero, the appropriate first action is…',2,'divide by b.','add a random coupling.','recognise the block split and deflate.')
 ],['The trace is 5 and determinant is 0.','Compare the distances from 1.'],'The eigenvalues are 0 and 5, at distances 1 and 4 from d=1. The shift is 0. A zero coupling is already a split.',true),
 Q('am3',0,5,'Interpret a rational filter',[
 N('Start the scalar sign iteration at r₀=2. Enter r₁ and the approximate projector value (1+r₁)/2.',1.25,1.125),
 C('Why is a value above 1 not a contradiction?',0,'This is an approximate rational filter, not yet an exact orthogonal projector.','Exact orthogonal projectors always have eigenvalue 1.125.','The matrix must have negative dimension.'),
 C('Which condition makes the exact sign split well defined?',1,'Every eigenvalue equals μ.','μ lies away from the spectrum.','A is nonsymmetric necessarily.')
 ],['Compute (2+1/2)/2.','Apply the projector formula after the update.'],'r₁=1.25 and the filter value is 1.125. Iteration approaches the exact 0/1 projector when the threshold lies in a gap.',true),
 Q('bm1',1,5,'A fresh bidiagonal Gram matrix',[
 N('For B=[2,1,0;0,3,2;0,0,4], enter the diagonal of BᵀB, then its first superdiagonal.',4,10,20,2,6),
 N('Enter the sum of squared singular values of B.',34)
 ],['Use diagonal dᵢ²+eᵢ₋₁² and off-diagonal dᵢeᵢ.','The sum is the trace of the Gram matrix.'],'The diagonal is 4,10,20 and superdiagonal 2,6. Their diagonal sum 34 equals ||B||²_F.',true),
 Q('bm2',1,5,'Recover the full SVD safely',[
 C('Given B=LᵀAR=U_BΣV_Bᵀ, the reconstructed original matrix is…',2,'RU_BΣ(LV_B)ᵀ','LᵀU_BΣ(RᵀV_B)ᵀ','LU_BΣ(RV_B)ᵀ'),
 C('If a singular value is zero, constructing a matching vector by Av/σ is…',0,'undefined; use an appropriate orthonormal nullspace completion.','always safe.','equal to v automatically.'),
 C('Does bidiagonalisation preserve eigenvalues of a general square matrix?',1,'Yes, every two-sided operation is a similarity.','No; independent left and right orthogonal factors preserve singular values.','Only because its diagonal is positive.')
 ],['Undo the reduction in the correct order.','Keep the distinction between SVD and similarity.'],'The factors are LU_B and RV_B. Zero singular values cannot be used as divisors, and two-sided orthogonal equivalence preserves singular values rather than general eigenvalues.',true),
 Q('bm3',1,5,'Reconcile two work estimates',[
 N('At m=n=3, evaluate the leading reduction formula 4mn²−4n³/3.',72),
 C('Which expression agrees with that formula when m=n?',1,'4n³ exactly','8n³/3','20n³ exactly'),
 C('Why specify thin versus full singular vectors for a tall matrix?',2,'The singular values change when the output shape changes.','Full left vectors need no storage.','A full m×m left basis can require much more storage and formation work.')
 ],['Substitute m=n before simplifying.','Remember that a thin left factor has only n columns.'],'4·27−4·27/3=72=(8/3)·27. A full left basis adds many columns when m≫n.',true),
 Q('cm1',2,5,'A regular pencil with an infinite eigenvalue',[
 N('For A=diag(4,5), B=diag(2,0), give the single finite eigenvalue.',2),
 C('The second homogeneous pair is…',2,'(0,5), a finite zero.','(0,0), automatically finite.','(5,0), an infinite eigenvalue.'),
 C('Is this pencil regular?',0,'Yes; det(A−λB)=5(4−2λ) is not identically zero.','No; any singular B makes the pencil singular.','No; regular pencils cannot have infinity.')
 ],['Compute the two diagonal factors of the determinant.','Regularity concerns the polynomial, not B alone.'],'The finite root is 2; (5,0) represents infinity. The determinant polynomial is nonzero, so the pencil is regular.',true),
 Q('cm2',2,5,'A positive-definite pair',[
 N('For A=diag(9,8), B=diag(3,2), give the two eigenvalues in coordinate order.',3,4),
 C('Which identity expresses recovered eigenvector orthogonality?',1,'XᵀX=B always','XᵀBX=I','XBXᵀ=0'),
 C('Which hypothesis is essential to the lesson’s real-spectrum guarantee?',2,'B has trace zero.','A and B commute.','A is symmetric and B is symmetric positive definite.')
 ],['Diagonal ratios give the eigenvalues.','Recall the Cholesky change of coordinates.'],'The eigenvalues are 3 and 4. The recovered basis is B-orthonormal, and symmetry plus positive definiteness supplies the guarantee without a commuting assumption.',true),
 Q('cm3',2,5,'Triangular ratios are not all the vectors',[
 N('For S=[2,1;0,3] and T=I, enter an eigenvector for λ=3 with second component 1.',1,1),
 C('Why is e₂ not itself that eigenvector?',0,'Se₂=(1,3)ᵀ is not 3e₂.','The eigenvalue 3 is infinite.','T is singular.'),
 C('After a general QZ transformation, the corresponding original vector is…',2,'Qy always.','the second diagonal of S.','Zy, where (S−λT)y=0.')
 ],['Solve −y₁+y₂=0.','Undo the right coordinate transformation.'],'y=(1,1)ᵀ solves the triangular equation, while e₂ does not. Recover x=Zy; Schur vectors are not generally individual eigenvectors.',true),
 Q('dm1',3,5,'A quadratic with nonunit leading coefficient',[
 N('For 2λ²−5λ+2=0, enter the roots in increasing order.',0.5,2),
 N('For its scalar linearisation, enter the diagonal of the right-hand pencil matrix.',1,2),
 C('Which vector corresponds to either finite root?',1,'(λ,0)ᵀ','(1,λ)ᵀ','(0,1)ᵀ for every λ')
 ],['Factor (2λ−1)(λ−2).','Use the blocks diag(I,A).'],'The roots are 1/2 and 2. The pencil has right matrix diag(1,2), and y=(1,λ)ᵀ satisfies both block equations.',true),
 Q('dm2',3,5,'Approximation error versus solve error',[
 N('For ||N−P||≤0.004, ||x||=2 and ||Px||≤0.001, bound ||Nx||.',0.009),
 C('If a polynomial approximation has another root far outside its stated region, what is justified?',2,'Declare it an exact root of N.','Ignore the stated region because all polynomials are global approximations.','Check it in N and assess approximation validity there before accepting it.'),
 C('How many complex roots does e^λ=2 have?',0,'Infinitely many: log 2 + 2πij.','Exactly one.','Exactly the polynomial degree.')
 ],['Apply ||(N−P)x||≤||N−P||·||x||.','The exponential repeats under imaginary shifts of 2πi.'],'The residual bound is 0.004·2+0.001=0.009. The original exponential equation has infinitely many complex roots; a regional polynomial is not a global replacement.',true),
 Q('dm3',3,5,'Choose a cost model with its qualifications',[
 N('Under the table’s model, nonsymmetric eigenvalues cost 10n³ and extra eigenvectors cost 15n³. Enter the total coefficient of n³.',25),
 N('For a degree-4 polynomial of size n=20, enter the linearisation dimension.',80),
 C('What might make a dense cubic estimate an inappropriate choice for a huge sparse problem?',1,'Sparse matrices cannot have nonzero entries.','Structure-preserving iterative methods may use cheap matrix–vector products without forming a complete dense factorisation.','Every nonlinear eigenproblem is automatically solved in one iteration.')
 ],['Add the values and additional-vector counts.','Track the expanded dimension and available structure.'],'The total is 25n³ and the linearisation dimension is 80. Sparse or low-rank structure can favour methods that avoid a full dense reduction.',true)
];
