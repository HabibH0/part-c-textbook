## 1. A triangular form with an orthonormal basis

**Schur's theorem.** Every $A\in\mathbb C^{n\times n}$ admits

$$
A=UTU^*,\qquad U^*U=I,\qquad T\text{ upper triangular}.
$$

Here $U^*$ is the conjugate transpose. A square matrix with $U^*U=I$ is unitary; in real arithmetic the corresponding term is orthogonal. No diagonalizability assumption is needed.

Since $T=U^*AU$ is similar to $A$,

$$
\det(zI-A)=\det(zI-T)=\prod_{j=1}^n(z-t_{jj}).
$$

Thus the eigenvalues, with algebraic multiplicity, are the diagonal entries of $T$. The off-diagonal entries retain information that a diagonal form may be unable to represent.

## 2. The existence proof, step by step

The characteristic polynomial has a complex root, so choose an eigenpair $Av=\lambda_1v$ and normalise $v$ to length one. Extend it to an orthonormal basis and let $U_1=[v,V_\perp]$.

The first column of $U_1^*AU_1$ is

$$
U_1^*Av=\lambda_1U_1^*v=\lambda_1e_1.
$$

All entries below its first diagonal position are therefore zero. Partition the result as

$$
U_1^*AU_1=\begin{pmatrix}\lambda_1&w^*\\0&B\end{pmatrix},\qquad B\in\mathbb C^{(n-1)\times(n-1)}.
$$

Apply the same argument recursively to $B$. By induction there is a unitary $V$ with $V^*BV=T_2$ upper triangular. Embed that change of basis as $W=\operatorname{diag}(1,V)$. Then

$$
W^*U_1^*AU_1W=
\begin{pmatrix}\lambda_1&w^*V\\0&T_2\end{pmatrix}.
$$

The new transformation leaves the already cleared first column unchanged. The matrix on the right is upper triangular, and $U=U_1W$ is unitary. Starting with the trivial $n=1$ case proves the theorem for every $n$.

Equivalently, the embedded transformations satisfy $T=U_{n-1}^*\cdots U_1^*AU_1\cdots U_{n-1}$, with $U=U_1\cdots U_{n-1}$. The order matters. This is an existence argument: it starts by assuming we have found an eigenvector, so it is not yet a numerical algorithm for discovering the spectrum.

## 3. When does triangular become diagonal?

A matrix is **normal** if $A^*A=AA^*$. Normality is preserved by unitary similarity, so $A$ is normal exactly when its Schur factor $T$ is normal.

If $T$ is diagonal, it commutes with its conjugate transpose, proving one direction. For the converse, suppose $T$ is upper triangular and normal. Compare the $(1,1)$ entries of $T^*T$ and $TT^*$:

$$
|t_{11}|^2=\sum_{j=1}^n|t_{1j}|^2.
$$

Every $t_{1j}$ for $j>1$ must vanish. The first row and column now decouple. The remaining lower-right triangular block is normal, so induction shows that it too is diagonal. Hence

$$
T\text{ is diagonal}\quad\Longleftrightarrow\quad A\text{ is normal}.
$$

This includes real symmetric and complex Hermitian matrices, but also unitary matrices and other normal examples. It is not true of every diagonalizable matrix: diagonalizability by a general invertible basis is weaker than diagonalizability by a unitary basis.

## 4. Schur vectors are not all eigenvectors

The identity $AU=UT$ gives

$$
Au_j=\sum_{i=1}^j t_{ij}u_i.
$$

Thus $u_1$ is an eigenvector, and the span of the first $j$ columns is invariant under $A$. Later individual columns need not be eigenvectors because earlier columns can appear in their images.

For example,

$$
T=\begin{pmatrix}2&4\\0&1\end{pmatrix},\qquad U=I.
$$

The vector $e_1$ is an eigenvector with eigenvalue $2$, but $Te_2=(4,1)^T$ is not a multiple of $e_2$. An eigenvector for eigenvalue $1$ is $(-4,1)^T$. These eigenvectors are not orthogonal, although the Schur basis is. If $T=\begin{pmatrix}1&1\\0&1\end{pmatrix}$ instead, only one independent eigenvector exists; Schur form still exists.

## 5. Real Schur form

A real matrix cannot always be made upper triangular by a real orthogonal similarity. A real triangular matrix has real diagonal eigenvalues, so it cannot represent a nonreal conjugate pair.

The real Schur form is **quasi-upper triangular**: it has $1\times1$ real-eigenvalue blocks and $2\times2$ blocks for nonreal pairs along its diagonal, with zero blocks below. For a block

$$
D=\begin{pmatrix}a&b\\c&d\end{pmatrix},\qquad
\lambda_{\pm}=\frac{a+d}{2}\pm\sqrt{\left(\frac{a-d}{2}\right)^2+bc}.
$$

When the expression under the square root is negative, the two roots form a complex conjugate pair. They are straightforward to extract without converting the entire factorisation to complex arithmetic.

The rotation $\begin{pmatrix}0&-1\\1&0\end{pmatrix}$ has eigenvalues $\pm i$. It is already a valid real Schur block and is normal, although this **real block form** is not diagonal. The diagonal-if-normal statement above concerns the complex triangular Schur form.

## 6. Why Schur form is the computational target

Unitary transformations preserve norms. Carefully implemented Schur algorithms can therefore compute an almost unitary basis and a triangular factor that reconstruct a nearby input, giving backward stability. Eigenvalue forward accuracy still depends on spectral conditioning; nonnormal matrices can remain sensitive.

**Optional extension.** If a diagonalization $A=X\Lambda X^{-1}$ is needed and exists, one can start from Schur form and reduce its triangular factor further. Eigenvector solves and block transformations lead to Sylvester equations of the form $T_{11}Z-ZT_{22}=F$. Small spectral separation can make these equations ill-conditioned. The transformations are generally nonunitary and do not inherit the general norm-preserving stability guarantee of Schur reduction. For a defective matrix, a full diagonalization does not exist at all.

The practical lesson is to retain the unitary Schur representation when possible, rather than assuming that a diagonal representation is always available or equally reliable.
