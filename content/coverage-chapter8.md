# Chapter 8 editorial coverage audit

Internal only; excluded from the reader bundle. Governing rule: README coverage rule for future chapters. Scope: supplied NLA lecture notes, Section 9, printed pp. 49–55, stopping before Section 10. The complete section is labelled nonexaminable 2025–26; the reader retains optional/non-examinable status and all mathematics. Section 10 (symmetric QR and SVD) is the next chapter.

| Source item | Reader location and treatment |
| --- | --- |
| §9 opening: all eigenvalues, moderate dense size about 10,000, cubic work, backward stability; SVD through Gram eigenproblem versus Golub–Kahan | qralg-iteration §§1,5; scale and reliability qualifications, zero singular values and squared conditioning explained |
| §9.1 Algorithm 9.1, reverse QR products, eig(AB)=eig(BA) | qralg-iteration §§1–2; square-product determinant identity, unitary similarity proof and explicit 2×2 factors |
| Similarity, triangular/normal diagonal target, origins, shifted convergence and stability discussion | qralg-iteration §§2,5; real 2×2 exception, convergence hypotheses, local backward interpretation and sensitive forward errors |
| Theorem 9.1 and complete induction; accumulated Q and reverse R order | qralg-iteration §3; B_k denotes the iterate, A^k the power, U_k and S_k the accumulated factors |
| First-column power method and remaining orthogonal complement | qralg-iteration §4; first-column identity, spectral gap and initial projection conditions, remaining block mechanism distinguished from a full theorem |
| Inverse-transpose relation, last column, left eigenvector, smallest-modulus rate, no actual inverse | qralg-shifts §1; lower triangular inverse-adjoint factor and final-column selection made explicit |
| Algorithm 9.2, trailing-entry shift, rapidly decoupled bottom row | qralg-shifts §§2,5 and qralg-deflation §1; exact eigenvalue shift still permits QR; stagnation counterexample |
| Theorem 9.2, full induction and polynomial product | qralg-shifts §3; commuting factors justify rearrangement |
| Inverse conjugate transpose, reciprocal eigenvalue filter and convergence ratio | qralg-shifts §4; correct complex conjugates, target/unwanted multiplier ratio and numerical example |
| Footnote 19: complex shifts for real matrices | qralg-shifts §4; qralg-refinements §2 explains real conjugate pairing |
| Footnote 20: trailing 2×2 eigenvalue nearest bottom diagonal | qralg-shifts §5; Wilkinson-type choice, tie and complex-pair qualifications in exercises |
| §9.2 dense O(n) iterations × cubic cost; Hessenberg preprocessing | qralg-hessenberg §§1–2; empirical iteration assumption, cubic one-time reduction |
| Five-by-five diagrams: leading zeros in Householder vectors, left/right stages, n−2 stages | qralg-hessenberg §§2–3 plus calculated stage-by-stage 5×5 demonstration showing both left-only and completed similarity |
| Hessenberg definition and persistence exercise (“Check!”) | qralg-hessenberg §§1,5; full rotation/triangular-support proof and automatically checked proof problems |
| Givens QR quadratic cost, accumulated Schur vectors | qralg-hessenberg §§4–5; local row/column updates, VU original basis, singular-factor case |
| p.54 scalar deflation, leading (n−1) block, iteration count 2–4, approx. 25n³ flops | qralg-deflation §§1–4; block determinant proof, relative threshold, rank-one deletion error, coupling update, active-loop description and cubic sum |
| §9.2.1 subdiagonal convergence curves for plain/shifted 5×5 QR | qralg-deflation §5 and calculated demonstration; explicit known spectrum, same tolerance, actual histories/deflations and reconstruction residual |
| Rational/polynomial plots with eigenvalue markers | qralg-shifts §4 and interactive log polynomial/reciprocal toggle, exact poles and plotting limits labelled |
| §9.2.2 real double shift | qralg-refinements §2; expanded real quadratic identity, implicit implementation versus illustrative dense product, real 2×2 endpoint |
| Aggressive early deflation, Braman–Byers–Mathias, trailing window about 100, speedup about ten | qralg-refinements §3; transformed coupling test and local Schur reordering; window size and speedup examples retained with qualifications |
| Balancing DAD⁻¹, norm reduction, improved conditioning | qralg-refinements §§4–5; explicit example, unchanged spectrum, nonunitary basis, condition of D and original-coordinate error transport |

## Corrections and expanded qualifications

- The source's superscript/subscript notation can obscure powers versus QR iterates. Distinct B_k and A^k remove ambiguity without dropping either theorem or proof.
- The inverse-adjoint triangular factor is lower triangular, so calling that factorisation ordinary QR is incorrect. The last-column argument, not an upper triangular QR claim, supplies inverse iteration.
- For p(A)=US, p(A)^(-*)=U S^(-*), with no entrywise conjugation of U. The factors are (A*−conj(s_i)I)^(-1), and the eigenvalue multipliers conjugate both λ and s. This corrects the source's conjugations.
- The inverse-based explanation needs invertibility; shifted QR itself does not. The left-eigenvector interpretation and spectral-gap/projection assumptions are explicit.
- Real normal matrices with nonreal eigenvalues need real 2×2 blocks. Unshifted convergence is conditional; a simplistic trailing-diagonal shift is not globally reliable. The source's historical research-status claim about a recently available global proof is not repeated as a current universal guarantee. The original contributors are named without reproducing potentially ambiguous historical year attributions.
- The source's log-polynomial figure labels sit beside prose about amplification. The app distinguishes log|p| troughs from log|1/p| peaks. The source does not specify the matrix behind its plotted counts, so a new reproducible 5×5 experiment illustrates the same phenomenon without pretending to reproduce unknown data.
- The test matrix for the deflation demo is symmetric with known real eigenvalues; its simple scalar algorithm is expressly not a general production real-Schur solver. A cap reports incomplete work. It keeps upper coupling blocks and the accumulated basis.
- A relative deflation test and scale floor expand the source's absolute epsilon sketch. Deleting one entry has spectral norm equal to its magnitude; sensitive forward eigenvalue errors remain possible.
- The 2–4 step and 25n³ cost estimates are retained as empirical engineering estimates, not exact counts or worst-case guarantees. Balancing and early deflation similarly retain their stated benefits without promising them universally.

## Learning and verification

Five separate lesson pages; each has exposition, a calculated demonstration, eight increasingly difficult practice problems, and three fresh mastery problems on the same page. All 55 exercises are numeric, choice or multipart checks, with two hints and worked solutions. Proof tasks check all reasoning parts. No self-assessed rubric. Stable qralg-/qra- ids extend account-backed progress without changing previous content ids.

Numerical tests cover accumulated identities, orthogonality, all reduction stages, structured shifted steps including inactive coupling, convergence and cap behaviour, filtering, double shifts and balancing. Integration checks verify new multipart marking, answer-key omission and saved progress across server restarts using an isolated database. Reader mathematics is KaTeX-validated with the existing full catalog.
