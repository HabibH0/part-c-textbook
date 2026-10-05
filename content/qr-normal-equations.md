## 1. From an orthogonal residual to the normal equations

For full-column-rank $A\in\mathbb R^{m\times n}$, the least-squares residual satisfies $A^T(b-Ax)=0$. Rearranging gives the **normal equations**

$$
(A^TA)x=A^Tb.
$$

These are $n$ equations even when the original problem has many more rows. To connect them explicitly with thin QR, write $A=QR$. Then $A^TA=R^TR$ and $A^Tb=R^TQ^Tb$. Since $R^T$ is nonsingular,

$$
R^TRx=R^TQ^Tb\quad\Longleftrightarrow\quad Rx=Q^Tb.
$$

Thus the normal equations and QR produce the same unique minimiser **in exact arithmetic**. Numerical equality of the algorithms does not follow from algebraic equivalence.

## 2. Why Cholesky is available

The Gram matrix $G=A^TA$ is always symmetric positive semidefinite because

$$
z^TGz=\|Az\|_2^2\ge0.
$$

It is positive definite exactly when $A$ has full column rank: $\|Az\|^2$ then vanishes only at $z=0$. The normal-equations algorithm forms $G$ and $h=A^Tb$, computes $G=R^TR$ by Cholesky, and solves $R^Ty=h$ followed by $Rx=y$.

Exploiting symmetry, forming $G$ costs about $mn^2$ flops. Cholesky adds $n^3/3$, while forming $h$ and the triangular solves are lower order for a single right-hand side. For very tall matrices this can be cheaper than the roughly $2mn^2$ leading work of Householder QR. The comparison depends on shape; the speed advantage is not a stability guarantee.

For the matrix and right-hand side from the previous lesson,

$$
A^TA=\begin{pmatrix}2&1\\1&2\end{pmatrix},\qquad A^Tb=(1,1)^T.
$$

Solving gives $x=(1/3,1/3)^T$, agreeing with QR. The matrix being factored is now the Gram matrix, not the original tall $A$.

## 3. The condition number is squared

Let the singular values of full-column-rank $A$ be $\sigma_1\ge\cdots\ge\sigma_n>0$. The SVD gives

$$
A^TA=V\Sigma^2V^T,
$$

so its eigenvalues are $\sigma_i^2$. Since a positive definite matrix's spectral condition number is its largest eigenvalue divided by its smallest,

$$
\kappa_2(A^TA)=\frac{\sigma_1^2}{\sigma_n^2}=\kappa_2(A)^2.
$$

For example, $\kappa_2(A)=10^4$ becomes $10^8$ in the normal equations. This exact identity is one reason the algorithm can lose much more accuracy. Forming the products and sums also introduces rounding before the solve begins.

Consider

$$
A_\varepsilon=\begin{pmatrix}1&1\\\varepsilon&0\\0&\varepsilon\end{pmatrix},\qquad
A_\varepsilon^TA_\varepsilon=
\begin{pmatrix}1+\varepsilon^2&1\\1&1+\varepsilon^2\end{pmatrix}.
$$

The Gram eigenvalues are $2+\varepsilon^2$ and $\varepsilon^2$. The exact columns remain independent for every $\varepsilon>0$, but if $\varepsilon^2$ is below the precision of adding to $1$, the computed diagonal can round to $1$. The computed Gram matrix then looks singular. This happens for $\varepsilon=10^{-8}$ in ordinary binary64 arithmetic, even though a QR algorithm can still resolve the column difference in this example.

The demonstration forms the actual binary64 Gram matrix and compares its Cholesky outcome with Householder QR. It also displays the exact condition-number formulas. These diagnostics describe this example, not a universal point at which all normal-equation computations fail.

Cholesky can be backward stable for the **formed** positive definite Gram system while the overall normal-equations procedure is not backward stable relative to the original least-squares data $(A,b)$. For reliable general-purpose least squares, avoid squaring the conditioning by using QR or SVD directly.

## 4. Orthogonality characterises best approximation

The same principle applies in an inner-product space. Let $\mathcal P$ be a finite-dimensional linear subspace, let $f$ be the target, and seek $p\in\mathcal P$ minimising $\|f-p\|$. A candidate $p_*$ is the best approximation exactly when

$$
\langle q,f-p_*\rangle=0\qquad\text{for every }q\in\mathcal P.
$$

**Sufficiency and uniqueness.** Every competing element is $p_*+q$ for some $q\in\mathcal P$. Orthogonality gives

$$
\|f-(p_*+q)\|^2=\|f-p_*\|^2+\|q\|^2
\ge\|f-p_*\|^2,
$$

with equality only when $q=0$. Thus $p_*$ is the unique approximating element.

**Necessity.** Fix a direction $q$ and vary $p_*+tq$. Expanding the squared norm yields

$$
\|f-p_*-tq\|^2=\|f-p_*\|^2-2t\langle f-p_*,q\rangle+t^2\|q\|^2
$$

in a real inner-product space. A minimum at $t=0$ forces the linear coefficient to vanish. In a complex space use real variations in both $q$ and $\mathrm i q$. Finite dimensionality ensures a projection exists; no claim of existence for every unclosed infinite-dimensional subspace is needed.

## 5. A function-space example

On real functions over $[-1,1]$, take $\langle f,g\rangle=\int_{-1}^1 f(t)g(t)\,dt$. Approximate $f(t)=t^2$ from $\mathcal P=\operatorname{span}(1,t)$ using $p(t)=a+bt$. Orthogonality to the two basis functions gives

$$
\int_{-1}^1(t^2-a-bt)\,dt=\frac23-2a=0,
$$

$$
\int_{-1}^1t(t^2-a-bt)\,dt=-\frac23b=0.
$$

Hence $p_*(t)=1/3$. The squared error is $\int_{-1}^1(t^2-1/3)^2\,dt=8/45$. This is an integral least-squares problem. Minimising errors at finitely many samples gives a different inner product and need not produce exactly the same coefficients.

## 6. Revisit Cholesky through QR

There is another proof of Cholesky existence. For $A\succ0$, write $A=VD^2V^T$ with positive diagonal $D$, and define the symmetric positive definite square root $B=VDV^T$. Then $A=B^TB$. Factor $B=QR$ to get

$$
A=R^TQ^TQR=R^TR.
$$

Choose positive diagonal by consistent sign changes. Write the first row of $R$ as $r^T$ and the remaining rows as $R_2$. Then

$$
A=rr^T+R_2^TR_2.
$$

Upper triangularity gives a zero first column in $R_2$, so this remainder has a zero first row and column and is positive semidefinite. Its trailing block is positive definite, since the trailing triangular block of nonsingular $R$ is nonsingular. The first row is fixed by $r_1=\sqrt{a_{11}}$ and $r_j=a_{1j}/r_1$, so the rank-one term is precisely the first Cholesky update. This connects the QR existence proof to the positive Schur complements proved directly in the previous chapter.
