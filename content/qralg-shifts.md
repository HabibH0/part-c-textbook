## 1. The last Schur direction also contains inverse iteration

For unshifted QR, $A^k=U_kS_k$. Assume $A$ is nonsingular, so $S_k$ is invertible. Taking inverse conjugate transposes gives

$$
(A^k)^{-*}=U_kS_k^{-*},\qquad X^{-*}:=(X^{-1})^*.
$$

The factor $S_k^{-*}$ is **lower** triangular. This is not an ordinary QR factorisation with an upper triangular second factor. What matters is its final column: $S_k^{-*}e_n$ is a scalar multiple of $e_n$. Hence

$$
(A^*)^{-k}e_n\quad\text{is parallel to}\quad U_ke_n.
$$

The final accumulated column is an inverse-power direction for $A^*$. A left eigenvector satisfies $v^*A=\lambda v^*$, equivalently $A^*v=\overline\lambda v$. If the smallest eigenvalue magnitude is uniquely separated and the starting vector has a nonzero component in the relevant eigenbasis, the final column approaches its left eigendirection at rate $|\lambda_n/\lambda_{n-1}|$.

Then the final row of $B_k=U_k^*AU_k$ approaches $(0,\ldots,0,\lambda_n)$. No inverse or linear solve was performed by the QR algorithm. The inverse appears in the analysis of the accumulated factors, revealing a second filtering mechanism hidden in the same iteration.

## 2. Shift the factorisation, then add the shift back

Choose shifts $s_k$ and use

$$
B_{k-1}-s_kI=Q_kR_k,\qquad
B_k=R_kQ_k+s_kI.
$$

The added shift is essential. It makes

$$
B_k=Q_k^*B_{k-1}Q_k,
$$

so the spectrum of $A$ is preserved, not permanently translated. A common simple choice is the current trailing diagonal entry $s_k=(B_{k-1})_{nn}$, which becomes a good approximation to a trailing eigenvalue once that direction is nearly isolated.

For $A=\begin{pmatrix}2&1\\1&2\end{pmatrix}$, a shift $s=1$ makes $A-I$ rank one. Its QR factorisation still exists, and one shifted step can produce a diagonal matrix with entries $3,1$. Unlike explicit inverse iteration, shifted QR does not need $A-sI$ to be invertible. Only the inverse-based *explanation* below needs nonsingularity.

## 3. The shifted product theorem

Let $p_k(z)=\prod_{i=1}^k(z-s_i)$. With $U_k=Q_1\cdots Q_k$ and $S_k=R_k\cdots R_1$, the shifted iteration satisfies

$$
p_k(A)=\prod_{i=1}^k(A-s_iI)=U_kS_k,\qquad B_k=U_k^*AU_k.
$$

All the factors $A-s_iI$ commute because they are polynomials in the same matrix. This permits the newest factor to be placed on the left.

**Proof.** The $k=0$ case is the identity. Suppose $p_{k-1}(A)=U_{k-1}S_{k-1}$. At step $k$,

$$
U_{k-1}^*(A-s_kI)U_{k-1}=Q_kR_k,\qquad
(A-s_kI)U_{k-1}=U_{k-1}Q_kR_k.
$$

Consequently

$$
p_k(A)=(A-s_kI)U_{k-1}S_{k-1}
=U_{k-1}Q_kR_kS_{k-1}=U_kS_k.
$$

This proves the claim, including when a shift makes a factor singular. As with unshifted QR, the polynomial matrix need not be formed in the implementation.

## 4. The rational filter and complex conjugates

When no shift hits an eigenvalue, take inverse conjugate transposes:

$$
p_k(A)^{-*}=U_kS_k^{-*}
=\prod_{i=1}^k(A^*-\overline{s_i}I)^{-1}.
$$

If $v_j$ is a left eigenvector, its multiplier is

$$
\frac1{\overline{p_k(\lambda_j)}}
=\prod_{i=1}^k\frac1{\overline{\lambda_j}-\overline{s_i}}.
$$

Both the eigenvalue and shift are conjugated. There is no extra entrywise conjugation of $U_k$. Real shifts make the formula simpler, but complex shifts are allowed even for real starting matrices if complex arithmetic is used.

Taking the last column again shows that QR implicitly applies an inverse polynomial filter to the final basis direction. The smallest $|p_k(\lambda_j)|$ gives the largest reciprocal magnitude. Relative to a target $\lambda_t$, an unwanted component is weighted by

$$
\left|\frac{p_k(\lambda_t)}{p_k(\lambda_j)}\right|
=\prod_{i=1}^k\frac{|\lambda_t-s_i|}{|\lambda_j-s_i|}.
$$

Shifts close to one isolated eigenvalue can make this ratio tiny. For eigenvalues $1,3$ and a fixed shift $s=0.9$, each factor is $0.1/2.1=1/21$ in favour of $1$. After two such shifts the ratio is $1/441$.

The demonstration plots both $\log_{10}|p_k(z)|$ and $\log_{10}|1/p_k(z)|$ on the real axis. The polynomial has troughs where it is small; the reciprocal has peaks at the same places. At an exact shift there is a polynomial zero and a reciprocal pole. Display clipping makes the graph readable but does not turn an infinite value into a finite mathematical one.

## 5. Shift selection and its limitations

The trailing diagonal entry is useful because the final row tends to decouple. A refinement uses an eigenvalue of the trailing $2\times2$ block closest to its bottom-right entry, commonly called a Wilkinson-type choice. The symmetric case admits an especially effective implementation; general real matrices may require a conjugate-pair strategy instead of one real shift.

A trailing-diagonal shift can stagnate. For $A=\begin{pmatrix}0&1\\1&0\end{pmatrix}$, that shift is zero and the eigenvalues have equal magnitudes. With a natural QR convention, the iteration repeats the same matrix. Thus practical reliability involves more than choosing the bottom-right entry unconditionally. Exceptional shifts and more sophisticated policies address difficult cases; no universal convergence claim is made for this simple rule.
