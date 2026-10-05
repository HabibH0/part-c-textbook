# Chapter 4 editorial coverage audit

Internal authoring record, excluded from reader imports. The reader is self-contained and has no source links or references.

Scope: NLA_lecture_notes.pdf, all of Section 5, printed pages 25–28. Stop before Section 6 (QR and least squares). Source text and the matrix diagrams on pages 26–28 were inspected. The four lessons retain every mathematical statement, proof request, worked construction, optional qualification and footnote topic, expanding compressed arguments into complete explanations.

| Source content | Reader coverage | Checked practice / demonstration |
| --- | --- | --- |
| Direct methods, factorisation as a foundational/top-ten algorithmic idea, illustrative sub-millisecond 100×100 problem, importance of linear systems | lu-factorisation §1 | Motivation retained; hardware dependence made explicit |
| Square real A, lower/upper triangular factors, zero-pattern pictures | lu-factorisation §§1–3 | lu-a1; actual numeric factor matrices in demo |
| Equations 5.1–5.3: peel off rank-one terms, match first row/column, pivot divisions, trailing residual | lu-factorisation §§2–4, full block and entry formulas | lu-a2–a6; stepwise rank-one sum and residual |
| Repeat on trailing block; zeros in later factors; stack columns/rows to obtain LU; structured rank-one interpretation | lu-factorisation §§3–4 | lu-a4–a7, am1–am3 |
| Nonzero-pivot assumption, failure postponed to pivoting | lu-factorisation §5 and lu-pivoting §1 | lu-a8, c3 |
| §5.1 Ly=b then Ux=y; triangular solves easy and O(n²) | lu-solves §§1–4 | lu-b1–b4, b6, bm1–bm3; substitution trace |
| Triangular solve backward stability, (L+ΔL)ŷ=b | lu-solves §6 | lu-b8; arithmetic model and forward-error caveat stated |
| LU cost 2n³/3, quadratic solve cost, reuse for another right-hand side | lu-factorisation §5; lu-solves §5 | lu-a7, b5, b6, bm3 |
| §5.2 zero pivot, no unpivoted LU for [[0,1],[1,0]], small pivots also need remedy | lu-pivoting §§1,5 | lu-c3,c4; zero/small-pivot demonstrations |
| Partial pivoting: largest active-column entry, row permutations, PA=LU, permutation-matrix definition and orthogonality | lu-pivoting §2 | lu-c1,c2,cm1,cm2 |
| PAx=Pb and unchanged leading factorisation cost | lu-pivoting §§2,5 | lu-c2,c5; stored-L/row-order demonstration |
| Multiple right-hand sides: 2n³/3+O(kn²) rather than O(kn³) | lu-solves §5 | lu-b5,bm3 |
| Existence of pivoted LU for any nonsingular matrix, source proof exercise | lu-pivoting §4, full induction and Schur-complement nonsingularity proof | lu-c6 |
| Partial pivoting widely used and usually stable, exceptions, factorisation backward error | lu-pivoting §5 | lu-c7,cm3; growth example |
| Footnote 13: complete pivoting exchanges rows and columns; rapidly decaying spectra and useful low-rank approximation | lu-pivoting §6, optional extension | lu-c8 |
| §5.3 SPD equivalence to positive eigenvalues; symmetric factors; no pivoting | lu-cholesky §§1–3 | lu-d1,d2,d6,dm3 |
| Equation 5.4: symmetric rank-one subtraction and positive trailing block | lu-cholesky §§2–4, complete positivity proof and full example | lu-d6; Cholesky stages |
| Half LU cost, n³/3; diagonal not ones | lu-cholesky §§4–5 | lu-d3–d5,dm1,dm2 |
| A=RᵀR iff PSD | lu-cholesky §6, proof in both directions and triangular-factor existence | lu-d7; semidefinite boundary |
| Indefinite Hermitian LDL*, unit diagonal L, diagonal/block D, real 2×2 pivots | lu-cholesky §7, precise pivoted block form and example | lu-d8 |
| Source suggestion of uniqueness to understand positive Schur complement | lu-cholesky §3 supplies independent positivity proof and positive-diagonal uniqueness proof | lu-d6,d8 |
| Symmetric systems roughly half effort; footnote 14 highlights importance and rich properties of positive definite matrices | lu-cholesky §§1,5,7 | Explanatory prose and cost questions |

## Corrections and necessary qualifications

- Partial pivoting maximises absolute value. A largest signed entry is not the rule.
- Later swaps also reorder the already computed columns of L. The numerical demonstration includes a second-step swap.
- Exact nonsingularity is distinguished from unpivoted breakdown, computational feasibility and numerical conditioning.
- The triangular-solve stability statement is accompanied by the usual floating-point assumptions and a componentwise interpretation. It is not an unconditional forward-error claim or an unconditional guarantee for the whole LU solve.
- Cholesky requires rescaling each symmetric LU rank-one pair using the square root of its pivot; unit-diagonal LU factors cannot simply be identified with transposes.
- The trailing active Schur complement is positive definite. The entire padded residual is only positive semidefinite because of its leading zeros.
- Existence of a semidefinite Gram/triangular factor does not make zero-pivot divisions valid. The positive-definite algorithm stops at zero or negative pivots in the demo, with an explanation of the boundary.
- Universal LDL* needs symmetric permutations and may need 1×1/2×2 Hermitian blocks in both real and complex cases. An unpivoted diagonal-D claim for every indefinite matrix is false; [[0,1],[1,0]] is the explicit counterexample.
- Complete-pivoting low-rank quality is a tendency, not the truncated-SVD optimality theorem. Row and column permutations are both undone when interpreting its approximation.
- Timing and leading flop counts are estimates with their assumptions, not promises of measured performance.

## Pedagogy and verification

Four lessons, each with teaching, a calculated interactive demonstration, eight practice problems in levels 1,1,2,3,3,4,4,5 and three fresh mastery checks. Every question is numeric, choice, or multipart automatic marking; each has two hints and a worked solution. Proof questions check the actual identities, hypotheses and logical transitions.

Tests validate all LaTeX, uniqueness/membership of identifiers, ordering, answer keys and rejection of incorrect multipart components. Algorithm tests check reconstruction identities against the original matrices, stage invariants, known solutions from independent right-hand sides, later swaps, growth examples and positive/zero/negative Cholesky pivots. API tests use a temporary database to verify new progress across server restarts and a second login session, while preserving user data.
