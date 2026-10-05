## 1. Two Gram matrices, one set of stretches

The SVD and symmetric eigenvalue decomposition describe closely related geometry, but their numbers are not interchangeable. Singular values measure nonnegative stretch. Eigenvalues describe directions mapped to scalar multiples of themselves and can be negative or complex.

Assume $A\in\mathbb R^{m\times n}$, $m\ge n$, and $A=U\Sigma V^T$ is a thin SVD. Then

$$
A^TA=V\Sigma U^TU\Sigma V^T=V\Sigma^2V^T.
$$

Thus $v_i$ is an eigenvector of $A^TA$ with eigenvalue $\sigma_i^2$. In particular,

$$
\sigma_i(A)=\sqrt{\lambda_i(A^TA)},
$$

when the eigenvalues of the positive semidefinite Gram matrix are in descending order.

Similarly, $AA^Tu_i=\sigma_i^2u_i$. Its remaining $m-n$ eigenvalues are zero, with eigenvectors in the orthogonal complement of $U$. At rank $r$, the total zero multiplicities are $n-r$ for $A^TA$ and $m-r$ for $AA^T$.

The two Gram matrices have the same **positive** eigenvalues, with multiplicities, despite their different sizes. To obtain a consistent singular triplet for $\sigma_i>0$, choose $v_i$ and set $u_i=Av_i/\sigma_i$. Independent eigenvector routines for the two Gram matrices can choose incompatible signs or different bases in repeated eigenspaces.

## 2. When eigenvalues determine singular values

### Symmetric and Hermitian matrices

For a real symmetric $A=Q\Lambda Q^T$,

$$
A^TA=A^2=Q\Lambda^2Q^T.
$$

Therefore its singular values are the absolute values of its eigenvalues, **reordered in descending magnitude**. If $\lambda_i\ne0$, choose $v_i=q_i$ and $u_i=\operatorname{sign}(\lambda_i)q_i$, with the columns placed in that magnitude order. For a zero eigenvalue the corresponding left and right choices need not be coupled.

For example,

$$
A=\operatorname{diag}(-4,2),\quad U=\operatorname{diag}(-1,1),\quad\Sigma=\operatorname{diag}(4,2),\quad V=I.
$$

Taking $U=V=I$ would reconstruct $\operatorname{diag}(4,2)$, a different matrix. If $A$ is positive semidefinite, an eigenvalue decomposition already gives an SVD with $U=V$ after sorting.

For a complex Hermitian matrix, use $Q^*$ in place of $Q^T$; its eigenvalues are still real.

### Normal, unitary, and skew-symmetric matrices

For a complex **normal** matrix, the spectral theorem gives $A=Q\Lambda Q^*$ with unitary $Q$. Then $A^*A=Q|\Lambda|^2Q^*$, so the singular values are $|\lambda_i|$, sorted. Write $\lambda_i=\sigma_i e^{\mathrm i\theta_i}$ when nonzero. One consistent choice is $v_i=q_i$, $u_i=e^{\mathrm i\theta_i}q_i$.

A unitary matrix has $A^*A=I$, so **every singular value is one**. Its eigenvalues have modulus one, but need not all equal one. A real orthogonal matrix is the real special case.

A real skew-symmetric matrix satisfies $A^T=-A$ and is normal, since $A^TA=AA^T=-A^2$. Its complex eigenvalues are purely imaginary or zero; nonzero ones occur in conjugate pairs. Its singular values are their magnitudes. For

$$
K=\begin{pmatrix}0&-3\\3&0\end{pmatrix},
$$

the eigenvalues are $3\mathrm i,-3\mathrm i$, while the singular values are $3,3$.

### Triangular matrices are different

Triangular structure alone does not imply normality. The eigenvalues are the diagonal entries, but singular values generally are not their absolute values. For

$$
T=\begin{pmatrix}1&1\\0&1\end{pmatrix},\qquad T^TT=\begin{pmatrix}1&1\\1&2\end{pmatrix},
$$

the eigenvalues of $T$ are $1,1$, whereas

$$
\sigma_1(T)=\sqrt{\frac{3+\sqrt5}{2}},\qquad\sigma_2(T)=\sqrt{\frac{3-\sqrt5}{2}}.
$$

The Gram eigenvalues come from $\lambda^2-3\lambda+1=0$. This is a concrete counterexample to the claim that singular values always equal eigenvalue magnitudes.

## 3. A symmetric matrix that contains the SVD

Define the **Jordan–Wielandt matrix**, also called a symmetric dilation,

$$
H=\begin{pmatrix}0&A\\A^T&0\end{pmatrix}\in\mathbb R^{(m+n)\times(m+n)}.
$$

For each singular triplet,

$$
H\frac1{\sqrt2}\binom{u_i}{v_i}=\sigma_i\frac1{\sqrt2}\binom{u_i}{v_i},\qquad H\frac1{\sqrt2}\binom{u_i}{-v_i}=-\sigma_i\frac1{\sqrt2}\binom{u_i}{-v_i}.
$$

These identities follow by applying $Av_i=\sigma_i u_i$ to the upper block and $A^Tu_i=\sigma_i v_i$ to the lower block. The factor $1/\sqrt2$ normalises a stacked vector whose squared length is $2$.

For $m\ge n$, complete $U$ with $U_\perp$. Since $A^TU_\perp=0$, the remaining eigenvectors are $\binom{w}{0}$ for columns $w$ of $U_\perp$. A full orthogonal eigenvector matrix is

$$
Q_H=\begin{pmatrix}U/\sqrt2&U/\sqrt2&U_\perp\\V/\sqrt2&-V/\sqrt2&0\end{pmatrix}.
$$

The corresponding eigenvalues are $\sigma_1,\ldots,\sigma_n$, $-\sigma_1,\ldots,-\sigma_n$, and $m-n$ additional zeros. Opposite signs are orthogonal because $(u_i^Tu_j-v_i^Tv_j)/2=0$; within each sign group orthonormality follows by addition instead.

At rank $r$, there are $2r$ nonzero eigenvalues and **$m+n-2r$ zeros**. The extra $m-n$ zeros are not the only zeros when $A$ is rank deficient. For a wide matrix, interchange input and output roles; the total zero count is unchanged.

For complex $A$, replace $A^T$ by $A^*$ to get a Hermitian dilation. This construction turns singular-value questions into Hermitian eigenvalue questions without squaring the singular values, unlike a Gram matrix.

## 4. What is unique in an SVD?

The ordered singular values are unique: their squares are the uniquely determined eigenvalues of the Gram matrix. It is their **squares**, rather than the singular values themselves, that are Gram eigenvalues.

Singular vectors are not generally unique. Their allowable changes depend on the associated singular values.

### A simple positive singular value

If $\sigma_i>0$ is distinct, its real right singular vector is unique up to sign. Once it is chosen, $u_i=Av_i/\sigma_i$ is fixed. Hence

$$
(u_i,v_i)\longmapsto(-u_i,-v_i)
$$

leaves $\sigma_i u_i v_i^T$ unchanged, whereas flipping only one vector changes the term. Over $\mathbb C$, multiply both vectors by the same scalar $e^{\mathrm i\theta}$ of modulus one: the conjugate in $v_i^*$ cancels the phase.

### A repeated positive singular value

Suppose a block of $k$ singular values all equals $\sigma>0$. Let $U_b,V_b$ denote its vector blocks. For any orthogonal $R\in\mathbb R^{k\times k}$,

$$
(U_bR)(\sigma I)(V_bR)^T=\sigma U_bRR^TV_b^T=\sigma U_bV_b^T.
$$

The same rotation must be made on both sides. The associated subspaces are determined, but a particular orthonormal basis within them is not. Distinct singular values cannot generally be mixed by arbitrary rotations while keeping the same diagonal $\Sigma$.

For an orthogonal $A=Q$, all singular values are one. Choose any orthogonal $V$, set $U=QV$, and obtain $U V^T=Q$. For $A=I$, this becomes $U=V$: there are infinitely many valid choices, not just changes of signs.

### Zero singular values

The term $0\,u_i v_i^T$ vanishes. Left and right null-space bases can be chosen independently: there is no positive singular value tying them together. The vectors must still be orthonormal and belong to the appropriate null spaces. Extra full-SVD complement vectors have similar freedom.

This distinction prevents a common mistake: “the left vector determines the right vector” only follows from division by a **positive** singular value.

## 5. Compare decompositions, not their raw columns

Two computed SVDs may have identical singular values and both reconstruct $A$ accurately while reporting different columns. Sign changes are harmless; repeated singular values allow basis rotations. Compare reconstruction errors and the relevant subspaces before declaring a disagreement.

The demonstration lets you rotate a repeated singular subspace together or on just one side. The first operation preserves the matrix; the second generally changes it. This gives a direct test of the coupling in the uniqueness argument.
