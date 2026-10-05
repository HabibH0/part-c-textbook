# Chapter 2 internal coverage audit

This file is editorial documentation and is not imported or served as reader content.

Scope: supplied NLA lecture notes, Section 2 (pp. 14–18) and Section 3 including image-compression illustration (pp. 18–22). Section 4 begins the next chapter. All items below are implemented.

| Material | Teaching location | Practice / demonstration |
| --- | --- | --- |
| Symmetric spectral theorem; real eigenvalues; orthogonal eigenvectors; repeated eigenvalue and sign freedom | svd-construction §§1–2 | svd-a2, svd-c2, svd-c7 |
| SVD existence for every shape and field, ordered nonnegative values, factor shapes, names, rank, outer products, rotation/stretch interpretation | svd-construction §§2–4 | svd-a1–a8; geometry demo |
| Gram-matrix existence proof with orthonormality and reconstruction | svd-construction §3 | svd-a6 |
| Full SVD and orthogonal complement; relation to Householder construction | svd-construction §4 | svd-a7–a8 |
| Complete 4×2 example, Gram matrix, polynomial, eigenvectors, both U columns, computation caveat | svd-construction §5 | svd-a3–a4 |
| Rank, row/column rank equality, rank-r outer sum and thin product factorisation | svd-subspaces §§2,5 | svd-b1,b2,b7 |
| Range, row space, null space; full V for wide matrices; singular-triplet equations | svd-subspaces §§2–3 | svd-b1,b2,b5,b6,b8; subspaces demo |
| SVD as theoretical tool; linear systems and least squares | svd-subspaces §6 (expanded derivation) | svd-b3,b4,b8,bm2 |
| Two Gram spectra; square-root rule; positive eigenvalues and compatible signs | svd-connections §1 | svd-c1,c3 |
| Symmetric eigenvalue magnitudes; unitary, skew-symmetric, normal, triangular extension exercise | svd-connections §2 | svd-c2,c4,c8 |
| Jordan–Wielandt eigenvalues, eigenvectors, extra zeros, orthogonal complement | svd-connections §3 | svd-c5,c6,cm2 |
| Unique ordered singular values; paired signs; common rotations on positive repeated blocks; orthogonal example | svd-connections §§4–5 | svd-c7,c8,cm3; uniqueness demo |
| Spectral norm proposition, upper bound and attaining vector; Frobenius and nuclear formulas; unitary-invariant norms characterised by singular values | svd-approximation §2 | svd-d1,d6 |
| Rank-at-most constraint, truncated sum, shapes, exact storage and fast application, big-O convention | svd-approximation §3 | svd-d3,d4,dm2 |
| Optimal spectral error; good relative approximation; edge ranks k=0 and k≥min(m,n) | svd-approximation §§3–5 | svd-d2,d5,d7 |
| Full optimality proof: B factorisation, null basis W, restriction inequality, intersection, nonzero unit vector, weighted-sum lower bound, attainment | svd-approximation §5 | svd-d7,dm3 |
| Footnote: a wide matrix has a nonzero right-null vector, visible in full SVD | svd-subspaces §3; svd-approximation §5 | svd-b8,bm3 |
| Unitary-invariant norm optimality (statement; general proof not developed), distinction from other optimisation problems | svd-approximation §6 | svd-d8 |
| PCA; explicit and hidden low-rank structure (optional context retained) | svd-approximation §6 | svd-d8 |
| Image intensities, colour extension, 500×500 example at ranks 1,5,10,20,50, near-identity at 50 qualified to that example, storage saving, practical caveat | svd-approximation §7 | svd-d3,d8; actual-SVD generated image demo |

## Mathematical corrections and clarifications

- Null spaces contain zero; they are never empty. Eigenvectors exclude zero.
- For the rectangular worked example, eigenvectors solve the Gram-matrix eigenproblem, not (A−λI)v=0.
- The second singular-triplet relation is Aᵀu=σv, or uᵀA=σvᵀ.
- Gram eigenvalues are squared singular values. Symmetric eigenvalue magnitudes require reordering.
- The Jordan–Wielandt spelling is corrected; stacked eigenvectors need 1/√2 normalisation. Zero multiplicity is m+n−2r.
- Positive singular values couple the two vector choices; zero left/right null bases are independent.
- The Gram proof is extended to zero singular values and wide matrices, without invalid division by zero.
- In the optimality proof, use [W,−Vₖ₊₁], keep coefficient names consistent, and establish the intersection vector is nonzero before normalising. Orthogonality preserves the squared norm with sum |bᵢ|²=1.
- Compact exact rank factors and truncation to an allowed rank are distinguished. Relative error excludes A=0.
- Added storage-number versus file-byte distinction, clipping caveat, and a flat-spectrum counterexample.
- Original illustration is explained in prose; the interactive illustration uses an original procedurally generated facade, with its actual SVD, not a simulated blur.

## Validation

All four documents and exercise math render through KaTeX. Every question has server-side deterministic marking, hints, and a full solution. Tests check all answer keys, reject wrong multipart components, verify persistence and isolation across chapters, and independently verify the image factors' orthogonality, reconstruction, and tail errors. Chapter 1 IDs and database schema are unchanged.
