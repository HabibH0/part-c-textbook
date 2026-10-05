# Chapter 3 editorial coverage audit

Internal authoring record; excluded from the reader's Markdown imports. Reader text is self-contained and contains no source citations.

Scope: NLA_lecture_notes.pdf, Section 4, printed pages 21 and 23–25. Page 22 belongs to the preceding SVD image example. Stop immediately before Section 5. All Section 4 definitions, statements, proofs, examples, footnote qualifications, optional topics and decomposition categories are included.

| Source item | Reader location | Automatic practice / demonstration |
| --- | --- | --- |
| Theorem 4.1: both eigenvalue and singular-value variational formulas; ordering, nonzero vectors, tall complex matrices | minmax-principle §§1,4,5 | cf-a1, a2, a4, a8; rotating-plane demonstration |
| Footnote 11: smallest-first analogues | minmax-principle §4 | cf-a8 |
| Fixed orthonormal basis Q and inner minimum σmin(AQ)=σi(AQ) | minmax-principle §2 | cf-a5 |
| Three-step singular-value proof: intersection dimensions, upper bound, attaining subspace | minmax-principle §3 | cf-a6, am3 |
| Recommended eigenvalue proof exercise | minmax-principle §5, complete signed-eigenbasis argument | cf-a4 includes checked proof identity and intersection reasoning |
| Dual min–max proof (expanded beyond source) | minmax-principle §4 | cf-a7 |
| Endpoints i=1,n and role of intermediate dimensions | minmax-principle §4 | cf-a8, am1 |
| Theorem 4.2: singular values, spectral-norm special case, symmetric eigenvalues | minmax-weyl §§1–3 | cf-b1–b4; interval demonstration |
| Proof exercise: consequence of Courant–Fischer | minmax-weyl §§2–3, full pointwise/minima/maxima proof | cf-b6 |
| Absolute conditioning; backward stability and accuracy | minmax-weyl §§4–5 | cf-b5, b7, b8, bm1–bm3 |
| Footnote 12: Hermann Weyl, prominent twentieth-century mathematician | minmax-weyl §1 | Historical context retained in prose |
| §4.1.1: 2×2 Jordan example, sqrt(ε) shifts and amplification | minmax-sensitivity §1 | cf-c1–c3, cm1 |
| General Jordan block, lower-left perturbation, nth-root motion, n=100 and ε=10^-100 | minmax-sensitivity §§2–3, full root derivation | cf-c4–c7, cm2; exact root-circle demonstration |
| Non-examinable diagonalizable case, O(cε), eigenvector conditioning κ2(X) | minmax-sensitivity §4, explicitly optional/non-examinable; precise Bauer–Fike statement and proof | cf-c8, cm3 |
| §4.2 optional vertical block inequality and proof sketch | minmax-applications §1, full proof; optional label retained | cf-d1–d3, d6; row-augmentation demonstration |
| Horizontal block inequality, restricted-subspace argument | minmax-applications §2, full proof plus adjoint alternative | cf-d4, d6 |
| §4.3 SVD, eigenvalue, normal and symmetric special cases, Jordan, Schur, QR, LU | minmax-applications §§4–5 | cf-d7, d8, dm3 |
| Red/blue colour annotations: orthogonal factors, stable computation, unitary normal/symmetric eigenbases | minmax-applications §6, expressed as accessible prose | cf-d8 |
| Jordan form as exact similarity classification; numerical fragility of eigenvalues and block sizes | minmax-sensitivity §3; minmax-applications §5 | cf-c7, d8 |

## Corrections and clarified assumptions

- The inner minimum uses a fixed orthonormal basis Q of S, and complex arithmetic uses adjoints. The outer optimisation varies subspaces. This avoids the source's ambiguous joint minimisation notation.
- Eigenvalue Weyl needs a Hermitian/symmetric perturbation for its ordered-real-spectrum formulation.
- “Essentially full precision” is stated as absolute accuracy on the matrix scale, not full relative accuracy of every tiny singular value/eigenvalue. Backward stability and conditioning remain distinct.
- The specified Jordan perturbation gives exactly ε^(1/n), not merely an approximation. Large eigenvalue sensitivity does not apply to every nonsymmetric matrix or every perturbation direction.
- Bauer–Fike supplies nearest-spectrum proximity for a fixed eigenvector matrix, not arbitrary ordered matching.
- Row/column block inequalities state compatible indices and zero-padding conventions explicitly.
- QR uses upper triangular R, correcting the source's U. LU may require a row permutation. Real Schur can require 2×2 diagonal blocks; complex Schur is triangular. Rank-deficient tall QR still exists.
- Availability of backward-stable orthogonal-factor algorithms does not imply all implementations are stable or all requested quantities are well conditioned.

## Chapter structure and verification

Four separate lessons; each contains teaching, one demonstration, eight increasingly demanding practice problems and three fresh mastery questions. All 44 questions use numeric or structured choice checking; proof parts receive individual feedback. Each has two progressive hints and a solution. Optional material is retained with its label.

Tests parse all mathematics, check membership and question ordering, exercise every answer key and reject each wrong multipart component. Independent numerical checks verify demo extrema, characteristic equations, Jordan roots, Gram-matrix invariants and conditioning examples. API integration verifies Chapter 3 marking, account isolation and progress across restarts and a second session, using a temporary database.
