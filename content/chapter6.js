const S=String.raw;
const N=(prompt,...answer)=>({type:'numeric',prompt,answer});
const C=(prompt,answer,...options)=>({type:'choice',prompt,answer:String(answer),options:options.map((label,i)=>[String(i),label])});
const ids=['stability-floating','stability-errors','stability-conditioning','stability-solvers','stability-products','stability-qr'];
export const chapter6Lessons=[
 ['Floating-point arithmetic','Floating point','Understand how finite binary arithmetic creates and exposes rounding errors.','25–35 min',['Distinguish unit roundoff from the spacing above one','Apply the standard rounding model and its assumptions','Explain cancellation and harmonic-sum stagnation','Interpret dimension-dependent O(u) notation']],
 ['Conditioning and measures of error','Conditioning & error','Separate sensitivity of the problem from reliability of the algorithm.','30–40 min',['Calculate absolute and relative condition numbers','Distinguish forward, backward and mixed errors','Construct a nearby-input explanation','State and qualify the conditioning-times-backward-error principle']],
 ['Matrix conditioning and perturbation bounds','Matrix perturbations','Prove how small input errors can become large solution errors.','35–45 min',['Derive the Neumann-series perturbation theorem','Use a finite bound and its first-order limit','Calculate a residual-based backward error','Distinguish value sensitivity from vector sensitivity']],
 ['Stability of linear solvers','Linear solvers','Track rounding through substitution, LU and Cholesky.','35–45 min',['Use the componentwise triangular-solve bound','Prove the LU solve criterion by composing perturbations','Explain exponential growth under partial pivoting','State the Cholesky guarantee with its completion assumptions']],
 ['Products, inverses and orthogonality','Products & inverses','Find when separate small errors can be explained by one nearby input.','35–45 min',['Prove dot-product and matrix–vector backward stability','Use a rank obstruction for matrix multiplication','Prove the product forward bound and orthogonal exceptions','Explain why separate stable solves do not establish a stable inverse']],
 ['Stability of QR and Gram–Schmidt','QR stability','Compare reconstruction accuracy with preservation of orthogonality.','35–45 min',['Expand the accumulated Householder error and bound it','Separate backward accuracy from accuracy of individual factors','Explain classical, modified and twice-applied Gram–Schmidt','Measure both QR errors on nearly dependent columns']]
].map(([title,short,description,readTime,objectives],i)=>({id:ids[i],chapter:'stability',number:String(i+1).padStart(2,'0'),title,short,description,readTime,objectives,lab:ids[i]}));
const Q=(id,section,level,title,task,hints,solution,mastery=false)=>({id:`st-${id}`,lesson:ids[section],level,title,...(Array.isArray(task)?{type:'multi',prompt:'Complete each part.',parts:task}:task),hints,solution,mastery});
export const chapter6Exercises=[
 Q('a1',0,1,'Count the binary spacing',N('A toy binary system has p=4 significant bits. Enter its spacing on [1,2), then its unit roundoff.',1/8,1/16),['The spacing is 2^(1−p).','Round-to-nearest error is at most half a gap near 1.'],'The spacing is 1/8 and u=1/16.'),
 Q('a2',0,1,'Which fractions terminate?',C('Which number has an exact finite binary expansion?',1,'1/3','5/8','1/10'),['A reduced denominator must be a power of two.','8=2³, but 3 and 10 retain odd factors.'],'5/8=0.101₂ is exact.'),
 Q('a3',0,2,'Round by hand',N('With p=4 and rounding to nearest, round 1.2. Enter the rounded value, absolute error, and relative error.',1.25,0.05,1/24),['Adjacent candidates are 1.125 and 1.25.','Divide the absolute error by 1.2.'],'1.25 is nearer; the errors are 0.05 and 1/24.'),
 Q('a4',0,3,'The midpoint rule',[
 N('With p=4 and ties to even, round 1.0625, then round 1.1875.',1,1.25),
 C('Why do the two midpoints round in different directions?',2,'All ties round upward.','The first is negative.','The retained significand with an even last bit wins in each case.')
 ],['The lower/upper candidates are 1 and 1.125, then 1.125 and 1.25.','Their significand integers are 8,9 and 9,10.'],'The even integers are 8 and 10, giving 1 and 1.25.'),
 Q('a5',0,3,'Read the arithmetic model',[
 C('The usual relative model fl(a/b)=(a/b)(1+δ), |δ|≤u requires…',0,'a nonzero divisor and avoidance of overflow or problematic underflow.','all inputs to be integers.','one identical δ for every operation.'),
 C('A general absolute bound for addition is…',1,S`$u\min(|a|,|b|)$.`,S`$u|a+b|\le2u\max(|a|,|b|)$.`,'zero, because addition is always exact.')
 ],['The relative model has a normal-range assumption.','Use the triangle inequality.'],'The model excludes exceptional ranges; |a+b|≤|a|+|b|≤2 max(|a|,|b|).'),
 Q('a6',0,4,'Explain the square-root experiment',[
 C('Why can (sqrt(2)²−2)×10¹⁵ be nonzero on a computer?',1,'The real identity is false.','Stored sqrt(2) and the square are rounded before cancellation.','Multiplication by zero changes the sign.'),
 C('Which error should be reported against the exact answer zero?',0,'Absolute error.','Relative error divided by zero.','Only a condition number of a matrix.')
 ],['Separate each computed operation.','The exact output is zero.'],'Rounding precedes the subtraction; scaling exposes it. Relative error against zero is undefined.'),
 Q('a7',0,4,'Prove stagnation can persist',[
 C('Suppose a positive term is strictly below half the spacing at a stored sum. What happens under rounding to nearest?',2,'The exponent must decrease.','The sum becomes infinite.','Adding the term rounds back to the same sum.'),
 C('Why do subsequent terms of a naively ordered harmonic sum then also fail to change it?',1,'All later terms are zero mathematically.','They are smaller while the stored sum and its spacing stay unchanged.','The exact harmonic series converges.')
 ],['Locate the exact result between the sum and its rounding midpoint.','The terms 1/n decrease.'],'Every later term stays within the same rounding interval. This finite-arithmetic stagnation does not imply mathematical convergence.'),
 Q('a8',0,5,'Audit an error claim',[
 C('A report treats ε=(mn)u as small even when mn≈1/u. What is wrong?',0,'Then ε is order one, so the small-error premise fails.','Dimension factors never matter.','It proves all norms are equal.'),
 C('A subtraction is exact on stored operands. Can its result still be inaccurate relative to the true intended difference?',2,'No, exact subtraction erases input errors.','Only for integers.','Yes; cancellation can expose earlier input errors.')
 ],['Evaluate mn×u.','Distinguish exact stored inputs from the intended inputs.'],'The perturbation shorthand requires dimension factors times u to be small. Exact arithmetic on rounded data can still have large relative output error.'),
 Q('b1',1,1,'Assign the property',C('Which statement uses the terminology correctly?',2,'This algorithm is ill-conditioned.','This problem is backward stable.','This problem is ill-conditioned and this algorithm is backward stable.'),['Conditioning describes the map.','Stability describes the procedure.'],'Sensitivity belongs to the problem; rounding behaviour belongs to the algorithm.'),
 Q('b2',1,1,'Absolute sensitivity',N('For f(x)=x² at x=3, enter the absolute and relative condition numbers.',6,2),['The derivative is 2x.','Multiply its magnitude by |x|/|f(x)|.'],'κabs=6 and κrel=6×3/9=2.'),
 Q('b3',1,2,'A small output changes the scale',N('For f(x)=x−1 at x=1.01, enter κabs and κrel.',1,101),['The derivative is 1.','Divide 1.01 by 0.01.'],'κabs=1 and κrel=101.'),
 Q('b4',1,3,'Construct a backward explanation',N('For f(x)=x², x=2 and output 4.0401, use the nearby positive input. Enter that input, the relative backward error, and the relative forward error.',2.01,0.005,0.010025),['The positive square root is 2.01.','Divide the input change by 2 and output change by 4.'],'(2.01)²=4.0401, η=0.01/2 and the forward error is 0.0401/4.'),
 Q('b5',1,3,'Use the local estimate',N('A problem has relative condition number 200 and relative backward error 0.0001. Enter the first-order relative forward-error estimate, then express it as a percentage.',0.02,2),['Multiply the two values.','Multiply a relative fraction by 100 to get percent.'],'The estimate is 0.02, or 2%. It is local, not a guaranteed finite bound.'),
 Q('b6',1,4,'Derive the accuracy principle',[
 C('Which identity starts the backward-stability argument?',0,S`$\widehat y=f(x+\Delta x)$.`,S`$\widehat y=x$.`,S`$f(x+\Delta x)=f(x)$ for every input.`),
 C('Which inequality uses conditioning?',2,S`$\|\widehat y-f(x)\|=0$.`,S`$\|\Delta x\|\le\|f(x)\|$ alone.`,S`$\|f(x+\Delta x)-f(x)\|\lesssim\kappa_{\rm abs}\|\Delta x\|$.`),
 C('Why is this generally a local argument?',1,'Every function is linear.','The condition number describes infinitesimal perturbations.','Backward error is always exactly zero.')
 ],['Replace the computed output by its nearby-input expression.','Apply the definition of local sensitivity.'],'Substitution followed by the sensitivity bound gives forward error ≲κabs‖Δx‖. Finite changes need further control.'),
 Q('b7',1,4,'Distinguish stability notions',[
 C('Forward stability in this chapter means relative error of order…',1,'u regardless of conditioning.','κrel u.','1/u.'),
 C('Mixed stability permits…',0,'a small output change to make the result exact for a slightly changed input.','an arbitrary output for the exact input.','a large input change with no bound.')
 ],['Use the best scale expected from backward stability.','Mixed permits perturbations on both sides.'],'The condition-aware forward scale is κrel u. Mixed stability is ŷ+Δy=f(x+Δx) with both changes small.'),
 Q('b8',1,5,'Challenge two conclusions',[
 C('Does a small backward error prove the answer is closer to an unknown true measured answer?',2,'Yes, always.','Yes, if data are decimal.','No; it shows consistency with nearby data, not closeness to an unknown truth.'),
 C('One run has small forward error. Has the algorithm been proved backward stable?',0,'No; a uniform nearby-input statement is still needed.','Yes; one example covers all inputs.','Yes; forward and backward errors are identical.')
 ],['A perturbation can point toward or away from the true input.','Definitions quantify over admissible inputs.'],'Backward stability controls added uncertainty. A single good answer is not a general stability proof.'),
 Q('c1',2,1,'Read singular values',N('A full-rank matrix has singular values 12,3,0.5. Enter κ₂.',24),['Use largest divided by smallest.','12 divided by 0.5 is twice 12.'],'κ₂=24.'),
 Q('c2',2,1,'Scaling and orthogonality',N('For A=7Q with square orthogonal Q, enter ‖A‖₂, ‖A⁻¹‖₂ and κ₂(A).',7,1/7,1),['All singular values of Q are 1.','Scaling multiplies every singular value by the same positive magnitude.'],'The values are 7,1/7,1.'),
 Q('c3',2,2,'Evaluate the finite bound',N('Take κ₂(A)=20 and ε=0.01. Enter t=εκ₂(A), then t/(1−t).',0.2,0.25),['Multiply first.','The denominator is 0.8.'],'t=0.2 and the bound is 0.25.'),
 Q('c4',2,3,'Find the explanatory perturbation',[
 N('A=I₂, b=(1,1)ᵀ, and x̂=(1,0)ᵀ. Enter r=b−Ax̂, then the four row-major entries of ΔA=r x̂ᵀ/‖x̂‖².',0,1,0,0,1,0),
 N('Enter the matrix-only relative spectral backward error ηA.',1)
 ],['The residual is the missing second component.','The candidate perturbation maps (1,0) to (0,1).'],'r=(0,1), ΔA=[[0,0],[1,0]], and ηA=1/(1×1)=1.'),
 Q('c5',2,3,'Explain a large forward error',[
 N('For A=U diag(1,10⁻¹⁵) with orthogonal U and ε=10⁻¹⁶, enter εκ₂(A).',0.1),
 C('An error of a few percent in one solution component…',1,'alone proves the solver unstable.','can be compatible with small backward error because the system is sensitive.','proves the exact solution does not exist.')
 ],['Orthogonal multiplication preserves singular values.','Compare κ times the rounding scale.'],'The product is 0.1; a visible forward error is compatible with this ill-conditioning.'),
 Q('c6',2,4,'Complete the Neumann proof',[
 C('With E=A⁻¹ΔA, which factorisation has the correct order?',2,'A+ΔA=(I+E)A always.','A+ΔA=A+E.','A+ΔA=A(I+E).'),
 C('Which identity follows for x̂−x?',0,'−(I+E)⁻¹Ex','Ex without higher-order terms','(I−E)⁻¹x'),
 C('Which hypothesis justifies the inverse bound?',1,'‖E‖≥1','‖E‖<1','E has positive entries')
 ],['Multiply A(I+A⁻¹ΔA).','Use (I+E)x̂=x, then subtract x.'],'A(I+E)=A+ΔA and x̂−x=−(I+E)⁻¹Ex. The Neumann bound needs ‖E‖<1.'),
 Q('c7',2,4,'Prove minimal backward error',[
 C('Why must every explanatory perturbation satisfy ‖ΔA‖₂≥‖r‖₂/‖x̂‖₂?',1,'Because all matrices have rank one.','Because ΔAx̂=r and the operator norm bounds that product.','Because the residual is always zero.'),
 C('Why does r x̂ᵀ/‖x̂‖₂² attain the bound?',0,'Its action gives r and its rank-one norm is ‖r‖₂/‖x̂‖₂.','Its norm is always zero.','It preserves every prescribed matrix structure.')
 ],['Apply ‖ΔAx̂‖≤‖ΔA‖‖x̂‖.','Use the norm of an outer product.'],'The operator inequality is a lower bound and the displayed rank-one matrix attains it. It is an unstructured result.'),
 Q('c8',2,5,'Values, vectors and qualifications',[
 C('Weyl bounds eigenvalue errors of symmetric matrices by ‖E‖₂. This is…',2,'a relative bound for every tiny eigenvalue.','an eigenvector-angle bound without a gap.','an absolute bound; tiny eigenvalues may have large relative errors.'),
 C('Why can eigenvectors at the identity be sensitive?',0,'Its repeated eigenvalue has no separating gap and no distinguished eigenbasis.','Its matrix condition number is infinite.','It is nonsymmetric.'),
 C('If εκ₂(A)≥1, what does the finite perturbation theorem say?',1,'Every solution must be wrong.','This bound is inapplicable; actual error needs other information.','The same denominator gives a valid negative error bound.')
 ],['Check which quantity appears in the denominator of a relative error.','The theorem requires t<1.'],'Absolute value sensitivity differs from vector sensitivity and relative accuracy. Losing a theorem hypothesis removes its guarantee, not the existence of every good outcome.'),
 Q('d1',3,1,'Interpret triangular stability',C('Backward stability of substitution means…',1,'x̂=x for every triangular matrix.','(R+ΔR)x̂=b with small relative perturbations in R.','R must have condition number one.'),['It is an exact solve for a nearby input.','Accuracy still depends on conditioning.'],'The nearby triangular system explains the computed answer.'),
 Q('d2',3,1,'Componentwise zeros',C('The bound |ΔR|≤γn|R| implies that if rij=0 then…',0,'Δrij=0.','Δrij=1.','no bound exists on Δrij.'),['Apply the bound to that entry.','Its right-hand side is zero.'],'The componentwise statement preserves zeros.'),
 Q('d3',3,2,'Compute a growth example',N('Factor A=[[0.01,1],[1,1]] without pivoting. Enter l₂₁ and u₂₂.',100,-99),['Divide the lower entry by the pivot.','Subtract 100 times the first row.'],'l₂₁=100 and u₂₂=1−100=−99.'),
 Q('d4',3,3,'Exponential growth',[
 N('For the n=6 partial-pivoting growth example, enter the final-column entries of U in order.',1,2,4,8,16,32),
 C('Does this growth force a large measured rounding error in every run?',2,'Yes; every power of two rounds badly.','Yes; all inputs become singular.','No; it makes the error bound large, and this particular arithmetic may be exact.')
 ],['Each stage doubles the active final-column entries.','Powers of two and these integer additions can be represented exactly.'],'The entries are 1,2,4,8,16,32. Growth creates vulnerability rather than proving that a particular run is inaccurate.'),
 Q('d5',3,3,'The Cholesky scale',N('An SPD matrix has ‖A‖₂=81 and exact A=RᵀR. Enter ‖R‖₂ and the resulting common upper bound on |rij|.',9,9),['The norm of RᵀR is ‖R‖₂².','An entry cannot exceed the operator norm.'],'Both values are 9.'),
 Q('d6',3,4,'Compose the LU errors',[
 C('If L̂Û=PA+F, which terms appear after the two triangular perturbations are composed?',0,'F+ΔL Û+L̂ ΔU+ΔL ΔU','F only','ΔL+ΔU only'),
 C('What additional scale control makes the complete solve backward stable?',2,'‖L̂‖‖Û‖ is arbitrarily large.','Only that det(A) is nonzero.','‖L̂‖‖Û‖=O(‖A‖).'),
 C('How is the perturbation returned from the permuted equations to the original equations?',1,'Multiply by P again regardless of its inverse.','Multiply by Pᵀ; its orthogonality preserves the spectral norm.','Delete F.')
 ],['Expand (L̂+ΔL)(Û+ΔU).','The bound must be small relative to A, not just the factors.'],'The expansion produces all four terms. Factor-norm control and multiplication by Pᵀ give a small original-matrix perturbation.'),
 Q('d7',3,4,'Justify Cholesky and qualify it',[
 C('Why is there no unbounded factor-growth issue in exact Cholesky?',1,'Every SPD matrix is diagonal.','‖R‖₂²=‖A‖₂.','All entries of R are less than 1 regardless of scale.'),
 C('Can a nearly singular exactly SPD matrix lose a positive pivot after rounding?',0,'Yes; numerical completion needs qualification.','No; real-arithmetic existence makes input rounding impossible.','Only when A is skew-symmetric.')
 ],['Compare the factor norm directly with the input norm.','A tiny positive eigenvalue can be overwhelmed by small perturbations.'],'The factor is controlled, but sufficiently ill-conditioned data can lose numerical positive definiteness. Successful Cholesky has the backward guarantee.'),
 Q('d8',3,5,'Choose conclusions supported by evidence',[
 C('Partial pivoting works reliably on many practical inputs. What follows?',2,'It has a small growth factor for every input.','No further analysis is needed.','Its practical success does not remove exponential worst cases.'),
 C('A triangular matrix has a huge condition number but one solve is exact. Is this contradictory?',1,'Yes; κ predicts equality in the error.','No; a worst-case bound need not be attained by this data.','Yes; triangular substitution is never exact.')
 ],['Separate typical observations from universal claims.','Bounds describe possible error, not a compulsory error.'],'Both statements can coexist with worst-case theory. Direction, representability and structure affect actual results.'),
 Q('e1',4,1,'Explain a dot product',C('A backward interpretation of a computed dot product can be…',0,'(y+Δy)ᵀx with small componentwise Δy.','yᵀx plus no error in every case.','A different dimension for x.'),['Perturb the coefficients of the weighted sum.','Only one input needs to change.'],'Each product coefficient can absorb its small accumulated rounding factor.'),
 Q('e2',4,1,'Collect row perturbations',C('Why do backward explanations for row dot products form a matrix–vector explanation?',2,'Every row must have the same perturbation.','x changes separately for every row.','Each row of A can carry its own small perturbation in one matrix ΔA.'),['Keep x fixed.','Different rows occupy distinct locations in ΔA.'],'The row changes assemble into one nearby matrix.'),
 Q('e3',4,2,'Compute the rank obstruction',N('For C=[[1,17/16],[17/16,9/8]], enter its determinant and rank.',-1/256,2),['The determinant is 9/8−289/256.','A nonzero determinant gives full rank.'],'det(C)=−1/256, so rank(C)=2.'),
 Q('e4',4,3,'Prove backward interpretation is impossible',[
 C('What is the largest rank of a product of a 2×1 matrix and a 1×2 matrix?',0,'1','2','4'),
 C('Can arbitrary perturbations to those same-shaped factors produce the rank-two C above?',1,'Yes, if the perturbations are large enough.','No; the rank bound survives every such perturbation.','Yes, because each entry can be chosen independently.')
 ],['The product has a one-dimensional intermediate space.','Every column is a multiple of the same column vector.'],'Every such outer product has rank at most one. No same-shaped perturbed factors explain C exactly.'),
 Q('e5',4,3,'Turn a forward error into a backward error',N('Q=[[0,−1],[1,0]], B=(2,3)ᵀ, and computed QB has additive error E=(0.01,−0.02)ᵀ. Enter ΔB=QᵀE.',-0.02,-0.01),['Qᵀ=[[0,1],[−1,0]].','Multiply it by E.'],'ΔB=(−0.02,−0.01), and QΔB=E.'),
 Q('e6',4,4,'Derive the relative product bound',[
 C('For invertible square A, which identity bounds ‖B‖₂?',1,'B=A(AB)','B=A⁻¹(AB)','B=(AB)A⁻¹ always'),
 C('If A and B are both square and invertible, the ratio ‖A‖₂‖B‖₂/‖AB‖₂ is bounded by…',2,'zero','κ₂(A)+κ₂(B) only, with no sharper bound','min(κ₂(A),κ₂(B))'),
 C('May the same proof use ordinary inverses of arbitrary rectangular factors?',0,'No; its invertibility assumptions must be retained.','Yes, every matrix has an ordinary inverse.','Only if the product is zero.')
 ],['Cancel A on the left.','Repeat the argument using A=(AB)B⁻¹.'],'The left and right inverse identities give two bounds; take their minimum when both apply.'),
 Q('e7',4,4,'One inverse, many perturbations',[
 C('Which equation describes a backward-stable solve of Axᵢ=eᵢ?',2,'(A+ΔAᵢ)⁻¹x̂ᵢ=eᵢ','A⁻¹eᵢ=0','(A+ΔAᵢ)x̂ᵢ=eᵢ'),
 C('For invertible X̂ and F=I−AX̂, the only common explanatory ΔA is…',0,'FX̂⁻¹','X̂⁻¹F always','F alone'),
 C('Does small error for each separate solve automatically bound this common ΔA by O(u‖A‖)?',1,'Yes, columns force all perturbations identical.','No; the combined perturbation needs its own bound.','Yes, because all inverses are orthogonal.')
 ],['Write the perturbed system before taking inverses.','Solve ΔAX̂=F for ΔA.'],'The system equation is (A+ΔAᵢ)x̂ᵢ=eᵢ. A common inverse perturbation would be FX̂⁻¹, whose scale is not guaranteed by separate statements.'),
 Q('e8',4,5,'Audit an algorithmic slogan',[
 C('Which statement about orthogonality is justified?',1,'Every program mentioning Q is stable.','Orthogonal transformations preserve error norms and are a useful basis for stable algorithms.','A matrix condition number above one makes every solver unstable.'),
 C('For fl(AQ)=AQ+E with square orthogonal Q, which perturbation works?',2,'ΔA=QᵀE always','ΔA=E without multiplication','ΔA=EQᵀ')
 ],['A mechanism supporting stability is not a substitute for analysis.','Check ΔAQ=E.'],'Orthogonality controls error amplification; ΔA=EQᵀ provides the right-product backward explanation.'),
 Q('f1',5,1,'Two QR diagnostics',C('To assess computed QR, inspect…',2,'only whether R is triangular.','only ‖A−Q̂R̂‖.','both reconstruction error and ‖Q̂ᵀQ̂−I‖.'),['QR has an orthogonality requirement.','A nonorthogonal factor may reconstruct A exactly.'],'Both defining properties must survive.'),
 Q('f2',5,1,'A deceptive reconstruction',N('Q=diag(2,1/2), R=diag(1/2,2). Enter the two diagonal entries of QR and then of QᵀQ−I.',1,1,3,-0.75),['Multiply diagonal entries.','Square Q entries and subtract 1.'],'QR=I but QᵀQ−I=diag(3,−3/4).'),
 Q('f3',5,2,'Predict error scales',N('Using the schematic CGS and MGS bounds with u=10⁻⁸ and κ=10³, enter uκ² and uκ.',0.01,0.00001),['Square κ only for classical Gram–Schmidt.','These are estimates, not measured equalities.'],'The scales are 0.01 and 0.00001.'),
 Q('f4',5,3,'Expand two rounded reflectors',[
 C('If B̂₁=H₁A+E₁ and B̂₂=H₂B̂₁+E₂, which total error appears?',0,'H₂E₁+E₂','H₁E₂+E₁','E₁E₂ only'),
 N('If ‖E₁‖≤0.002 and ‖E₂‖≤0.003 and H₂ is orthogonal, enter the triangle-inequality error bound.',0.005)
 ],['Substitute the first equation into the second.','Orthogonal multiplication preserves ‖E₁‖.'],'The accumulated error is H₂E₁+E₂, bounded by 0.005.'),
 Q('f5',5,3,'Update the factor after reorthogonalisation',N('If R₁=[[2,1],[0,3]] and R₂=[[1,0.5],[0,2]], enter the four row-major entries of the updated R=R₂R₁.',2,2.5,0,6),['Multiply in the stated order.','The new upper-right entry is 1+0.5×3.'],'R₂R₁=[[2,2.5],[0,6]].'),
 Q('f6',5,4,'Complete the Householder argument',[
 C('Why are the transported local errors not magnified by the remaining exact reflectors?',1,'All local errors are zero.','Their products are orthogonal and preserve norms.','Every error matrix is diagonal.'),
 C('If Q̂=Q*+EQ and Q* is orthogonal, which first-order terms form Q̂ᵀQ̂−I?',0,'Q*ᵀEQ+EQᵀQ*','EQ only','Q*ᵀQ*+I'),
 C('What must a full proof additionally control?',2,'Only the labels on the matrices.','Nothing; nominal formulas are enough.','Rounding in constructing the reflectors as well as applying them.')
 ],['Expand the product in order.','Retain the linear terms and recognise the quadratic remainder.'],'Norm preservation bounds accumulation; expanding Q̂ᵀQ̂ gives the stated linear terms plus EQᵀEQ. Reflector construction also requires analysis.'),
 Q('f7',5,4,'Compare Gram–Schmidt variants',[
 C('Which coefficients distinguish MGS from CGS?',2,'MGS uses no projections.','MGS always uses the untouched original aⱼ.','MGS projects the current updated remainder.'),
 C('Why may twice-applied Gram–Schmidt fail to rescue a lost direction?',0,'If the first pass destroys numerical independence, the missing information is unavailable.','The second pass necessarily increases rank.','Every first pass is already exact.'),
 C('Why can small reconstruction coexist with poor orthogonality?',1,'All triangular matrices are orthogonal.','Accurate multiplication Q̂R̂≈A does not force Q̂ᵀQ̂≈I.','Reconstruction is not a matrix operation.')
 ],['Look at the vector inside each projection coefficient.','Check the two QR requirements separately.'],'MGS updates before each projection. Reorthogonalisation needs a sufficiently independent first basis; reconstruction alone is insufficient.'),
 Q('f8',5,5,'Factor accuracy and near orthogonality',[
 C('Does a backward-stable QR guarantee tiny errors in each particular exact factor of a nearly dependent input?',1,'Yes, regardless of conditioning and signs.','No; factor sensitivity and sign conventions still matter.','Only R can ever be sensitive.'),
 C('For full-column-rank Q̂ with small orthogonality defect, which correction is exactly orthonormal?',2,'2Q̂',S`$\widehat Q(\widehat Q^T\widehat Q)$`,S`$\widehat Q(\widehat Q^T\widehat Q)^{-1/2}$`),
 C('Can square-system forward-error estimates be transferred unchanged to every least-squares problem?',0,'No; least-squares sensitivity also involves residual geometry.','Yes, residual geometry is irrelevant.','Yes, all least-squares matrices are square.')
 ],['Backward error concerns a nearby input.','Use the symmetric positive-definite inverse square root of the Gram matrix.'],'The polar correction makes columns exactly orthonormal. Factorwise forward accuracy and least-squares sensitivity require their own conditioning analysis.'),
 Q('am1',0,5,'A fresh binary spacing',N('For p=5, enter the spacing in [1,2) and then in [8,16).',1/16,0.5),['Spacing scales with the exponent.','Multiply 1/16 by 8.'],'The spacings are 1/16 and 1/2.',true),
 Q('am2',0,5,'Cancellation without a bad subtraction',C('Why can an exactly executed subtraction of stored numbers have large relative error?',0,'Its operands may already contain errors large relative to the intended small difference.','Exact subtraction necessarily overflows.','It cannot; input storage is always exact.'),['Think about where the input values came from.','Compare inherited error with the small true remainder.'],'Inherited input errors can dominate a small difference.',true),
 Q('am3',0,5,'Machine epsilon convention',C('For binary64 rounded to nearest, the gap above one equals…',2,'u/2','u','2u'),['The precision is 53 significant bits.','The gap is 2⁻⁵² and u is 2⁻⁵³.'],'The gap is twice the unit roundoff.',true),
 Q('bm1',1,5,'A fresh sensitivity calculation',N('For f(x)=x³ at x=2, enter absolute and relative condition numbers.',12,3),['f′(x)=3x².','Multiply 12 by 2/8.'],'κabs=12 and κrel=3.',true),
 Q('bm2',1,5,'A backward explanation',N('For f(x)=3x, x=4 and computed output 12.06, enter the nearby input and relative backward error.',4.02,0.005),['Divide the output by 3.','Then divide its distance from 4 by 4.'],'The nearby input is 4.02 and η=0.005.',true),
 Q('bm3',1,5,'What stability promises',C('A backward-stable method applied to a very ill-conditioned problem guarantees…',1,'full relative precision in the true output.','a small nearby-input explanation under its assumptions.','that the original input was measured exactly.'),['Recall the definition rather than the accuracy heuristic.','Conditioning can amplify small perturbations.'],'The guarantee is about backward error.',true),
 Q('cm1',2,5,'A fresh finite bound',N('If ε=0.001 and κ₂(A)=100, enter t and the finite relative bound.',0.1,1/9),['t=εκ.','Use t/(1−t).'],'t=0.1 and the bound is 1/9.',true),
 Q('cm2',2,5,'Residual scale',N('If ‖r‖₂=0.03, ‖A‖₂=5 and ‖x̂‖₂=2, enter the unstructured matrix-only relative backward error.',0.003),['Divide the residual by the product of the two norms.','The denominator is 10.'],'ηA=0.003.',true),
 Q('cm3',2,5,'Tiny spectral values',C('A singular value is much smaller than u‖A‖₂. A backward-stable computation generally guarantees…',0,'an absolute error on the u‖A‖₂ scale, not full relative precision for that value.','relative error u for every singular value.','uniquely determined singular vectors even at multiplicity.'),['Use Weyl in absolute form.','Divide by a tiny value to see the relative issue.'],'Backward stability gives norm-scaled absolute accuracy; relative accuracy may be poor.',true),
 Q('dm1',3,5,'A new growth size',N('For the tie-preserving partial-pivoting growth family with n=8, enter the largest U entry and growth factor.',128,128),['Both are 2^(n−1) because the original maximum entry is 1.','2⁷=128.'],'Both values are 128.',true),
 Q('dm2',3,5,'The factor scale',C('An LU rounding bound proportional to u‖L̂‖‖Û‖ proves small relative backward error when…',1,'A has a large determinant alone.','the product of factor norms is controlled relative to ‖A‖.','the factors have arbitrarily large norms.'),['The final reference scale is A.','Compare the bound after division by ‖A‖.'],'Control of the factor product gives the required scaling.',true),
 Q('dm3',3,5,'Cholesky entries',N('If A=RᵀR is SPD and ‖A‖₂=36, enter the spectral norm of R.',6),['Square the factor norm.','Take the positive square root.'],'‖R‖₂=6.',true),
 Q('em1',4,5,'Right orthogonal multiplication',C('If Ĉ=AQ+E and Q is square orthogonal, which equality gives a backward explanation?',2,'Ĉ=(A+QᵀE)Q always','Ĉ=A(Q+E) always','Ĉ=(A+EQᵀ)Q'),['The added factor must multiply Q to give E.','Use QᵀQ=I.'],'(EQᵀ)Q=E.',true),
 Q('em2',4,5,'A product-error estimate',N('For square invertible factors with κ₂(A)=8, κ₂(B)=3 and ε=0.002, enter the relative forward-error bound ε min(κ₂(A),κ₂(B)).',0.006),['Choose the smaller condition number.','Multiply by 0.002.'],'The bound is 0.006.',true),
 Q('em3',4,5,'The shared-input issue',C('Separate backward-stable matrix–vector products AB[:,j] establish backward stability of the whole product only if…',0,'suitable common small perturbations to the factors can also be proved.','each column is given an unrelated input matrix with no further argument.','the columns are merely displayed side by side.'),['The original task has one A and one B.','Column-specific errors need not combine as desired.'],'The whole output needs one pair of nearby factors.',true),
 Q('fm1',5,5,'Transporting an error',N('For square orthogonal H and ‖E‖F=0.012, enter ‖HE‖F.',0.012),['The Frobenius norm is orthogonally invariant.','No amplification occurs.'],'The norm remains 0.012.',true),
 Q('fm2',5,5,'A second factor update',N('If R₁=diag(3,4) and R₂=diag(2,0.5), enter the diagonal of R₂R₁.',6,2),['Multiply corresponding diagonal entries.','Use the updated factor, not the old one.'],'The new diagonal is (6,2).',true),
 Q('fm3',5,5,'Reconstruction is not enough',C('A computed factor pair has tiny residual but Q̂ᵀQ̂ far from I. It is…',1,'a verified stable QR factorisation.','not established as a valid accurate QR factorisation by that residual alone.','proof that A has no QR factorisation.'),['QR includes an orthonormality condition.','One diagnostic cannot replace the other.'],'The orthogonality requirement has not been met.',true)
];
