## 1. Symmetry changes the algorithm

This chapter is optional, non-examinable enrichment. It develops the structured variants of QR and the wider family of spectral problems, including their optional refinements.

For a real symmetric matrix $A=A^T$, the spectral theorem gives $A=V\Lambda V^T$ with real eigenvalues and orthogonal $V$. Unlike a general real problem, no conjugate-pair blocks are needed. We can exploit this structure throughout the computation.

Start with the same two-sided Householder reduction used for a general matrix. Each completed stage is $A^{(j)}=F_j^TA^{(j-1)}F_j$. Transposing shows

$$
(A^{(j)})^T=F_j^T(A^{(j-1)})^TF_j=A^{(j)}.
$$

Thus symmetry survives. The Hessenberg condition removes entries below the first subdiagonal, and symmetry removes their counterparts above the first superdiagonal. The result is **symmetric tridiagonal**:

$$
T=\begin{pmatrix}
d_1&e_1&0&0&0\\
e_1&d_2&e_2&0&0\\
0&e_2&d_3&e_3&0\\
0&0&e_3&d_4&e_4\\
0&0&0&e_4&d_5
\end{pmatrix}=V^TAV.
$$

The sequence matters. In a five-by-five matrix, stage 1 clears positions $(3,1),(4,1),(5,1)$ and their transposed positions. Stage 2 clears $(4,2),(5,2)$ and their transposes. Stage 3 clears $(5,3)$ and $(3,5)$. Each new reflector fixes the leading coordinate directions, preserving the earlier zeros. The demonstration shows these three completed similarities.

## 2. A tridiagonal QR step is cheaper

A shifted step factors $T-sI=QR$ and forms $T_{\rm new}=RQ+sI=Q^TTQ$. Symmetry is preserved by similarity, and the Hessenberg argument still applies, so the new matrix is tridiagonal.

Only $n$ diagonal and $n-1$ off-diagonal numbers need be stored. An **implicit structured** step uses local rotations to introduce and then chase a small bulge along the band. There are $O(n)$ local transformations, with a bounded number of band entries updated at each location, giving $O(n)$ arithmetic for an eigenvalue-only sweep. Forming a dense $Q$ or multiplying dense matrices would lose that advantage.

This is an important distinction from the general Hessenberg problem, where a sweep costs $O(n^2)$. If there are typically a few sweeps per deflation, summing the active tridiagonal sizes gives $O(n^2)$ work after reduction. The initial dense-to-tridiagonal reduction still dominates the eigenvalue-only calculation with leading cost approximately $\frac43n^3$.

To obtain eigenvectors, retain the reduction transformations and the rotations from iteration. If $T=Z\Lambda Z^T$, then

$$
A=(VZ)\Lambda(VZ)^T.
$$

Applying rotations to a dense eigenvector matrix is more expensive than updating the tridiagonal entries. A representative total estimate is about $10n^3$ flops when vectors are required. Equivalently, an illustrative accounting of $\frac43n^3$ for values plus roughly $9n^3$ for vectors has a similar scale. These are model-dependent estimates, not identical exact counts.

## 3. A useful shift and deflation

For a trailing symmetric block $\begin{pmatrix}a&b\\b&d\end{pmatrix}$, its eigenvalues are

$$
\frac{a+d}{2}\pm\sqrt{\left(\frac{a-d}{2}\right)^2+b^2}.
$$

A Wilkinson shift selects the one nearest $d$. To avoid cancellation in the closer root, put $\delta=(a-d)/2$ and use

$$
s=d-\operatorname{sign}(\delta)
\frac{b^2}{|\delta|+\sqrt{\delta^2+b^2}},
$$

with a fixed sign convention at $\delta=0$. If $b=0$, the block is already split and can be deflated. For $\begin{pmatrix}2&1\\1&2\end{pmatrix}$, either eigenvalue $1$ or $3$ is equally close to $d=2$, so the convention resolves a genuine tie.

When an off-diagonal entry is sufficiently small relative to the neighbouring diagonal scale, set both symmetric entries to zero. The problem splits into independent symmetric blocks. Removing the pair $e$ adds a symmetric perturbation with spectral norm $|e|$, not $2|e|$: its nonzero two-by-two block has eigenvalues $\pm|e|$.

The demonstration includes a small Wilkinson-shift experiment. Its dense arithmetic exposes the identities and residual; it is not a timing model for an optimized linear-cost sweep.

## 4. Alternatives on tridiagonal matrices

QR is not the only way to solve the reduced problem. **Divide-and-conquer** splits the tridiagonal matrix, solves smaller pieces, then merges information across the cut. The Gu–Eisenstat approach is an important example. Methods using **hierarchically off-diagonal low-rank** representations, often abbreviated HODLR, exploit compressible off-diagonal interactions; work by Kressner and Šušnjara illustrates this direction.

These alternatives address the tridiagonal eigenproblem after reduction. Their speed depends on the requested outputs, matrix size, accuracy and available structure. They do not remove the need to account for the original dense reduction or for reconstructing eigenvectors.

## 5. Spectral divide-and-conquer

Another approach splits the spectrum directly using rational approximation, rather than first pursuing one eigenvalue at a time. This idea is associated with spectral divide-and-conquer work by Nakatsukasa, Freund and Higham.

Choose a threshold $\mu$ in a gap, so $A-\mu I$ has no zero eigenvalue. In exact arithmetic, the matrix sign is

$$
\operatorname{sign}(A-\mu I)
=W\operatorname{diag}\bigl(\operatorname{sign}(\lambda_i-\mu)\bigr)W^T.
$$

The projector

$$
P_+=\frac12\bigl(I+\operatorname{sign}(A-\mu I)\bigr)
$$

selects eigenvectors above the threshold. A carefully chosen rational approximation to the sign function provides an approximate projector using matrix operations and solves. Orthonormal bases for the two complementary invariant subspaces form $V_1$, giving

$$
V_1^TAV_1=
\begin{pmatrix}A_+&0\\0&A_-\end{pmatrix}.
$$

Recursively split each diagonal block. For five eigenvalues the successive block sizes might be $5\to3+2\to1+2+1+1\to1+1+1+1+1$, ending at a diagonal matrix $\Lambda$. The off-block couplings are small rather than exactly zero in finite precision and must be checked.

For intuition, the scalar rational iteration $r_{k+1}(z)=\frac12(r_k(z)+1/r_k(z))$, starting at $r_0(z)=z$, tends to $\operatorname{sign}(z)$ for nonzero real $z$. The explorer applies it to shifted eigenvalues and shows how $\frac12(1+r_k)$ approaches 0 or 1. Intermediate values need not lie in $[0,1]$; they are approximate filters, not exact orthogonal projectors yet. This is an illustration of rational separation, not a complete divide-and-conquer implementation. An eigenvalue on the threshold needs a different split.
