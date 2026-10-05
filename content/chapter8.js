const N=(prompt,...answer)=>({type:'numeric',prompt,answer});
const C=(prompt,answer,...options)=>({type:'choice',prompt,answer:String(answer),options:options.map((label,i)=>[String(i),label])});
const ids=['qralg-iteration','qralg-shifts','qralg-hessenberg','qralg-deflation','qralg-refinements'];
export const chapter8Lessons=[
 ['QR iteration and accumulated bases','QR iteration','Reverse QR factors to reveal the spectrum through changing orthogonal coordinates.','35–45 min',['Prove similarity of successive QR iterates','Prove both accumulated-factor identities with the correct product order','Connect the leading basis column with power iteration','Distinguish backward stability from convergence and forward accuracy']],
 ['Shifts and rational filtering','Shifts & filters','Accelerate the final Schur direction through an implicit inverse-power effect.','40–50 min',['Derive the last-column inverse-adjoint connection','Prove the shifted polynomial product theorem','Handle complex conjugates and singular shifts correctly','Interpret filter plots and the limitations of trailing-diagonal shifts']],
 ['Hessenberg reduction and cheap QR steps','Hessenberg reduction','Preserve the eigenvalues while making every subsequent iteration cheaper.','35–45 min',['Construct two-sided Householder reduction','Prove earlier zeros survive each stage','Prove the Hessenberg shape survives QR iteration','Use stored rotations to obtain quadratic iteration cost']],
 ['Deflation and convergence in practice','Deflation','Split off resolved eigenvalues and inspect the calculated convergence history.','35–45 min',['Prove the block spectral split','Interpret a deflation tolerance as a backward perturbation','Track active blocks and accumulate a valid full Schur basis','Derive cubic typical cost and read logarithmic convergence plots']],
 ['Double shifts, early deflation and balancing','Further refinements','Understand the additional ideas that make practical QR solvers effective.','30–40 min',['Derive a real polynomial from a conjugate shift pair','Explain the coupling test behind aggressive early deflation','Calculate a diagonal similarity and its norm change','Translate balanced-coordinate perturbations back to the original input']]
].map(([title,short,description,readTime,objectives],i)=>({id:ids[i],chapter:'qr-algorithm',number:String(i+1).padStart(2,'0'),title,short,description,readTime,objectives,lab:ids[i]}));
const Q=(id,section,level,title,task,hints,solution,mastery=false)=>({id:`qra-${id}`,lesson:ids[section],level,title,...(Array.isArray(task)?{type:'multi',prompt:'Complete each part.',parts:task}:task),hints,solution,mastery});
export const chapter8Exercises=[
 Q('a1',0,1,'One QR step',C('If B=QR with square unitary Q, the next unshifted iterate is…',1,'Q+R','RQ','R⁻¹Q'),['The factorisation and the update are different operations.','Reverse the two factors.'],'The update is RQ.'),
 Q('a2',0,1,'Recognise the similarity',C('Which identity proves that reversing QR preserves eigenvalues?',2,'RQ=QBQ*','RQ=B²','RQ=Q*BQ'),['Substitute B=QR.','Use Q*Q=I.'],'Q*BQ=Q*(QR)Q=RQ.'),
 Q('a3',0,2,'A complete numerical step',N('For Q=[[2,−1],[1,2]]/√5 and R=[[5,4],[0,3]]/√5, enter the four row-major entries of RQ.',2.8,0.6,0.6,1.2),['Multiply the numerator matrices first.','Divide every entry by 5.'],'RQ=[[14,3],[3,6]]/5.'),
 Q('a4',0,3,'Check preserved quantities',[
 N('For B=[[14,3],[3,6]]/5, enter its trace and determinant.',4,3),
 N('Enter its two eigenvalues in increasing order.',1,3)
 ],['Trace is the diagonal sum.','Solve z²−4z+3=0.'],'The trace is 4 and determinant 3; eigenvalues are 1 and 3, as for the original matrix.'),
 Q('a5',0,3,'The product orders',[
 C('After three steps, U₃ equals…',0,'Q₁Q₂Q₃','Q₃Q₂Q₁','Q₁+Q₂+Q₃'),
 C('The triangular factor S₃ of A³ equals…',2,'R₁R₂R₃','R₁+R₂+R₃','R₃R₂R₁')
 ],['Accumulate each new basis on the right.','Each new triangular factor multiplies the earlier triangular product on the left.'],'U₃=Q₁Q₂Q₃ and S₃=R₃R₂R₁.'),
 Q('a6',0,4,'Complete the accumulated-power proof',[
 C('From Uₖ₋₁*AUₖ₋₁=QₖRₖ, which equation follows?',1,'AUₖ₋₁=Qₖ alone','AUₖ₋₁=Uₖ₋₁QₖRₖ','A=Rₖ'),
 C('If Aᵏ⁻¹=Uₖ₋₁Sₖ₋₁, which expression gives Aᵏ?',0,'Uₖ₋₁QₖRₖSₖ₋₁','Sₖ₋₁RₖQₖUₖ₋₁','Uₖ₋₁+Sₖ₋₁'),
 C('Why is RₖSₖ₋₁ upper triangular?',2,'It is a sum of orthogonal matrices.','Every product is triangular.','It is a product of upper triangular matrices.')
 ],['Multiply by Uₖ₋₁ on the left.','Substitute into A times the induction hypothesis.'],'The substitution gives Aᵏ=UₖSₖ, with the stated product orders.'),
 Q('a7',0,4,'Explain the power connection',[
 C('Which column equation follows from Aᵏ=UₖSₖ?',2,'Aᵏe₁=Uₖeₙ always','Aᵏe₁=0 always','Aᵏe₁=(Sₖ)₁₁Uₖe₁'),
 C('What conditions support convergence of that direction?',0,'An appropriate eigenbasis, a unique dominant magnitude and a nonzero starting component.','Only that A is square.','Only that all entries are real.'),
 C('If u₁≈v₁ is an eigenvector, the first column of Uₖ*AUₖ approaches…',1,'the all-ones vector','λ₁e₁','the last row of A')
 ],['The first column of an upper triangular matrix has only its first entry.','Apply the same assumptions as in power iteration.'],'The first accumulated column tracks a power direction and makes the first column of the similar iterate nearly triangular.'),
 Q('a8',0,5,'Separate the guarantees',[
 C('Does backward-stable QR arithmetic prove that unshifted iteration converges for every input?',1,'Yes; stability and convergence are identical.','No; convergence also needs spectral and algorithmic assumptions.','Yes; real rotations always become real diagonal.'),
 C('Why is forming A*A not the preferred universal SVD algorithm?',2,'It has unrelated singular values.','It always makes every singular value zero.','It squares conditioning and zero singular values need special handling.'),
 C('For a real matrix with nonreal eigenvalues, a successful real Schur result can contain…',0,'2×2 diagonal blocks.','nonreal entries on a real diagonal.','no eigenvalues.')
 ],['Separate error control from the behaviour of the iteration.','Recall real Schur blocks and the Gram-matrix conditioning issue.'],'Stable computations can still converge slowly or stall. Real blocks are valid, and the SVD benefits from bidiagonalisation rather than an explicit Gram matrix.'),
 Q('b1',1,1,'Restore the shift',C('After B−sI=QR, which update preserves the original eigenvalues?',0,'RQ+sI','RQ−sI','RQ without restoring s'),['The factorised matrix was shifted.','Add that shift back after reversing.'],'Bnew=RQ+sI=Q*BQ.'),
 Q('b2',1,1,'What triangular shape appears?',C('If S is nonsingular upper triangular, S⁻* is…',2,'always upper triangular.','always diagonal.','lower triangular.'),['Inversion preserves the triangular orientation.','Conjugate transposition reverses it.'],'Inverse conjugate transposition gives a lower triangular matrix.'),
 Q('b3',1,2,'Measure a filter ratio',N('For eigenvalues 1 and 3 and shift s=0.9, enter the distance ratio favouring 1 after one shift, then after two identical shifts.',1/21,1/441),['Distances are 0.1 and 2.1.','Multiply the one-step ratio twice.'],'The ratios are 1/21 and 1/441.'),
 Q('b4',1,3,'Conjugate the shift too',[
 N('For λ=2+i and s=1+2i, enter the real and imaginary parts of conjugate(λ)−conjugate(s).',1,1),
 C('In p(A)⁻*=U S⁻*, should U be replaced by its entrywise conjugate?',1,'Yes, in all cases.','No; taking the inverse adjoint gives U itself.','Only when p is monic.')
 ],['Compute (2−i)−(1−2i).','Use U⁻*=U for a unitary matrix.'],'The difference is 1+i. There is no additional conjugation of U.'),
 Q('b5',1,3,'Why the last column?',[
 C('For lower triangular L, Leₙ is…',0,'a scalar multiple of eₙ.','necessarily a multiple of e₁.','the first row of L.'),
 C('Therefore the last accumulated QR column follows inverse iteration on…',2,'A only, never its adjoint.','R only.','A*, selecting a left eigendirection of A.')
 ],['Only the last diagonal entry can occur in the last column of a lower triangular matrix.','Use (A*)⁻ᵏeₙ=UₖSₖ⁻*eₙ.'],'The last column of the lower triangular factor isolates Uₖeₙ, an inverse-power direction for A*.'),
 Q('b6',1,4,'Prove the shifted polynomial identity',[
 C('Why may the newest factor A−sₖI be placed first in pₖ(A)?',1,'All arbitrary matrices commute.','The factors are polynomials in the same A.','Every shift is zero.'),
 C('Which equality follows from the shifted QR step?',2,'(A−sₖI)Uₖ₋₁=0','(A−sₖI)Uₖ₋₁=RₖQₖ','(A−sₖI)Uₖ₋₁=Uₖ₋₁QₖRₖ'),
 C('What completes the induction?',0,'Multiply on the right by Sₖ₋₁ to get UₖSₖ.','Invert A whether singular or not.','Discard every earlier shift.')
 ],['Use the accumulated similarity.','Substitute the preceding polynomial factorisation.'],'Polynomial commutation and the shifted QR equation give pₖ(A)=Uₖ₋₁QₖRₖSₖ₋₁=UₖSₖ.'),
 Q('b7',1,4,'A singular shift is not a singular algorithm',[
 C('If s is exactly an eigenvalue, which operation still exists?',1,'The ordinary inverse of A−sI.','A QR factorisation of A−sI.','Division by every zero pivot.'),
 C('Which argument needs the extra nonsingularity assumption?',0,'The inverse-adjoint filter interpretation.','The polynomial product identity.','The unitary similarity identity.'),
 C('At an exact shift, the reciprocal filter has…',2,'a finite value forced by the plotting limit.','a polynomial zero instead of a pole.','a pole, even if the graph clips it.')
 ],['QR exists for rank-deficient matrices.','An inverse requires more than a factorisation.'],'The actual QR step can proceed; inverse expressions may be undefined. Clipping is a display convention, not mathematics.'),
 Q('b8',1,5,'Challenge a shift rule',[
 C('For [[0,1],[1,0]], the trailing diagonal shift is…',0,'0','1','−1'),
 C('Why can that simple shifted iteration stall?',2,'The matrix has no real eigenvalues.','The matrix has no QR factorisation.','The zero shift leaves tied eigenvalue magnitudes and can reproduce the same iterate.'),
 C('A Wilkinson-type choice uses…',1,'the sum of all matrix entries.','an eigenvalue of the trailing 2×2 block near its final diagonal entry.','an arbitrary reciprocal diagonal entry.')
 ],['Read the bottom-right entry.','The eigenvalues are ±1.'],'The shift is zero; simple diagonal shifts are not a universal cure. Trailing-block eigenvalue estimates provide a more informed choice.'),
 Q('c1',2,1,'Recognise the zero pattern',C('An upper Hessenberg matrix must have hij=0 when…',1,'i<j','i>j+1','i=j'),['One subdiagonal is allowed.','Everything below that is zero.'],'The condition is i>j+1.'),
 Q('c2',2,1,'Count reduction stages',N('How many embedded Householder stages are needed in the standard reduction of a dense 6×6 matrix to Hessenberg form?',4),['No work is needed in the last two columns.','Use n−2 stages.'],'There are 4 stages.'),
 Q('c3',2,2,'Clear a column tail',N('A first column is (1,3,4)ᵀ. An embedded reflector fixes e₁ and maps the tail (3,4) to (5,0). Enter the first column after left multiplication and after the matching right multiplication.',1,5,0,1,5,0),['The first coordinate stays 1.','Right multiplication fixes the first coordinate vector.'],'Both first columns are (1,5,0). The matching right multiplication preserves the new zeros.'),
 Q('c4',2,3,'Embedded support',[
 N('At stage j=3 in a 7×7 reduction, how many leading entries of vⱼ are zero?',3),
 C('Which row positions can that reflector mix?',2,'Rows 1–3 only','Every row regardless of the leading zeros','Rows 4–7')
 ],['Stage j acts below row j.','The leading j coordinates are fixed.'],'The first 3 entries vanish, so the active rows are 4 through 7.'),
 Q('c5',2,3,'Work per iteration',[
 N('How many adjacent Givens rotations triangularise a 9×9 Hessenberg matrix?',8),
 C('Using these stored rotations on both sides makes one QR step…',0,'O(n²).','O(n³) necessarily.','O(1).')
 ],['There is one possible subdiagonal entry per first n−1 columns.','Each rotation updates O(n) entries.'],'Eight rotations suffice; O(n) rotations with O(n) work each give O(n²).'),
 Q('c6',2,4,'Prove earlier zeros survive',[
 C('Why does left multiplication at stage j preserve the already reduced earlier columns?',2,'It never changes any entries.','All reflectors commute.','Those columns are already zero in the active rows.'),
 C('Why does right multiplication preserve columns 1,…,j?',1,'Every row has zero norm.','The embedded reflector fixes e₁,…,eⱼ.','The right multiplication is omitted.'),
 C('What is the accumulated original-to-Hessenberg basis after F₁,…,Fₖ?',0,'F₁⋯Fₖ','Fₖ⋯F₁ on both sides without transposition','F₁+⋯+Fₖ')
 ],['Inspect the support of the embedded vector.','Track H=VᵀAV.'],'Active rows contain zeros in earlier columns; fixed coordinate vectors preserve the first j columns on the right. V=F₁⋯Fₖ.'),
 Q('c7',2,4,'Prove Hessenberg preservation',[
 C('If R is upper triangular, which indices can contribute to (RQ)ij?',0,'ℓ≥i','Only ℓ<i','All indices with no restriction'),
 C('For i>j+1 and Q upper Hessenberg, why does each allowed contribution vanish?',2,'R is the identity.','Every matrix product is zero.','ℓ≥i>j+1 implies qℓj=0.'),
 C('Does adding a scalar multiple of I alter the Hessenberg zero pattern?',1,'Yes, it fills every lower entry.','No; only diagonal entries change.','Only for negative shifts.')
 ],['Write the summation formula.','Use the two zero patterns together.'],'The supports cannot overlap below the first subdiagonal, so RQ remains Hessenberg and the shift does not change that.'),
 Q('c8',2,5,'Recover the original Schur basis',[
 C('If H=V*AV and T=U*HU, the original Schur basis is…',2,'UV','U alone','VU'),
 C('What would spoil the quadratic step cost?',0,'Forming RQ using a generic dense cubic multiplication instead of local rotations.','Applying stored rotations to pairs of columns.','Keeping the Hessenberg zeros.'),
 C('Is FA alone generally a spectrum-preserving similarity?',1,'Yes, for every reflector F.','No; the matching right transformation is needed.','Only because F has determinant −1.')
 ],['Substitute one similarity into the other.','Distinguish left factorisation steps from a two-sided eigenvalue transformation.'],'T=(VU)*A(VU). Efficient local updates preserve the cost advantage, and eigenvalue preservation requires both sides.'),
 Q('d1',3,1,'Recognise a split',C('An upper Hessenberg matrix has its bottom subdiagonal entry equal to zero. What follows?',1,'The entire last column is zero.','Its spectrum is the union of the leading block spectrum and the bottom diagonal entry.','All eigenvalues are zero.'),['Write the matrix in two diagonal blocks.','The determinant of a block upper triangular matrix factors.'],'The characteristic polynomial factors into that of the leading block and the bottom scalar.'),
 Q('d2',3,1,'Retain the coupling',C('Must the entries above a deflated bottom diagonal entry also vanish?',2,'Yes, by symmetry for every matrix.','Yes, or deflation is impossible.','No; the upper-right coupling can remain nonzero.'),['Deflation creates block upper triangular structure.','Block upper triangular is enough for determinant factorisation.'],'A zero lower-left block is sufficient. The upper-right coupling need not vanish.'),
 Q('d3',3,2,'Apply a relative threshold',N('The two adjacent diagonal magnitudes are 2 and 3, with tolerance 10⁻⁶. In units of 10⁻⁶, enter the threshold and then 1 if a subdiagonal of 3×10⁻⁶ passes, or 0 if it fails.',5,1),['Multiply the tolerance by the sum of the magnitudes.','Compare 3 with 5 in the stated units.'],'The threshold is 5×10⁻⁶, so 3×10⁻⁶ passes.'),
 Q('d4',3,3,'Quantify the perturbation',[
 N('Zeroing just h₄₃=−0.002 changes the matrix by what spectral norm?',0.002),
 C('Why does this give a backward-error interpretation?',0,'The split is exact for the nearby matrix with that entry removed.','Every eigenvalue must change by exactly 0.002.','The original matrix already has that entry zero.')
 ],['The change is a single-entry rank-one matrix.','Its only nonzero singular value is the entry magnitude.'],'The perturbation is 0.002 e₄e₃ᵀ, of norm 0.002. Its eigenvalue effect may be larger for a sensitive matrix.'),
 Q('d5',3,3,'Count decreasing active sizes',N('Suppose each active size m=2,3,4,5 takes three steps, each costing m² units. Enter the total units.',162),['Sum the squares 4+9+16+25.','Multiply by three.'],'3(4+9+16+25)=162. Summing quadratic work over decreasing active sizes is cubic overall.'),
 Q('d6',3,4,'Update the whole similarity',[
 C('With H=[B C;0 T] and an active basis Q, the embedded similarity changes C into…',2,'CQ','C unchanged in every case','Q*C'),
 C('Why keep this update when tracking a complete Schur factorisation?',1,'It changes the eigenvalues deliberately.','It preserves the similarity of the full matrix.','It is needed only to calculate the diagonal trace.'),
 C('How does the accumulated basis change?',0,'U ← U diag(Q,I)','U ← diag(Q,I)U always','U ← U+Q')
 ],['Multiply diag(Q*,I) H diag(Q,I).','Track which side of the active block touches C.'],'The new matrix is [Q*BQ Q*C;0 T], and the basis is U diag(Q,I).'),
 Q('d7',3,4,'Interpret convergence evidence',[
 C('A computed run reaches its iteration cap with nonzero active subdiagonals. Report…',1,'Successful eigenvalues from every diagonal entry.','An incomplete run and the remaining active block.','An exact diagonalisation.'),
 C('What does “2–4 steps per eigenvalue” describe?',2,'A theorem for every matrix and every shift.','The number of preprocessing reflectors.','Typical practical behaviour, not a universal bound.'),
 C('Why include a scale safeguard when both adjacent diagonal entries vanish?',0,'Their sum alone would give a zero threshold even when the matrix has nonzero scale.','To make every entry pass.','To remove the need for a tolerance.')
 ],['Separate observation from a guarantee.','Inspect the threshold when its diagonal scale is zero.'],'A cap is not convergence; empirical counts are not uniform guarantees. A small global-scale floor makes the local test meaningful near zero diagonals.'),
 Q('d8',3,5,'Deflation and sensitive eigenvalues',[
 C('For a nonnormal matrix, a small deleted subdiagonal guarantees…',2,'A similarly small forward error in every eigenvalue.','Orthogonal eigenvectors.','A small matrix perturbation, with eigenvalue error also depending on sensitivity.'),
 C('An unreduced real 2×2 block has a nonreal conjugate pair. What is a valid real Schur endpoint?',0,'Retain that 2×2 block.','Force its subdiagonal to zero at any cost.','Discard its imaginary parts.'),
 C('A block triangular split in the interior permits…',1,'Replacing all upper-right entries by arbitrary values while claiming the same similarity.','Treating the diagonal blocks as separate eigenvalue problems.','Ignoring one of the diagonal blocks.')
 ],['Use the difference between backward and forward error.','Real Schur form allows 2×2 blocks.'],'Small deflation is backward-small. Conjugate pairs may remain as real 2×2 blocks, and an exact split separates the spectra of the diagonal blocks.'),
 Q('e1',4,1,'Pair conjugate shifts',N('For shifts 2+3i and 2−3i, enter the coefficients of z²+c₁z+c₀: c₁,c₀.',-4,13),['The sum is 4.','The product is 2²+3².'],'(z−2−3i)(z−2+3i)=z²−4z+13.'),
 Q('e2',4,1,'Identify balancing',C('Diagonal balancing uses which similarity?',0,'B=DAD⁻¹ with nonsingular diagonal D','B=DA with no right factor','B=A+D'),['Similarity requires inverse transformations on the two sides.','D must be invertible.'],'DAD⁻¹ preserves the characteristic polynomial.'),
 Q('e3',4,2,'Balance two entries',N('For A=[1,100;0.01,2] and D=diag(0.1,10), enter B=DAD⁻¹ in row-major order.',1,1,1,2),['Each entry becomes dᵢaᵢⱼ/dⱼ.','The diagonal entries stay unchanged.'],'b₁₂=0.1·100/10=1 and b₂₁=10·0.01/0.1=1, giving [1,1;1,2].'),
 Q('e4',4,3,'Cost of the diagonal scaling',[
 N('For D=diag(0.1,10), enter κ₂(D).',100),
 N('For B=[1,1;1,2], enter its squared Frobenius norm.',7)
 ],['The condition number is the largest diagonal magnitude divided by the smallest.','Sum the squares of all four entries.'],'κ₂(D)=10/0.1=100 and ||B||²_F=1+1+1+4=7.'),
 Q('e5',4,3,'Build a real double-shift polynomial',N('For A=diag(1,4) and conjugate shifts 2±i, enter the diagonal entries of A²−4A+5I.',2,5),['Evaluate the scalar polynomial at each diagonal entry.','Compute 1−4+5 and 16−16+5.'],'The diagonal entries are 2 and 5. Conjugate pairing gives real arithmetic.'),
 Q('e6',4,4,'Early deflation is a coupling test',[
 C('A trailing window has been put in Schur form. What determines whether candidate blocks can deflate?',1,'Their diagonal entries happen to be integers.','Their transformed coupling to the remaining active matrix is sufficiently small.','The window always has exactly 100 rows.'),
 C('Why can this finish several eigenvalues earlier?',2,'Every eigenvector becomes a coordinate vector globally.','It changes their exact values to zero.','The local Schur basis can reveal weak couplings before the usual single bottom entry does.'),
 C('How should a reported speed-up of about ten be interpreted?',0,'An example of practical benefit, not a guarantee for every matrix.','An exact complexity reduction from cubic to constant.','A mandatory outcome.')
 ],['A local decomposition is not a global split by itself.','The connection to the rest of the matrix is what must be negligible.'],'Early deflation tests transformed couplings of candidate Schur blocks; suitable reordering can expose several deflations. Window sizes and speed-ups are implementation- and problem-dependent.'),
 Q('e7',4,4,'Transport the backward error',[
 C('If the balanced problem has perturbation E, the corresponding perturbation to A is…',2,'DED⁻¹','E in every basis','D⁻¹ED'),
 C('A norm bound for that perturbation is…',0,'||D⁻¹ED|| ≤ κ(D)||E||','||D⁻¹ED|| = 0','||D⁻¹ED|| ≤ ||E||/κ(D) always'),
 C('What caution follows?',1,'Balancing is always harmful.','A badly conditioned D can magnify the error when measured in the original coordinates.','Smaller balanced norm guarantees smaller original-coordinate error.')
 ],['Undo B=DAD⁻¹.','Apply submultiplicativity to D⁻¹ED.'],'D⁻¹(B+E)D=A+D⁻¹ED. Its error is bounded by κ(D)||E||, so balancing needs judgement.'),
 Q('e8',4,5,'Choose a practical implementation',[
 C('How is a double shift applied in an efficient Hessenberg QR implementation?',0,'Implicitly with local transformations that restore Hessenberg form.','By forming dense A² and multiplying dense factors every step.','By independently deleting the imaginary parts of two eigenvalues.'),
 C('If B=UTU* and B=DAD⁻¹, the corresponding basis for A is…',2,'DU, automatically unitary','U, unchanged','D⁻¹U, generally not unitary'),
 C('Can a real nonnormal problem always finish with a real diagonal matrix?',1,'Yes, because real input implies real eigenvalues.','No; real Schur form can require 2×2 blocks, and nonnormal matrices need not be orthogonally diagonalizable.','Yes, provided enough shifts are used.')
 ],['A polynomial identity explains the method without prescribing dense polynomial formation.','Substitute B=UTU* into A=D⁻¹BD.'],'Implicit double shifts retain the cheap structure. Undoing balancing gives a generally nonunitary similarity basis, and real Schur blocks handle conjugate pairs.'),
 Q('am1',0,5,'A fresh QR step',[
 N('A=[3,1;1,3] has positive-diagonal QR factors Q=[3,−1;1,3]/√10 and R=[10,6;0,8]/√10. Enter RQ in row-major order.',3.6,0.8,0.8,2.4),
 N('Enter its eigenvalues in increasing order.',2,4)
 ],['Multiply the two displayed factors.','The new matrix is similar to A.'],'RQ=[3.6,0.8;0.8,2.4]. Its trace is 6 and determinant 8, so its eigenvalues are 2 and 4.',true),
 Q('am2',0,5,'Complete the induction',[
 C('Assume Aᵏ=UₖSₖ and Bₖ=Uₖ*AUₖ. Then AUₖ equals…',1,'BₖUₖ','UₖBₖ','SₖUₖ'),
 C('Factoring Bₖ=Qₖ₊₁Rₖ₊₁ gives Aᵏ⁺¹ equal to…',2,'UₖSₖQₖ₊₁Rₖ₊₁','Qₖ₊₁UₖSₖRₖ₊₁','UₖQₖ₊₁Rₖ₊₁Sₖ'),
 C('Why does Sₖe₁ have only its first component nonzero?',0,'Sₖ is upper triangular.','Sₖ is lower triangular.','Every Sₖ is diagonal.')
 ],['Move Uₖ across the similarity relation.','Associate the products without reversing their order.'],'AUₖ=UₖBₖ and Aᵏ⁺¹=UₖQₖ₊₁Rₖ₊₁Sₖ. Upper triangularity selects the first column, giving the power-method connection.',true),
 Q('am3',0,5,'Convergence has hypotheses',[
 C('A real orthogonal iteration encounters eigenvalues ±i. The real Schur target may contain…',2,'Only real diagonal entries equal to those eigenvalues.','No remaining nonzero entries.','A real 2×2 block.'),
 C('The first-column power argument needs, for a unique limiting direction,…',0,'A strictly dominant eigenvalue magnitude and a nonzero initial component in that direction.','Only a nonzero trace.','Every eigenvalue to have identical magnitude.'),
 C('What remains true before convergence?',1,'Every iterate is diagonal.','Every exact QR iterate is unitarily similar to A.','Every subdiagonal decreases monotonically.')
 ],['Separate the unconditional similarity from conditional convergence.','Recall the power-method spectral gap.'],'Unitary similarity holds at every step. Directional convergence needs a gap and nonzero projection; conjugate pairs can require a real 2×2 endpoint.',true),
 Q('bm1',1,5,'Design a rational filter',[
 N('Eigenvalues are 2 and 5. For a repeated shift s=1.5, enter the unwanted-to-target inverse-filter ratio after one and three steps, targeting 2.',1/7,1/343),
 C('Why is the closer eigenvalue amplified more strongly?',2,'Its polynomial magnitude is larger.','All shifts amplify all eigenvalues equally.','The reciprocal has a smaller denominator there.')
 ],['Compare distances 0.5 and 3.5.','Raise their ratio to the number of steps.'],'The relative ratio is (0.5/3.5)ᵏ=(1/7)ᵏ. It is 1/7 and 1/343.',true),
 Q('bm2',1,5,'Handle the complex adjoint',[
 C('For p(A)=U S, which factorisation is p(A)⁻*?',0,'U S⁻*','U* S⁻¹','S⁻* U'),
 C('A shift 1+2i becomes which shift in the inverse-adjoint factors?',2,'1+2i','−1−2i','1−2i'),
 C('The last-column iteration selects eigenvectors of…',1,'A in every nonnormal case','A*, corresponding to left eigenvectors of A','S only')
 ],['Invert and adjoint in the correct order.','The adjoint conjugates scalar shifts.'],'(US)⁻*=U S⁻*. Each factor is (A*−conj(s)I)⁻¹, so the selected vectors are left eigenvectors of A.',true),
 Q('bm3',1,5,'A shift is a choice, not a guarantee',[
 N('For the trailing symmetric block [2,1;1,2], enter its two eigenvalues in increasing order.',1,3),
 C('Its two eigenvalues are equally close to the bottom diagonal 2. A Wilkinson rule needs…',1,'To choose the shift 0 automatically.','A tie-breaking convention between 1 and 3.','To declare that the matrix has no eigenvalues.'),
 C('An exact eigenvalue shift makes the shifted matrix singular. Does this prevent a QR factorisation?',2,'Yes, Q cannot be unitary.','Yes, every R diagonal must be nonzero.','No; R may have a zero diagonal, although the inverse-filter formula is then undefined.')
 ],['Solve the 2×2 characteristic equation.','Distinguish QR existence from inverse existence.'],'The eigenvalues are 1 and 3, both distance 1 from 2. A convention resolves the tie. Singular shifted matrices still admit QR.',true),
 Q('cm1',2,5,'Trace the reduction pattern',[
 N('In a 6×6 dense reduction, how many entries below the first subdiagonal are cleared in stages 1,2,3,4 respectively?',4,3,2,1),
 C('After stage 2, why can stage 3 leave columns 1 and 2 intact on the left?',1,'Their first two entries are zero.','Their entries in the active rows 4–6 are already zero.','Stage 3 does no left multiplication.')
 ],['At stage j, clear rows j+2 through n in column j.','Later reflectors act only on tails.'],'The counts are 4,3,2,1. The active tails of earlier columns are zero, so mixing those rows preserves them.',true),
 Q('cm2',2,5,'Prove the cheap shifted step',[
 C('Adjacent rotations triangularise H−sI. How many are needed for n×n H?',2,'n²','n(n−1)/2','At most n−1'),
 C('If Q is upper Hessenberg and R upper triangular, RQ is…',0,'Upper Hessenberg','Necessarily diagonal','Necessarily symmetric'),
 C('Why does the local update cost O(n²)?',1,'It solves n dense eigenvalue problems.','O(n) rotations each touch O(n) entries.','Dense multiplication is always quadratic.')
 ],['There is just one entry to eliminate below each pivot.','Use the zero-pattern product argument.'],'At most n−1 adjacent rotations give Q. The product stays Hessenberg, and applying the rotations to rows and columns costs O(n²).',true),
 Q('cm3',2,5,'Special inputs and basis bookkeeping',[
 C('A column tail is already zero. The reduction should…',0,'Use the identity for that stage.','Divide by its zero norm.','Insert a random reflector.'),
 C('A real symmetric input reduced by orthogonal similarities becomes…',2,'An arbitrary dense nonsymmetric matrix','Strictly upper triangular necessarily','Symmetric tridiagonal'),
 C('Given H=VᵀAV and T=UᵀHU, reconstruct A as…',1,'UVT(UV)ᵀ','VU T (VU)ᵀ','VᵀUᵀTU V')
 ],['A zero tail needs no elimination.','Symmetry plus Hessenberg structure forces the matching upper zeros.'],'Skip zero tails. Symmetry is preserved, giving tridiagonal H, and A=(VU)T(VU)ᵀ.',true),
 Q('dm1',3,5,'A new deflation decision',[
 N('Adjacent diagonal magnitudes are 4 and 6, with tolerance 10⁻⁸. In units of 10⁻⁸, give the threshold, then 1 if a coupling of 12×10⁻⁸ passes, or 0 otherwise.',10,0),
 C('If the coupling were instead 8×10⁻⁸ and were removed, its spectral-norm perturbation would be…',1,'Exactly zero','8×10⁻⁸','The sum of both diagonal magnitudes')
 ],['The scale is 4+6.','A single-entry deletion has norm equal to its magnitude.'],'The threshold is 10×10⁻⁸, so 12×10⁻⁸ fails. Removing an 8×10⁻⁸ entry creates a perturbation of norm 8×10⁻⁸.',true),
 Q('dm2',3,5,'Justify cubic total work',[
 C('A cubic reduction followed by a bounded typical number of quadratic steps at each active size costs…',0,'O(n³) in that model','O(n²) including reduction','O(n⁴) necessarily'),
 N('For two steps per active size m=2,3,4 at m² units per step, enter the iteration work.',58),
 C('What prevents this model from being a universal worst-case convergence theorem?',2,'The Hessenberg structure is never preserved.','The sum of squares is not cubic.','The number of iterations depends on the matrix and shift strategy.')
 ],['Sum m² over active sizes.','Do not treat an empirical iteration count as a uniform bound.'],'2(4+9+16)=58. The sum of squares is cubic, but iteration counts depend on the problem.',true),
 Q('dm3',3,5,'Interpret a numerical run',[
 C('Which is the best whole-factorisation check after deflation?',2,'Only that the trace is unchanged.','Only that displayed entries look small.','A scaled residual ||A−UTU*|| together with orthogonality and convergence checks.'),
 C('A log plot clips entries smaller than 10⁻¹⁶ to the plotting floor. Does a point on the floor prove exact zero?',0,'No; clipping is a display convention.','Yes, always.','Only when the trace is positive.'),
 C('Can shifted and unshifted methods be compared fairly at different stopping tolerances without stating that difference?',1,'Yes, tolerances never affect counts.','No; the tolerance and problem must be stated.','Only if the shifted method wins.')
 ],['A diagonal or a plot is not a complete backward-error check.','Separate arithmetic, stopping rules and display clipping.'],'Check the full residual, orthogonality and completed blocks. A plotting floor is not exact arithmetic, and step comparisons require stated comparable stopping rules.',true),
 Q('em1',4,5,'A different conjugate pair',[
 N('For shifts −1±2i, enter c₁,c₀ in z²+c₁z+c₀.',2,5),
 N('Evaluate that polynomial at λ=3.',20),
 C('Why are its coefficients real?',1,'Imaginary parts are discarded as errors.','The conjugate pair has real sum and real product.','Every complex polynomial is real.')
 ],['The sum is −2 and the product is 5.','Use z²−(sum)z+(product).'],'The polynomial is z²+2z+5; at 3 it is 9+6+5=20. Reality follows from conjugate pairing.',true),
 Q('em2',4,5,'Balancing and error transport',[
 N('For A=[3,16;1,4] and D=diag(1,4), enter DAD⁻¹ in row-major order.',3,4,4,4),
 N('Enter κ₂(D).',4),
 C('A balanced perturbation of norm ε has original-coordinate norm bounded by…',0,'4ε','ε/4','0')
 ],['Scale each entry by dᵢ/dⱼ.','Apply ||D⁻¹ED||≤κ₂(D)||E||.'],'The balanced matrix is [3,4;4,4], κ₂(D)=4, and the transported error is bounded by 4ε.',true),
 Q('em3',4,5,'Assemble the full method',[
 C('Which order is coherent for a general dense real eigenvalue problem?',2,'Delete subdiagonals, then guess eigenvalues.','Form A² densely at every step, never deflate.','Optionally balance, reduce to Hessenberg form, use shifted structured steps and deflation, retain real 2×2 blocks when needed.'),
 C('Aggressive early deflation complements shifts by…',0,'Testing small transformed couplings in a trailing Schur window.','Declaring every small diagonal value zero.','Replacing all eigenvalues by window diagonal entries without a coupling test.'),
 C('Which statement about balancing is justified?',1,'It always improves every eigenvalue condition number.','It can improve scaling, but original-coordinate errors and the conditioning of D must also be considered.','It is an orthogonal transformation for every diagonal D.')
 ],['Combine the structure, shift and stopping ideas.','Keep the qualifications attached to each refinement.'],'The practical pipeline preserves structured similarities, uses coupling-based deflation and treats conjugate pairs in real blocks. Balancing can help, but is not a universal accuracy guarantee.',true)
];
