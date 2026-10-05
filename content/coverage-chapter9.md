# Chapter 9 editorial coverage audit

Internal editorial record, excluded from the reader bundle. Scope: all of Section 10, pp.55–58 of the supplied NLA lecture notes, ending before Section 11. The entire section is nonexaminable 2025–26; optional status is retained without omitting content. Governing brief: README coverage rule for future chapters.

| Source content | Reader coverage |
| --- | --- |
| §10.1 symmetric problem, symmetric Hessenberg is tridiagonal, all 5×5 zero-pattern stages | spectral-symmetric §1; explicit transpose proof and calculated three-stage reduction |
| Linear-cost tridiagonal QR versus quadratic Hessenberg QR | spectral-symmetric §2; band/bulge explanation, separate dense eigenvector update cost, demo explicitly labelled as dense pedagogical arithmetic |
| Tridiagonal alternatives: Gu–Eisenstat divide-and-conquer, Kressner–Šušnjara HODLR | spectral-symmetric §4; names and mechanisms retained, HODLR expanded, no reader source links |
| 4n³/3 values, about 10n³ vectors; store Givens rotations | spectral-symmetric §2; accumulated VZ basis and alternative additional-vector accounting reconciled |
| Optional spectral divide-and-conquer, Nakatsukasa–Freund/Higham, rational approximation and 5→3+2→1+2+1+1→diagonal diagram | spectral-symmetric §5; exact sign/projector equations, approximate subspaces/coupling qualification, recursive block sizes, rational sign explorer |
| §10.2 Gram eigenproblem for SVD and inaccurate small singular values | spectral-bidiagonal §1; exact three-by-two example with actual floating-point loss demonstrated |
| Different left/right orthogonal factors, Golub–Kahan process and every 5×4 diagram stage | spectral-bidiagonal §§2–3; shape, six meaningful reflector stages, support argument, factor accumulation, wide/zero-tail cases |
| Singular-value invariance and backward-stable orthogonal operations | spectral-bidiagonal §§2–3; Gram similarity proof, normwise versus relative accuracy clarified |
| Mathematical QR on BᵀB; optional Gu–Eisenstat divide-and-conquer and Fernando–Parlett dqds | spectral-bidiagonal §4; explicit tridiagonal formula, worked 2×2 example, implicit versus formed Gram distinction, recovery of U,V and zero singular values |
| Approx. 4mn² values / 20mn² with vectors | spectral-bidiagonal §5; retained with shape/output/accounting qualifications and dense reduction formula |
| §10.3 Ax=λBx definition, nonzero vectors, determinant roots, B⁻¹A reduction | spectral-generalised §§1–2; regular pencils, finite/infinite/indeterminate distinctions and worked diagonal examples |
| Symmetric A,B with positive-definite B imply real eigenvalues | spectral-generalised §3; Cholesky proof, Rayleigh quotient, B-orthogonality, indefinite counterexample; computed original-pencil residuals |
| QAZ,QBZ triangular and diagonal ratios | spectral-generalised §4; explicit Q* convention, equivalence of source convention, determinant proof, homogeneous pairs and vector recovery |
| Hessenberg–triangular preprocessing, implicit QR on B⁻¹A without inverse, approx. 50n³ | spectral-generalised §5; outline and T⁻¹S identity, regular singular-B extension, pair backward-error interpretation |
| §10.4 tractable at modest sizes in thousands; standard symmetric and nonsymmetric work estimates | spectral-extensions §1; all constants in a comparison table, extra-versus-total vector work labelled |
| SVD 8mn²/3 values plus 20mn² vectors | spectral-extensions §1 and spectral-bidiagonal §5; square-like accounting distinguished from general rectangular reduction |
| Generalised eigenvalue problems | spectral-extensions §1 and full preceding lesson |
| Quadratic/polynomial P(λ)x=0, degree k, approx.20(nk)³ | spectral-extensions §2; full block linearisation and finite-eigenpair proof, example, expanded dimension and sensitivity qualifications |
| Nonlinear N(λ)=(Ae^λ+B), approximation N≈P | spectral-extensions §3; region, residual bound, Taylor worked examples and interactive original-residual comparison |
| More difficult vector nonlinearity A(x)x=λx | spectral-extensions §4; normalization and formulation explained |
| Further speedups from sparsity/low rank | spectral-extensions §5; retained and connected to the next chapter (Section 11, iterative methods/Arnoldi) |

## Corrections and qualifications

- Costs are illustrative and not consistent exact formulas across the source's two summaries. The reader preserves all supplied scales, labels additional versus total vector work, and explains how 4mn²−4n³/3 becomes 8n³/3 in the square case. It does not imply 8mn²/3 is the universal rectangular leading count or that full m×m left singular vectors always cost O(mn²).
- The QZ left-factor convention is made explicit: Q*AZ is equivalent to naming the source's left unitary Q directly. Eigenvalues are diagonal ratios only with nonzero denominators. Regular pencils with singular B can include infinity; singular pencils and 0/0 require additional analysis.
- The source's bare “n eigenvalues” statement is expanded with regularity, multiplicity and infinity. Real-spectrum guarantees for symmetric pairs require B positive definite, not just symmetric.
- The SVD connection to QR on BᵀB is a mathematical identity, not advice to form a Gram matrix and incur the very loss being avoided. Bidiagonal algorithms operate on the bidiagonal entries; dqds is primarily values-only.
- No source theorem/proof or exercise is skipped: this section supplies algorithmic sketches and diagrams rather than numbered proofs. The chapter expands their key claims into checked derivations. Optional algorithms remain at the source's conceptual depth with clarifying details, not invented full implementations.
- The tridiagonal demo uses dense transformations for transparency and makes no O(n) implementation/timing claim. The rational filter is a scalar illustration, and the diagonal pencil explorer is not labelled as a production QZ solver.
- Historical author associations are retained; bibliographic citations and source links are not exposed in the self-contained reader.

## Learning and validation

Four lesson pages, each with learning material, its calculated demonstration, eight increasingly difficult practice questions, and three fresh mastery questions on the same page. All 44 questions are automatically marked; multipart proof tasks require every part. Every question includes two progressive hints and a worked solution. Existing ids and account storage are unchanged.

Numerical tests check both-sided tridiagonal zeros, eigenvector residuals, shift selection, capped runs, sign filters, each bidiagonal reconstruction, singular spectrum invariance through Gram similarity, actual Gram rounding loss, original-pencil eigenpairs, B-orthogonality, homogeneous cases, polynomial linearisation, nonlinear residuals and cost formulas. Integration tests exercise the new multipart answers and persist new lesson/exercise progress through an isolated server restart. Full-catalog tests validate mathematical markup and public answer-key omission.
