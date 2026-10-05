## 1. A family of tractable spectral problems

The methods developed so far belong to a wider family of problems with reliable numerical algorithms. “Tractable” here means that appropriately posed problems of modest dense size—often in the thousands—can be handled by suitable algorithms. It does not mean every problem is well conditioned, every nonlinear equation has finitely many roots, or every size fits in memory.

The following cost models give an orientation. They count leading arithmetic, not seconds, and the vector columns are **additional** work in this particular accounting.

| Problem | Values only | Additional vectors |
| --- | --- | --- |
| Symmetric eigenproblem $Ax=\lambda x$ | approximately $\frac43n^3$ | approximately $9n^3$ |
| General nonsymmetric eigenproblem | approximately $10n^3$ | approximately $15n^3$ |
| Dense SVD, square-like estimate for $m\ge n$ | approximately $\frac83mn^2$ | approximately $20mn^2$ |

The SVD coefficient is a square-like summary, not a uniform rectangular reduction formula. The preceding lesson explains the $4mn^2-\frac43n^3$ reduction count and the alternative $4mn^2$ scale for tall matrices. Similarly, symmetric values plus vectors are often summarised as “about $10n^3$”. Such rounded estimates should not be treated as contradictory exact formulas.

Generalised eigenproblems $Ax=\lambda Bx$ extend the standard case, with a representative QZ scale of $50n^3$. The cost explorer keeps these accounting conventions visible. Increasing dimension is expensive: doubling $n$ multiplies a cubic estimate by eight. Extra structure can matter more than a small improvement in the constant.

## 2. Polynomial eigenvalue problems

A polynomial eigenvalue problem seeks $\lambda$ and $x\ne0$ such that

$$
P(\lambda)x=0,\qquad
P(\lambda)=A_0+\lambda A_1+\cdots+\lambda^k A_k.
$$

The coefficient matrices are given. A quadratic problem has $k=2$, for example

$$
(\lambda^2 A+\lambda B+C)x=0.
$$

This differs from finding eigenvalues of one fixed matrix: the spectral parameter appears in several powers. A regular degree-$k$, size-$n$ polynomial can have up to $nk$ finite eigenvalues counting multiplicity, with infinite eigenvalues possible when the leading coefficient is singular.

One route is **linearisation**: build a larger generalised eigenvalue problem encoding the polynomial. For the quadratic case, set $y=\begin{pmatrix}x\\\lambda x\end{pmatrix}$ and define

$$
\mathcal A=\begin{pmatrix}0&I\\-C&-B\end{pmatrix},
\qquad
\mathcal B=\begin{pmatrix}I&0\\0&A\end{pmatrix}.
$$

Then

$$
\mathcal Ay=\lambda\mathcal By.
$$

The first block row says that the second component of $y$ is $\lambda x$. The second gives $-Cx-\lambda Bx=\lambda^2Ax$, exactly the original equation. Conversely, the first block relation forces this form, and a nonzero finite eigenvector $y$ cannot have $x=0$. Thus finite eigenpairs correspond.

This construction does not require inverting $A$. Singular leading coefficients call for care about infinite eigenvalues and the regularity of the pencil. Linearisation also changes scaling and conditioning, so a small backward error for the larger pencil does not automatically imply the best possible coefficientwise error for the polynomial.

For the scalar example $\lambda^2-3\lambda+2=0$, the linearisation is
$\mathcal A=\begin{pmatrix}0&1\\-2&3\end{pmatrix}$ and $\mathcal B=I$. Its eigenvalues are 1 and 2. The vector $(1,\lambda)^T$ satisfies the corresponding eigenvector equation.

A degree-$k$ problem typically leads to dimension $nk$. An illustrative dense work estimate is $20(nk)^3$ flops. The constant depends on formulation and requested outputs; the essential message is the cubic dependence on the expanded dimension. Doubling the degree can multiply this estimate by eight even with the original matrix size fixed.

## 3. Nonlinear dependence on the eigenvalue

The spectral parameter need not occur polynomially. For instance,

$$
N(\lambda)x=(Ae^\lambda+B)x=0.
$$

One strategy approximates $N$ by a polynomial $P$ on a specified region, then solves $P(\lambda)x=0$. The region and approximation accuracy are part of the problem, not optional implementation details. If $\|N(\lambda)-P(\lambda)\|\le\varepsilon$ there and a unit vector satisfies $P(\lambda)x=0$, then

$$
\|N(\lambda)x\|
=\|(N(\lambda)-P(\lambda))x\|\le\varepsilon.
$$

An approximate polynomial eigenpair has the additional residual of the polynomial solve. This bound concerns residuals; a small eigenvalue error also needs suitable conditioning. Check candidates in the original nonlinear equation, not only in its approximation.

The scalar example $e^\lambda-2=0$ has real solution $\log2$. The linear Taylor approximation $1+\lambda-2=0$ predicts 1, while the quadratic approximation $1+\lambda+\lambda^2/2-2=0$ predicts the positive root $-1+\sqrt3$. Both should be checked by evaluating $e^\lambda-2$. The quadratic's other root need not represent a nearby root of the original equation in the intended region.

Over the complex plane, $e^\lambda=2$ has infinitely many solutions $\log2+2\pi i j$, $j\in\mathbb Z$. A fixed finite-dimensional polynomial approximation is therefore a regional tool, not a way to capture every root globally.

## 4. Nonlinearity in the eigenvector

A further generalisation is

$$
A(x)x=\lambda x.
$$

Now the operator itself depends on the unknown eigenvector. The previous polynomial-in-$\lambda$ linearisation does not directly apply. Scaling $x$ may change $A(x)$, so a normalization such as $\|x\|_2=1$ can be part of the mathematical formulation, not just a reporting convention.

These problems are generally more difficult. There may be several solutions, and an iteration can depend strongly on its starting point. One must specify the function $A(x)$ and use analysis suited to that nonlinearity; the existence of robust QR and QZ solvers does not supply a universal solution.

## 5. Structure and the next change of approach

Sparsity, low rank, symmetry and other structure can often reduce storage and arithmetic beyond the dense estimates. A sparse matrix can have huge dimension yet admit cheap matrix–vector products; a dense linearisation may destroy that advantage.

The natural next question is how to compute only the required information without a complete dense factorisation. Iterative methods, especially Krylov subspace methods, build approximations through repeated inexpensive operations. That is the subject of the next chapter.
