# Chapter 5 editorial coverage audit

Internal authoring record, excluded from the reader bundle. Reader lessons are self-contained and contain no source links or citations.

Scope: NLA_lecture_notes.pdf, all of Section 6, printed pages 29–36, ending before Section 7. Text extraction and the geometric/matrix/graph figures were inspected. This larger section is divided into six lessons, each with eight ordered practice problems and three fresh mastery checks (66 automatically checked questions total).

| Source item | Reader coverage | Automatic practice / demonstration |
| --- | --- | --- |
| §6 thin QR statement, dimensions, orthonormal Q and triangular R | qr-gram-schmidt §1 | qr-a1, am1 |
| Gram–Schmidt, Householder and CholeskyQR algorithm choices; applications to least squares, orthogonalisation, SVD and manifold retraction | qr-gram-schmidt §§1,4,5 | Algorithm distinctions in qr-a7,a8 |
| No pivoting required for Householder stability; rank-revealing pivoted QR non-examinable | qr-householder §6, explicitly labelled extension | qr-b8 |
| §6.1 first two Gram–Schmidt steps and general recurrence, full-rank assumption | qr-gram-schmidt §§2–3 | qr-a2–a5; projection demonstration |
| Rearranged column equations give A=QR; warning on classical Gram–Schmidt stability | qr-gram-schmidt §§3–4 | qr-a6,a8,am3 |
| §6.2 H=I−2vvᵀ, symmetry, orthogonality, involution, eigenvalues | qr-householder §1 with proof | qr-b1,b2,bm1; reflection geometry |
| Equal-length a,b mapping, direction of v, formal proof, reverse mapping | qr-householder §2, full general-length derivation | qr-b3,b4 |
| Geometric diagram: hyperplane, projection, displacement and reflection | qr-householder §1; interactive reflected-vector plot | qr-b2,b3 |
| Map x to norm(x)e1; Lemma 6.1 and exceptional axial forms | qr-householder §3 | qr-b3,b5; explicit safe-sign extension |
| §6.3 first column elimination, embedded zero-pattern vectors, sequence of transforms, full and thin QR | qr-householder §4 | qr-b6,bm3; calculated stage matrices |
| Cost 4n³/3 or 2mn²−2n³/3; O(m) reflector application | qr-householder §5 | qr-b7,bm2 |
| Backward stability and near orthogonality; existence proof and orthogonal complement completion | qr-householder §§4,6 | qr-b6,b8 |
| Square solve Rx=Qᵀb; leading cost twice LU | qr-least-squares §5 | qr-d7 |
| Orthogonal triangularisation versus triangular orthogonalisation | qr-gram-schmidt §5 | qr-a8 |
| Footnote 15: CholeskyQR construction, fast but unstable single-pass version | qr-gram-schmidt §5, exact orthogonality proof and caveat | qr-a7 |
| §6.4 local Givens matrix, c²+s²=1, one-entry annihilation | qr-givens §§1–2 | qr-c1–c3,cm1 |
| Five-by-five Hessenberg figure, four rotations, Q with transposed rotations | qr-givens §4 | qr-c6,c7,cm2,cm3; five-by-five numerical stage demo |
| Row/column locality, nonadjacent indices, embedded cos/sin matrix | qr-givens §3 | qr-c4,c5 |
| §6.5 oversampling motivation, inconsistent overdetermined equations, residual norm, rank/uniqueness, minimum-norm convention | qr-least-squares §1 | qr-d1,d4,d6,d7 |
| Theorem 6.1, full-QR proof, thin formula, solve algorithm | qr-least-squares §§2–4 | qr-d2–d6,dm1–dm3; computed fit/residual demo |
| Least-squares backward stability; contrast with plain LU | qr-least-squares §4 | qr-d7 |
| Optional/non-examinable 1-norm discussion and sparsity of residual | qr-least-squares §6, with mean/median example | qr-d8 |
| Footnote 16: truncated SVD for unitarily invariant norms, non-invariant 1-norm exception | qr-least-squares §6 | qr-d8 |
| §6.6 square QR stability/cost, SVD solve formula and approximate expense comparison | qr-least-squares §5 | qr-d7 |
| §6.7 equivalence of QR and normal equations, Gram PSD/PD, Cholesky approach | qr-normal-equations §§1–2 | qr-e1,e2 |
| Fast but not generally backward stable; κ₂(AᵀA)=κ₂(A)² | qr-normal-equations §3, SVD proof and binary64 example | qr-e3,e4,e8,em1,em3; actual Gram-rounding demo |
| General inner-product best approximation, residual orthogonality and Pythagorean proof/uniqueness | qr-normal-equations §4, both implications | qr-e6 |
| Polynomial approximation inner product integral over [−1,1] | qr-normal-equations §5, fully evaluated example | qr-e5,em2 |
| Cholesky revisited via SPD square root and QR; first-row rank-one term and PSD remainder | qr-normal-equations §6 | qr-e7 |
| §6.8 sampling, monomial polynomial model, Vandermonde coefficients and applications | qr-regression §§1–2 | qr-f1–f4,f6,fm1 |
| f(t)=1+sin(10t)exp(t), degree ten, 11 equispaced samples versus 100, both graph panels | qr-regression §§3–4; actual QR fits in interactive plot with both presets | qr-f5; numerical regression test |
| Optional/non-examinable Lebesgue-constant pointer and non-cherry-picked mechanism | qr-regression §5, explicit definitions and bounds | qr-f7,fm2 |

## Corrections and clarified assumptions

- Thin Q with n orthonormal columns requires m≥n. Rank-deficient QR exists, but the simple normalising Gram–Schmidt algorithm needs full column rank.
- Gram–Schmidt r_ij=q_iᵀa_j is used for i<j; the lower triangle is zero, not an indiscriminate instruction for every i≠j.
- The equal-length reflector proof retains the common norm ρ instead of silently replacing it by one. The direction equation is 2v(vᵀa)=a−b; changing v's sign leaves H unchanged.
- Zero and axial inputs are handled; the positive-target existence formula is distinguished from cancellation-avoiding numerical sign selection.
- Full and thin QR dimensions, product order and the action order on a vector are explicit. Compact factorisation costs do not include arbitrary explicit full-Q construction.
- Backward stability/near-orthogonality statements use the standard rounding model and dimension-dependent bounds, not literal exact equality to one epsilon or unqualified overflow safety.
- Givens inverses are transposes, not the original rotations; left and right actions use their correct signs. Locality is not a promise of zero fill-in.
- The least-squares backward-error objective uses the consistent minus sign between the perturbed model and perturbed observations.
- Plain rectangular LU is not a replacement for the orthogonal residual split; QR is not the only mathematical least-squares algorithm. SVD and normal equations are covered with qualifications.
- Square QR/LU and SVD expense comparisons are illustrative flop/algorithm statements, not hardware-independent timing ratios.
- Gram stability is distinguished from stability relative to original least-squares data.
- Best approximation assumes a finite-dimensional subspace, ensuring existence; the real/complex orthogonality argument is distinguished.
- The padded Cholesky remainder is PSD; only its nonsingular active trailing block is PD.
- Polynomial degree d means d+1 coefficients. The 11-point figure is degree 10, not degree 11. Distinct-node rank and numerical conditioning are separate.
- The two regression presets reproduce the exact supplied function and sampling counts. Grid errors are labelled estimates, and oversampling is not claimed to improve every possible function/objective.

## Verification

All lessons include prerequisites/assumptions, derivations and complete arguments, examples, demonstrations, eight practice tasks in levels 1,1,2,3,3,4,4,5 and three mastery questions. Each question has two progressive hints and a worked solution, with per-part automatic proof marking and no self-assessment rubric.

Tests check LaTeX, counts/membership/order, correct answers and incorrect proof components. Independent numerical properties check reconstruction, orthogonality, QR action on b, protected zero patterns, least-squares Pythagoras, known Gram breakdown, interpolation at all eleven nodes and orthogonality of the 100-sample regression residual to all monomial columns. API tests check new chapter progress across restart and separate sessions in a temporary database.
