# Chapter 7 editorial coverage audit

Internal authoring record; excluded from the reader bundle by the existing coverage-* exclusion. All lesson prose is self-contained with no references to source materials.

Scope: every mathematical item in Section 8 of NLA_lecture_notes.pdf, printed pages 45–49, ending immediately before Section 9. Full extracted text read; pages 46 and 48 inspected visually for the Schur block diagram, PageRank illustration and algorithms. The established chapter-writing brief is implemented through the README coverage rule, original explanatory prose, integrated demonstrations/practice/mastery on each separate lesson page, and server-checked account progress.

| Source item | Reader coverage | Automatic practice / demonstration |
| --- | --- | --- |
| §8 contrast Ax=b versus Ax=λx, lack of universal closed form and practical reliability of iterative algorithms | eigen-polynomials §§1,3 | eig-a1,a7 |
| Characteristic polynomial, roots and algebraic multiplicities, complex spectrum | eigen-polynomials §§1–2 | eig-a1–a4 |
| Any polynomial as matrix spectrum; companion coefficient layout; power-vector proof | eigen-polynomials §2, both directions and characteristic determinant | eig-a2–a6,am1,am2; complex companion experiment |
| Infinitely many matrices with prescribed roots | eigen-polynomials §2, similarity-orbit qualification | Companion construction and coefficient changes |
| Abel obstruction; iterative approximate algorithms; SVD square-root link; approximation not inaccuracy | eigen-polynomials §3 with precise arithmetic/radical scope | eig-a7 |
| Footnote 18 polynomial optimisation via derivative companion eigenvalues | eigen-polynomials §4, full quartic example including boundaries | eig-a8,am3 |
| Schur as usual goal, A=UTU*, unitary U and triangular T | eigen-schur §1 | eig-b1,b2 |
| Theorem 8.1 full induction, eigenvector extension, block reduction and product order | eigen-schur §2; explicit blocks replace asterisk diagram | eig-b6 |
| Schur diagonal gives spectrum; T diagonal iff A normal | eigen-schur §§1,3 with proof of normal triangular implies diagonal | eig-b2,b5,b7; normality/coupling demo |
| Unitary structure supports backward stability | eigen-schur §6 | eig-b8 |
| Optional nonnormal diagonalization via Schur/Sylvester equations and nonorthogonal transforms | eigen-schur §6, sensitive/no-diagonalization cases qualified | eig-b5,b8 |
| Real versus complex Schur, 2×2 conjugate-pair blocks and extraction | eigen-schur §5, block eigenvalue formula and rotation example | eig-b4,b8,bm1,bm3; real-block demo mode |
| Schur vectors versus eigenvectors (supporting explanation) | eigen-schur §4 | eig-b3,bm2; first/second-vector residuals |
| §8.2 Algorithm 8.1 random start, multiply, normalise and Rayleigh estimate | eigen-power §1 | eig-c1,c2; actual power iteration controls |
| A^k x0 interpretation; diagonalizable expansion and dominant-component geometric proof; linear rate | eigen-power §§2–3 | eig-c3,c4,c6,cm1 |
| First QR column of A^k converges under mild assumptions | eigen-power §6 | eig-c8 |
| Link to PageRank/Markov chains, QR, Krylov, Lanczos/Arnoldi | eigen-power §6 and eigen-pagerank | Terminology explained inline |
| §8.2.1 optional historical PageRank motivation; importance from dominant vector; adjacency scaling | eigen-pagerank §§1–2, explicit directed column convention | eig-d1,d2; network/transition matrix demo |
| Damped column-stochastic A=αP+(1−α)11ᵀ/n, α in (0,1) | eigen-pagerank §3 | eig-d3,d6,dm1 |
| Power iteration and Euclidean normalisation; approximate ranking suffices in many cases | eigen-pagerank §§4,6, sum versus length normalisation explained | eig-d4,d8; iterations and two starting distributions |
| Nonnegative Perron vector and optional Perron–Frobenius context | eigen-pagerank §3, positive teleportation hypotheses | eig-d6,dm3 |
| Illustrated linked importance network | Original interactive four-node graph with directed links and probability-sized nodes | PageRank demonstration, three network choices including dangling and cycle cases |
| §8.2.2 Algorithm 8.2 inverse shifted step and quotient | eigen-inverse §§1–2 | eig-e1–e4,em2; actual LU shifted solves |
| Shifted eigenvalues and distance-ratio convergence proof | eigen-inverse §§1,3 | eig-e2,e6,em1 |
| Adaptive shifts; optional Rayleigh quotient iteration, quadratic/general and cubic/symmetric residual convergence | eigen-inverse §5 with local assumptions and angle proof sketch | eig-e8,em3; adaptive-shift demo/history |
| O(n³) versus O(n²) cost comparison | eigen-inverse §4, fixed-factor reuse qualification | eig-e7; factorization/solve counts |

The MMSC-only administrative cutoff remark on p.46 is not mathematical teaching content and is omitted from the self-contained reader. Optional/nonexaminable mathematical content is fully retained and labelled.

## Corrections and clarifications

- General eigenvalues have no universal arithmetic/radical formula, not literally no finite symbolic algorithms of any kind. Small/special cases and accurate finite approximations remain possible. The companion impossibility connection is retained with its proper scope.
- Companion coefficients are monic-normalised. The nonzero power vector proves the forward implication; the lower-row recurrence proves the converse even at λ=0. Infinite same-spectrum claims are qualified for trivial similarity orbits.
- All complex quotients use x* rather than xᵀ and require nonzero denominators. Complex shifts can produce complex vectors even from a real matrix.
- Schur induction normalises its starting eigenvector. The normal-triangular diagonal proof is supplied. Real normal matrices can have 2×2 real Schur blocks, distinct from their complex diagonal form.
- Further nonnormal diagonalization lacks Schur's general norm-preserving guarantee; not every individual calculation must fail. Defective cases have no full diagonalization.
- Power convergence needs a nonzero leading coefficient and a unique largest magnitude. Lower eigenvalue magnitudes need not all be distinct. Sign/phase convergence, zero products, ties, transient constants and diagonalizability limits are explicit. Symmetric Rayleigh eigenvalue estimates can converge faster than vector directions.
- PageRank is presented as a historical mathematical model, not a current assertion about proprietary search systems. Link direction and dangling-column repair are explicit. Positivity supplied by teleportation, rather than nonnegativity alone, ensures the stated uniqueness/convergence. Euclidean and probability normalisations are distinguished.
- Fixed-shift inverse iteration factors once and reuses factors; the O(n³) factorization cost is not charged unnecessarily at every fixed-shift step. Adaptive shifts normally need refactorization.
- RQI rates are local and assume an isolated simple eigenpair and successful solves. Residuals are checked before exact singular shifts. The actual numerical demonstration can report a Rayleigh shift rounded onto an eigenvalue before the requested residual tolerance is reached, rather than claiming false convergence.

## Learning and verification

Five lessons, each with eight progressively ordered practice problems and three mastery questions (55 total), two hints and a worked solution per question. Proof exercises require every part to pass. Five local demonstrations calculate the displayed matrices, iterates, rankings and residuals. Independent tests cover complex companion identities, characteristic determinants, unitary similarities, power-method formulas and failure cases, stochastic conservation/contraction, LU factor reuse, singular shifts and RQI stopping. The account API tests verify multipart grading, read checkpoints and persistence across server restarts and a second session. Existing ids and the account schema remain unchanged.
