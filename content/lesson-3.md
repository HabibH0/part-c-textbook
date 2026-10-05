## The question: how large is an error?

If an algorithm returns $\widehat x$ in place of $x$, or $\widehat A$ in place of $A$, we need a number describing the discrepancy. A norm supplies that number: $\|x-\widehat x\|$ or $\|A-\widehat A\|$. Different norms measure different aspects of size, so it matters which one you choose.

### Before you begin

You need sums, absolute values, square roots, and orthonormal matrices. We will use the nonnegative singular values $\sigma_i(A)$ as preview notation; Chapter 2 supplies the full SVD theory. Here you will learn every norm and inequality in the review, including why they hold and when equality is possible.

## 1. The three norm axioms

A norm on a real or complex vector space satisfies:

1. **Absolute homogeneity:** $\|\alpha x\|=|\alpha|\,\|x\|$.
2. **Nonnegativity and definiteness:** $\|x\|\ge0$, with equality if and only if $x=0$.
3. **Triangle inequality:** $\|x+y\|\le\|x\|+\|y\|$.

These rules express scaling, distinguish zero from a nonzero vector, and ensure that the size of a sum cannot exceed the sum of the sizes. For complex scalars use the complex modulus. A quantity can look like a size without being a norm: $\sum_i|x_i|^2$ fails homogeneity because scaling by two multiplies it by four.

## 2. Vector norms

For $x\in\mathbb C^n$ and $1\le p<\infty$, define

$$\|x\|_p=\left(\sum_{i=1}^n|x_i|^p\right)^{1/p},\qquad \|x\|_\infty=\max_i|x_i|.$$

The three most frequently used cases are:

- $\|x\|_1=\sum_i|x_i|$: total absolute magnitude.
- $\|x\|_2=(\sum_i|x_i|^2)^{1/2}$: Euclidean length.
- $\|x\|_\infty=\max_i|x_i|$: largest component magnitude.

All satisfy the norm axioms for $p\ge1$. The triangle inequality for general finite $p$ is Minkowski's inequality; for $p=1$ it follows by summing $|x_i+y_i|\le|x_i|+|y_i|$, and for $p=\infty$ by bounding each component by $\|x\|_\infty+\|y\|_\infty$. The $p=2$ case follows from Cauchy–Schwarz below. When a vector norm has no subscript in this course, it means the 2-norm.

### Worked example

For $x=(3,-4,0)^T$, the three norms are $7$, $5$, and $4$. For the complex vector $(1+i,-2)^T$, they are $\sqrt2+2$, $\sqrt6$, and $2$. The square in the Euclidean norm is $|1+i|^2=2$, not $(1+i)^2$.

The unit balls in $\mathbb R^2$ are a diamond for $p=1$, a circle for $p=2$, and an axis-aligned square for $p=\infty$. Use the explorer to see how one vector is measured differently by these boundaries.

## 3. Inner products and Cauchy–Schwarz

For real vectors, $\|x\|_2^2=x^Tx$; for complex vectors the correct formula is $x^*x$. The corresponding Cauchy–Schwarz inequality is

$$|x^*y|\le\|x\|_2\|y\|_2.$$

**Proof.** If $y=0$ the result is immediate. Otherwise choose $c=(y^*x)/(y^*y)$, the coefficient of the orthogonal projection of $x$ onto $y$. Expanding a squared length gives

$$0\le\|x-cy\|_2^2=\|x\|_2^2-\frac{|y^*x|^2}{\|y\|_2^2}.$$

Rearrange and take square roots. Equality holds exactly when $x$ and $y$ are linearly dependent, including the case where one is zero. This argument proves the inequality by minimising a squared distance.

It also proves the Euclidean triangle inequality:

$$\|x+y\|_2^2=\|x\|_2^2+2\operatorname{Re}(x^*y)+\|y\|_2^2\le(\|x\|_2+\|y\|_2)^2.$$

### Unitary invariance

If $U^*U=I$, then

$$\|Ux\|_2^2=x^*U^*Ux=x^*x=\|x\|_2^2.$$

Thus unitary changes of coordinates preserve Euclidean length. The 1- and infinity-norms are not invariant under every rotation: rotating $(1,0)^T$ by $45^\circ$ changes its 1-norm from $1$ to $\sqrt2$. “Unitarily invariant” means invariant under **all** unitary transformations of the required size.

## 4. Comparing vector norms, with equality cases

For $x\in\mathbb C^n$, the following comparisons hold:

$$\frac{\|x\|_2}{\sqrt n}\le\|x\|_\infty\le\|x\|_2,$$
$$\frac{\|x\|_1}{\sqrt n}\le\|x\|_2\le\|x\|_1,$$
$$\frac{\|x\|_1}{n}\le\|x\|_\infty\le\|x\|_1.$$

These are not competing definitions; they tell us how much two legitimate measurements can differ in dimension $n$.

**First line.** If $M=\max_i|x_i|$, then $M^2\le\sum_i|x_i|^2\le nM^2$. Take square roots and rearrange.

**Second line.** Cauchy–Schwarz applied to $(|x_i|)$ and $(1,\ldots,1)$ gives $\|x\|_1\le\sqrt n\|x\|_2$. Also $(\sum_i|x_i|)^2\ge\sum_i|x_i|^2$, because the cross terms are nonnegative.

**Third line.** The largest nonnegative term is no greater than the sum, and the sum is no greater than $n$ times the largest term.

For a **nonzero** vector, every left-hand equality occurs when all component magnitudes are equal. Every right-hand equality occurs when exactly one component is nonzero. The zero vector gives equality throughout. Thus the dimension-dependent factors cannot be reduced for arbitrary vectors.

## 5. Matrix norms: size through action

For $A\in\mathbb C^{m\times n}$, the **induced** matrix $p$-norm is

$$\|A\|_p=\max_{x\ne0}\frac{\|Ax\|_p}{\|x\|_p}=\max_{\|x\|_p=1}\|Ax\|_p.$$

The input norm is on $\mathbb C^n$ and the output norm on $\mathbb C^m$. We exclude zero from the ratio. Homogeneity lets us restrict to the unit sphere, and continuity plus compactness ensures the maximum exists.

Interpretation: this is the **largest amplification factor** the matrix can produce. It immediately implies $\|Ax\|_p\le\|A\|_p\|x\|_p$.

The familiar formulas are

$$\|A\|_1=\max_{1\le j\le n}\sum_{i=1}^m|A_{ij}|\quad\text{(largest absolute column sum)},$$
$$\|A\|_\infty=\max_{1\le i\le m}\sum_{j=1}^n|A_{ij}|\quad\text{(largest absolute row sum)},$$
$$\|A\|_2=\sigma_{\max}(A)\quad\text{(spectral norm)}.$$

For the 1-norm, sum $|(Ax)_i|\le\sum_j|A_{ij}||x_j|$ over $i$, then bound each column sum by the largest. Equality is attained with a coordinate vector selecting a largest column. For the infinity-norm, bound each row by its absolute row sum times $\|x\|_\infty$. Choose phases or signs of $x_j$ to align the entries of a largest row, attaining that bound.

The spectral formula follows from

$$\|Ax\|_2^2=x^*A^*Ax:$$

its maximum on the unit sphere is the largest eigenvalue of the Hermitian positive semidefinite matrix $A^*A$. Taking the square root gives the largest singular value. The full SVD will make this geometry more explicit.

### Worked example: row sums are not column sums

For $A=\begin{pmatrix}1&-2\\3&0\end{pmatrix}$, absolute column sums are $4,2$ and absolute row sums are $3,3$. Hence $\|A\|_1=4$ and $\|A\|_\infty=3$.

Moreover $A^TA=\begin{pmatrix}10&-2\\-2&4\end{pmatrix}$ has eigenvalues $7\pm\sqrt{13}$, so $\|A\|_2=\sqrt{7+\sqrt{13}}$. The largest entry alone does not determine the spectral norm.

## 6. Frobenius and nuclear norms

The **Frobenius norm** treats all matrix entries as one long vector:

$$\|A\|_F=\left(\sum_{i=1}^m\sum_{j=1}^n|A_{ij}|^2\right)^{1/2}.$$

For the worked matrix above it is $\sqrt{14}$. It is not generally the induced 2-norm: $\|I_n\|_2=1$ whereas $\|I_n\|_F=\sqrt n$.

If $r=\min(m,n)$, the **nuclear norm**, also called the **trace norm**, is

$$\|A\|_* =\sum_{i=1}^r\sigma_i(A).$$

For $\operatorname{diag}(3,2)$, the spectral, Frobenius, and nuclear norms are $3$, $\sqrt{13}$, and $5$. Think of these as the infinity-, 2-, and 1-norms of the singular-value list, respectively. The identity $\|A\|_F^2=\sum_i\sigma_i^2$ will follow again from the SVD.

### Why “trace norm”?

For real $A\in\mathbb R^{m\times n}$ with $m\ge n$,

$$\|A\|_*=\max_{Q^TQ=I_n}\operatorname{tr}(Q^TA).$$

Here $Q$ has the same shape as $A$. In the complex case maximise $\operatorname{Re}\operatorname{tr}(Q^*A)$ instead. For wide matrices, use the analogous condition $QQ^*=I_m$, or apply the tall formula to $A^*$. These dimensional conditions matter: a wide matrix cannot have more orthonormal columns than its number of rows.

To see the tall formula, preview a thin SVD $A=U\Sigma V^*$. For any such $Q$, cyclicity of trace gives $\operatorname{tr}(Q^*A)=\operatorname{tr}(V^*Q^*U\Sigma)$. Each diagonal entry of $V^*Q^*U$ has modulus at most one, so its real trace is at most $\sum_i\sigma_i$. The choice $Q=UV^*$ attains that sum. Chapter 2 justifies the existence of the factorisation used here.

All these matrix norms satisfy the norm axioms. For induced norms, use the vector triangle inequality and take a maximum; definiteness follows because a nonzero matrix has a nonzero column. For Frobenius, use the Euclidean norm of its entries. For the nuclear norm, the trace maximum above proves the triangle inequality by bounding the same linear functional separately on each summand; its singular values give definiteness and homogeneity.

## 7. Trace identities and unitary invariance

For square $A$, $\operatorname{tr}(A)=\sum_i A_{ii}$. If $X\in\mathbb C^{m\times n}$ and $Y\in\mathbb C^{n\times m}$, then

$$\operatorname{tr}(XY)=\sum_i\sum_jX_{ij}Y_{ji}=\sum_j\sum_iY_{ji}X_{ij}=\operatorname{tr}(YX).$$

The two products can have **different sizes** and still have equal traces. This allows cyclic rotation of factors in longer compatible products, not arbitrary reordering.

For a rectangular $B$,

$$\|B\|_F^2=\operatorname{tr}(B^*B).$$

Indeed the $j$th diagonal entry of $B^*B$ is the squared length of column $j$. Use $B^TB$ for real matrices; complex matrices require the conjugate transpose.

For square unitary $U\in\mathbb C^{m\times m}$ and $V\in\mathbb C^{n\times n}$,

$$\|UAV\|_2=\|A\|_2,\qquad\|UAV\|_F=\|A\|_F,\qquad\|UAV\|_* =\|A\|_*.$$

The spectral norm is unchanged because $U$ preserves output lengths and $V$ bijects the unit sphere. For Frobenius, apply the trace formula and cyclicity. For nuclear norm, $(UAV)^*(UAV)=V^*A^*AV$ has the same eigenvalues as $A^*A$, so the singular values are unchanged. The matrix 1- and infinity-norms are not generally unitarily invariant.

## 8. Comparing matrix norms

For $A\in\mathbb C^{m\times n}$, the norm comparisons are:

$$\frac{\|A\|_\infty}{\sqrt n}\le\|A\|_2\le\sqrt m\|A\|_\infty,$$
$$\frac{\|A\|_1}{\sqrt m}\le\|A\|_2\le\sqrt n\|A\|_1,$$
$$\|A\|_2\le\|A\|_F\le\sqrt{\min(m,n)}\|A\|_2.$$

**First line.** For $\|x\|_2=1$,

$$\|Ax\|_2\le\sqrt m\|Ax\|_\infty\le\sqrt m\|A\|_\infty\|x\|_\infty\le\sqrt m\|A\|_\infty.$$

For the other direction, each row's 1-norm is at most $\sqrt n$ times its 2-norm, and each row's 2-norm is at most $\|A\|_2$. Take the largest row sum.

**Second line.** Apply the first line to $A^*$, using $\|A^*\|_2=\|A\|_2$ and $\|A^*\|_\infty=\|A\|_1$.

**Third line.** The largest singular value is at most the Euclidean length of the list of singular values, which is at most $\sqrt{\min(m,n)}$ times the largest.

These constants are attained. A single nonzero row of ones attains the left equality in the first line; a single nonzero column of ones attains its right equality. Transpose these examples for the second line. For nonzero $A$, $\|A\|_2=\|A\|_F$ exactly when rank is one. The upper Frobenius bound is an equality when all $\min(m,n)$ singular values are equal and positive. The zero matrix satisfies every equality. These examples explain why the dimensions in the bounds cannot simply be omitted.

## 9. Subordination and products

For compatible $A,B$, induced $p$-norms satisfy

$$\|AB\|_p\le\|A\|_p\|B\|_p.$$

The proof is short: $\|ABx\|_p\le\|A\|_p\|Bx\|_p\le\|A\|_p\|B\|_p\|x\|_p$. Divide by $\|x\|_p$ and maximise. The action bound is called subordination; the product bound is called submultiplicativity.

Being a norm alone does not guarantee the product bound. Define the entrywise max norm by $\|A\|_{\max}=\max_{i,j}|A_{ij}|$. With

$$A=\begin{pmatrix}1&1\end{pmatrix},\qquad B=\begin{pmatrix}1\\1\end{pmatrix},$$

we have $AB=(2)$, so $\|AB\|_{\max}=2>1=\|A\|_{\max}\|B\|_{\max}$. This is a valid norm on entries, but not a subordinate matrix norm. Do not confuse it with the induced infinity-norm, which uses row sums.

## 10. Neumann series: an inverse from a geometric series

The final norm-dependent fact in the review is:

$$\|X\|<1\quad\Longrightarrow\quad (I-X)^{-1}=I+X+X^2+X^3+\cdots,$$

where $X$ is square and the norm is subordinate. This is the matrix counterpart of the scalar geometric series.

**Proof.** Submultiplicativity gives $\|X^j\|\le\|X\|^j$, so the series converges absolutely in this finite-dimensional matrix space. For $S_k=I+X+\cdots+X^k$, telescoping yields

$$(I-X)S_k=S_k(I-X)=I-X^{k+1}.$$

Since $\|X^{k+1}\|\le\|X\|^{k+1}\to0$, passing to the limit proves that the sum is both a left and right inverse. Moreover,

$$\left\|(I-X)^{-1}-S_k\right\|\le\frac{\|X\|^{k+1}}{1-\|X\|}.$$

The strict inequality is a sufficient condition, not a necessary condition for invertibility. For $X=2I$, $I-X=-I$ is invertible although this series diverges. For a nilpotent $X$ with $X^2=0$, the series terminates even if $\|X\|$ exceeds one. Distinguish an inverse existing from this particular convergence test succeeding.

### Worked example

For $X=\operatorname{diag}(1/2,1/4)$, $\|X\|_2=1/2$, and $(I-X)^{-1}=\operatorname{diag}(2,4/3)$. The partial sum through $X^3$ is $\operatorname{diag}(15/8,85/64)$. Its spectral error is $1/8$, equal to the bound $(1/2)^4/(1-1/2)=1/8$.

## What to carry forward

Always name the norm and track dimensions. Induced norms measure amplification; Frobenius measures all entries together; nuclear norm sums singular values. Norm inequalities let you transfer bounds between measurements, while submultiplicativity controls products and underpins the Neumann series.
