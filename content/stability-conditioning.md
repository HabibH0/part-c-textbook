## 1. The matrix condition number

For $A\in\mathbb R^{m\times n}$ with $m\ge n$ and full column rank, define

$$
\kappa_2(A)=\frac{\sigma_1(A)}{\sigma_n(A)}\ge1.
$$

For a nonzero rank-deficient matrix we use $\kappa_2(A)=\infty$. When $A$ is square and nonsingular, its SVD gives

$$
\|A\|_2=\sigma_1(A),\qquad \|A^{-1}\|_2=\frac1{\sigma_n(A)},\qquad
\kappa_2(A)=\|A\|_2\|A^{-1}\|_2.
$$

The ratio compares the strongest and weakest singular directions. Orthogonal matrices have condition number $1$. Multiplying a matrix by a nonzero scalar changes neither this ratio nor its conditioning in this sense. A very small matrix norm alone is not evidence of ill-conditioning.

## 2. A finite perturbation bound for a solve

Suppose $A$ is square and nonsingular, $Ax=b$ with $x\ne0$, and a computed answer satisfies

$$
(A+\Delta A)\widehat x=b,\qquad
\|\Delta A\|_2\le\varepsilon\|A\|_2.
$$

Set $E=A^{-1}\Delta A$ and $t=\varepsilon\kappa_2(A)$. If $t<1$, then $\|E\|_2\le t<1$. The Neumann series proves that $I+E$ is invertible and

$$
(I+E)^{-1}=I-E+E^2-E^3+\cdots,\qquad
\|(I+E)^{-1}\|_2\le\frac1{1-\|E\|_2}.
$$

Since $A+\Delta A=A(I+E)$, it follows that

$$
\widehat x=(I+E)^{-1}x,\qquad
\widehat x-x=-(I+E)^{-1}Ex.
$$

Take norms and divide by $\|x\|_2$ to obtain the rigorous estimate

$$
\frac{\|\widehat x-x\|_2}{\|x\|_2}
\le\frac{t}{1-t}
=\frac{\varepsilon\kappa_2(A)}{1-\varepsilon\kappa_2(A)}.
$$

This bound does not promise accuracy when $t$ approaches $1$. If $t\ge1$, this argument supplies no finite bound; it does not assert that every actual answer is wrong.

## 3. The first-order theorem

If $\varepsilon\kappa_2(A)\ll1$, expand the Neumann series only to first order:

$$
\widehat x=x-A^{-1}\Delta A\,x+r,\qquad
\frac{\|r\|_2}{\|x\|_2}\le\frac{\|E\|_2^2}{1-\|E\|_2}.
$$

Consequently

$$
\frac{\|\widehat x-x\|_2}{\|x\|_2}
\le\varepsilon\kappa_2(A)+O\!\left((\varepsilon\kappa_2(A))^2\right).
$$

For a fixed matrix this is often written $\varepsilon\kappa_2(A)+O(\varepsilon^2)$. That abbreviated remainder is not uniform over increasingly ill-conditioned matrices. The explicit version shows precisely what must be small.

For example, with $\kappa_2(A)=100$ and $\varepsilon=10^{-6}$, $t=10^{-4}$ and the rigorous bound is approximately $0.00010001$. If $\kappa_2(A)=10^{15}$ at double-precision roundoff, $t$ is around $0.1$; visible errors are compatible with backward stability.

If the right-hand side also changes, write $(A+\Delta A)\widehat x=b+\Delta b$. The same rearrangement gives

$$
\frac{\|\widehat x-x\|_2}{\|x\|_2}
\le\frac{\kappa_2(A)}{1-\kappa_2(A)\eta_A}(\eta_A+\eta_b),
\quad
\eta_A=\frac{\|\Delta A\|_2}{\|A\|_2},\quad
\eta_b=\frac{\|\Delta b\|_2}{\|b\|_2},
$$

provided $b\ne0$ and $\kappa_2(A)\eta_A<1$. Here we used $\|b\|_2\le\|A\|_2\|x\|_2$.

## 4. Explain the opening example

For $A=U\operatorname{diag}(1,10^{-15})$ with orthogonal $U$, the singular values are $1$ and $10^{-15}$, hence $\kappa_2(A)=10^{15}$. The two entries of $b$ are $(1+10^{-15})/\sqrt2$ and $(1-10^{-15})/\sqrt2$.

An absolute disturbance of about $10^{-16}$ in their difference can become an error of order $10^{-1}$ after division by $10^{-15}$. Thus an output such as $(1,0.94206)^T$ does not contradict a stable solve. To judge the computation, inspect the residual and its scale rather than declaring instability from forward error alone.

For any proposed nonzero $\widehat x$, let $r=b-A\widehat x$. The matrix

$$
\Delta A=\frac{r\widehat x^T}{\|\widehat x\|_2^2}
$$

satisfies $\Delta A\widehat x=r$, so $(A+\Delta A)\widehat x=b$. Its spectral norm is $\|r\|_2/\|\widehat x\|_2$. No smaller norm can work, because $\|r\|_2\le\|\Delta A\|_2\|\widehat x\|_2$. Therefore the smallest **unstructured, matrix-only** relative backward error is

$$
\eta_A=\frac{\|b-A\widehat x\|_2}{\|A\|_2\|\widehat x\|_2}.
$$

This is not the same formula as a componentwise or structure-preserving backward error. A residual computed in working precision also has its own rounding error.

## 5. Well-conditioned values can have sensitive vectors

A backward stable method for a linear system with $\kappa_2(A)\approx1$ gives relative accuracy close to working precision, apart from dimension factors. Weyl's bounds give another useful form of good conditioning:

$$
|\lambda_i(A+E)-\lambda_i(A)|\le\|E\|_2
\quad\text{for symmetric }A,E,
$$

$$
|\sigma_i(A+E)-\sigma_i(A)|\le\|E\|_2
\quad\text{for arbitrary compatible matrices}.
$$

These are **absolute** sensitivity bounds. A backward error $O(u\|A\|_2)$ yields eigenvalue or singular-value absolute errors of that scale. A tiny or zero value need not have a small relative error.

Eigenvectors and singular vectors can be much more sensitive. At the identity, every direction is an eigenvector; an arbitrarily small symmetric perturbation can select completely different orthonormal directions. Gaps between eigenvalues, rather than just matrix norms, govern vector and subspace sensitivity. The optional Davis–Kahan viewpoint describes angles between invariant subspaces in terms of perturbation size divided by spectral separation. No such angle bound is asserted when the required gap vanishes.
