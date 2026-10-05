## 1. Positive definiteness gives a special factorisation

A real symmetric matrix is **positive definite**, written $A\succ0$, when $x^TAx>0$ for every nonzero $x$. Equivalently, all its eigenvalues are positive. Positive semidefinite means $x^TAx\ge0$, written $A\succeq0$, and permits zero eigenvalues. Positive definite matrices form a particularly rich and useful class; their structure supports stronger algorithms and proofs than symmetry alone.

For $A\succ0$, the **Cholesky factorisation** is

$$
A=R^TR,
$$

with $R$ upper triangular and positive diagonal. Equivalently $A=CC^T$ with $C=R^T$ lower triangular. We will construct $C$ to connect with the outer-product picture, then transpose it to obtain $R$. The diagonal is generally **not** one.

For complex Hermitian positive definite matrices, replace transposes by adjoints: $A=R^*R$. Positivity is still a real condition on $x^*Ax$.

## 2. A symmetric rank-one update

Partition a real symmetric matrix as

$$
A=\begin{pmatrix}a&c^T\\c&B\end{pmatrix}.
$$

Positive definiteness implies $a=e_1^TAe_1>0$, so its positive square root exists. Choose

$$
w=\begin{pmatrix}\sqrt a\\c/\sqrt a\end{pmatrix}.
$$

Then

$$
A=ww^T+\begin{pmatrix}0&0\\0&S\end{pmatrix},\qquad
S=B-\frac{cc^T}{a}.
$$

The left and right rank-one factors are transposes of each other. This differs from unit-diagonal LU, whose factors $\ell_1=(1,c/a)^T$ and $u_1^T=(a,c^T)$ have different scalings. To obtain Cholesky, split the positive pivot into two square roots; one cannot simply declare the old unit-diagonal factors equal.

## 3. Why every remaining pivot stays positive

The important claim is that the **active trailing block** $S$ is positive definite. The full padded residual has leading zeros and is only positive semidefinite.

For any nonzero $z\in\mathbb R^{n-1}$, choose

$$
x=\begin{pmatrix}-c^Tz/a\\z\end{pmatrix}\ne0.
$$

Expand the quadratic form:

$$
x^TAx
=a\left(\frac{c^Tz}{a}\right)^2
-2\frac{(c^Tz)^2}{a}+z^TBz
=z^T\left(B-\frac{cc^T}{a}\right)z=z^TSz.
$$

The left side is positive, hence $S\succ0$. Repeating this argument proves that every pivot is positive in exact arithmetic and no row pivoting is needed. Assemble the padded columns $w_1,\ldots,w_n$ into $C$; then

$$
A=\sum_{j=1}^n w_jw_j^T=CC^T=R^TR.
$$

This proves existence constructively, without assuming uniqueness first. The factor with positive diagonal is also unique. If $R^TR=\widetilde R^T\widetilde R$, set $W=\widetilde R R^{-1}$. It is upper triangular and satisfies $W^TW=I$. An upper triangular orthogonal matrix must be diagonal with entries $\pm1$; positivity of its diagonal forces $W=I$. Thus $R=\widetilde R$.

## 4. The algorithm and a worked example

For a lower triangular factor $C$, compute columns in order. At column $j$,

$$
c_{jj}=\sqrt{a_{jj}-\sum_{k=1}^{j-1}c_{jk}^2},
$$

and, for each $i>j$,

$$
c_{ij}=\frac{a_{ij}-\sum_{k=1}^{j-1}c_{ik}c_{jk}}{c_{jj}}.
$$

Earlier columns supply all terms on the right. The square-root argument is the active pivot, known to be positive for an exactly positive definite input.

Consider

$$
A=\begin{pmatrix}4&2&2\\2&5&3\\2&3&6\end{pmatrix}.
$$

The first column is $(2,1,1)^T$. Subtracting its outer product leaves the active block $\begin{pmatrix}4&2\\2&5\end{pmatrix}$. The next padded column is $(0,2,1)^T$, leaving the final pivot $4$. The last column is $(0,0,2)^T$. Therefore

$$
C=\begin{pmatrix}2&0&0\\1&2&0\\1&1&2\end{pmatrix},\qquad
R=\begin{pmatrix}2&1&1\\0&2&1\\0&0&2\end{pmatrix}.
$$

For $b=(10,15,14)^T$, solve $R^Ty=b$ and then $Rx=y$. Forward substitution gives $y=(5,5,2)^T$, and back substitution gives $x=(1,2,1)^T$. This is the same two-triangular-solve pattern as LU, with only one triangular factor to store.

## 5. Cost and numerical behaviour

The Schur complement is symmetric, so only one triangle needs updating. For an active trailing block of size $q$, there are $q(q+1)/2$ distinct entries, each requiring a multiplication and subtraction. Summing over steps gives leading cost

$$
\sum_{q=1}^{n-1}q(q+1)=\frac13n^3+O(n^2).
$$

Square roots and divisions do not change the leading cubic term. This is half the leading factorisation cost of general LU. Solving with the factor still costs $O(n^2)$ per right-hand side.

Standard Cholesky is backward stable for positive definite problems when it completes under the usual floating-point assumptions. Close to the semidefinite boundary, rounding may turn a tiny positive active pivot into a nonpositive computed quantity. A failed numerical square root is therefore not, by itself, an exact-arithmetic certificate about an uncertain input. Check symmetry, scaling, and how accurately the matrix is specified; do not silently replace a negative pivot by its absolute value.

## 6. Semidefinite matrices: existence is broader than this algorithm

A real matrix can be written as $A=R^TR$ for some square $R$ **if and only if** it is symmetric positive semidefinite.

The forward direction follows from $x^TAx=\|Rx\|_2^2\ge0$ and symmetry. For the converse, use the spectral theorem $A=Q\Lambda Q^T$ with nonnegative diagonal $\Lambda$ and set $F=\Lambda^{1/2}Q^T$. Then $F^TF=A$. To obtain an upper triangular factor as well, a full QR factorisation $F=ZT$ gives $A=T^TT$; this also works when $F$ is singular. QR will be developed in the next chapter.

This existence statement does not justify dividing by a zero pivot in the positive-definite algorithm. For $A=\operatorname{diag}(0,1)$, the factor $R=\operatorname{diag}(0,1)$ exists, but the first ordinary column update encounters a zero divisor. Semidefinite variants must handle such cases explicitly. The positive-diagonal uniqueness statement also cannot be applied unchanged to a singular factor.

## 7. Symmetric indefinite systems and LDL*

If a symmetric or Hermitian matrix has a negative eigenvalue, it cannot be $R^*R$: that product has no negative quadratic directions. Instead use a symmetric factorisation of the form

$$
PAP^*=LDL^*,
$$

where $L$ is unit lower triangular and $D$ is Hermitian block diagonal, with blocks of size one or two. In the real case this is commonly called **LDLᵀ factorisation**. A symmetric permutation preserves symmetry; ordinary row-only pivoting would not.

When suitable nonzero scalar pivots exist, $D$ can be diagonal and a permutation may be unnecessary. A universal claim of a diagonal $D$ with unit triangular $L$ would be too strong. For $A=\begin{pmatrix}0&1\\1&0\end{pmatrix}$, a first scalar pivot is zero even though $A$ is nonsingular. Taking the whole matrix as one $2\times2$ block in $D$ and $L=I$ works immediately. Block pivots may be needed for both real symmetric and complex Hermitian matrices.

These structured methods exploit symmetry to reduce storage and, roughly, halve dense factorisation work compared with a general system. Positive definiteness gives the simpler Cholesky case: positive square roots, no pivoting in exact arithmetic, and a unique factor with positive diagonal. Symmetry alone does not provide those guarantees.
