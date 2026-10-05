# Chapter 6 editorial coverage audit

Internal authoring record, excluded from the reader bundle by the existing coverage-* glob exclusion. The reader contains original self-contained prose and no source citations or links.

Scope: all of Section 7 of NLA_lecture_notes.pdf, printed pages 37–44, stopping before Section 8 (eigenvalue problems). Extracted text read in full; original pages 37, 43 and 44 inspected visually for the opening example, product/inverse formulas and QR estimates. The existing README coverage rule and established lesson layout implement the chapter-writing brief: every source item retained, expanded explanation, separate lesson pages with integrated demo/practice/mastery, ordered automatically checked exercises, two hints and solutions, account-backed progress.

| Source item | Reader coverage | Checked practice / demonstration |
| --- | --- | --- |
| §7 opening UΣ example, exact x=(1,1), MATLAB output (1,.94206), ill-conditioning versus instability | stability-floating §1; stability-conditioning §4 | st-c5; diagonal perturbation demo |
| §7.1 finite binary storage, rounded irrational/rational inputs, roundoff, operations | stability-floating §§2–3 | st-a1–a5, am1, am3; precision controls |
| sqrt(2) cancellation and harmonic-series stagnation examples | stability-floating §4, full mechanism and qualifications | st-a6,a7,am2; actual binary64 scalar expression and labelled low-precision harmonic simulation |
| fl notation, absolute operation bounds | stability-floating §3 | st-a5 |
| §7.2 absolute and relative conditioning, directional derivative interpretation, distinction from algorithm stability | stability-errors §§1–2 | st-b1–b3,bm1; affine sensitivity demonstration |
| Nearby-input definition; Δ notation; hats; epsilon hides constants/dimensions; norm convention | stability-errors §3; stability-floating §5 | st-a8,b4,bm2 |
| §7.3 ideal forward accuracy often impossible; backward justification from stored/uncertain inputs | stability-errors §§3–4 | st-b4,b8,bm3 |
| Forward stability and footnote 17 terminology; mixed forward–backward stability | stability-errors §5; stability-qr §3 | st-b7,f8 |
| Definition 7.1 σmax/σmin, tall full rank, square norm product | stability-conditioning §1 | st-c1,c2 |
| Theorem 7.1 full Neumann proof and first-order perturbation estimate | stability-conditioning §§2–3, with stronger finite bound and explicit remainder | st-c3,c6,cm1; controllable diagonal perturbation demo |
| §7.4.1 backward stable + well conditioned = accurate, absolute rule-of-thumb proof and asymptotic qualification | stability-errors §4; stability-conditioning §3 | st-b5,b6,c8 |
| Well-conditioned systems; symmetric eigenvalues; singular values; dimension factors; vectors can be ill-conditioned; optional Davis–Kahan invitation | stability-conditioning §5 explains value/vector and absolute/relative distinctions; optional gap/angle context | st-c8,cm3 |
| §7.5.1 triangular systems stable; componentwise bound; worst-case but not compulsory forward error; optional proof context | stability-solvers §1, gamma_n statement and optional proof mechanism | st-d1,d2,d8 |
| §7.5.2 factor residual scaled by L,U, not A; compose triangular solves; exercise proving stability under norm-product bound | stability-solvers §2, complete expansion and permutation transport | st-d6,dm2 |
| No-pivot epsilon example; pivoted worst-case exponential growth; multipliers bound and role of U; practical reliability and theoretical tension | stability-solvers §3, explicit n-dimensional growth construction | st-d3,d4,d8,dm1; actual pivoted LU growth experiment |
| §7.5.3 Cholesky exact positive Schur complements, no pivot, entries ≤sqrt(norm A), backward-stable factorisation and solve | stability-solvers §4 with norm proof and numerical-completion qualification | st-d5,d7,dm3 |
| §7.6 dot and matrix–vector backward stability | stability-products §§1–2, row assembly argument | st-e1,e2 |
| Matrix product not generally backward stable; independent column errors need not be common input perturbations | stability-products §3, concrete rank obstruction added | st-e3,e4,em3; computed rounded outer-product demo |
| General forward bound and min-condition-number relative bound, proof assigned as exercise | stability-products §4, complete proof with inverse assumptions | st-e6,em2 |
| Orthogonal multiplication forward and backward stable, left and right cases; well-conditioned extension | stability-products §5, actual error matrix E and explicit perturbations | st-e5,e8,em1 |
| Stable inverse application versus forming inverse; column-dependent perturbations | stability-products §6, corrected equations and common candidate FX⁻¹ | st-e7 |
| Orthogonality matters; nonnormal/Jordan sensitivity; Householder, QR eigenproblem, Golub–Kahan SVD, QZ generalized eigenproblem | stability-products §7, qualified as algorithm design principle | st-e8 |
| §7.7 Householder near orthogonality and reconstruction; full four-step rough proof; factor errors not necessarily small; QR solves/LS stable | stability-qr §§1–3, accumulated-error expansion and polar correction explanation | st-f1,f2,f4,f6,f8,fm1,fm3 |
| §7.7.1 nonexaminable CGS, MGS and twice GS estimates | stability-qr §§4–5, explicit algorithms, dimension/rank qualifications, R update | st-f3,f5,f7,fm2; actual four-algorithm comparison |

## Mathematical corrections and clarifications

- Unit roundoff u=2^-53 is distinguished from the binary64 gap above 1 (2^-52); normal-range operation model and underflow/overflow assumptions are stated. The addition bound retains its factor 2 before constants are absorbed into O(u).
- The harmonic infinite-sum value “approximately 30” is treated as an illustrative finite-precision claim, not a reproducible binary64 universal result. The app calculates a labelled small-precision example instead of pretending to loop to double-precision stagnation.
- The opening MATLAB numbers are preserved as an illustrative possible outcome, not a promised browser output.
- Absolute/relative scales and zero-output limitations are stated. Norm equivalence does not imply dimension-free interchangeable estimates.
- Perturbation remainder is O((εκ)^2), with the source's O(ε²) valid for fixed A; the finite bound requires εκ<1. Weyl gives absolute accuracy, not high relative accuracy for every tiny spectral value.
- Pivoted LU is usually reliable in practice, not universally stable; the theoretical worst-case/practical gap is retained without claiming a current exhaustive status of open research. Large growth can coexist with exact arithmetic in a particular run.
- Exact Cholesky existence is separated from floating-point completion on data near loss of definiteness. The entry bound and conditional backward-stability result are retained.
- Missing transposes in dot-product perturbations are restored. The inverse-application and inverse-column formulas on p.43 incorrectly put (A+ΔA)^-1 before xhat; the correct equation is (A+ΔA)xhat=b. No common small perturbation is guaranteed, rather than asserting no common perturbation exists for every instance.
- A matrix error E replaces expressions adding a scalar ε‖A‖ to a matrix. The min-condition-number product proof states square invertibility where used.
- The sentence claiming all algorithms involving ill-conditioned matrices are unstable is replaced by the accurate principle: ill-conditioned intermediate transformations can amplify error, while stable algorithms can solve ill-conditioned input problems backward stably.
- Householder factors are near orthogonal; an exactly orthogonal nearby factor gives the precise backward interpretation. Factor sensitivity and sign ambiguity do not contradict reconstruction accuracy. Gram–Schmidt estimates retain numerical-independence and small-error qualifications; a second pass updates R as R₂R₁.

## Added learning support

Six lessons, each with eight ordered practice problems (levels 1,1,2,3,3,4,4,5) and three mastery questions: 66 in total. Proofs are multipart and all parts must pass. Six local, deterministic demonstrations use real numerical calculations; toy arithmetic is explicitly labelled. Account persistence, answer-key hiding, routes, LaTeX rendering and independent numerical identities are covered by automated tests. Existing progress ids are unchanged and no schema migration is needed.
