## 1. Two matrices define one spectral problem

A **generalised eigenvalue problem** asks for $\lambda$ and $x\ne0$ satisfying

$$
Ax=\lambda Bx,\qquad A,B\in\mathbb C^{n\times n}.
$$

Both matrices are given. Problems with two quadratic forms, such as stiffness and mass in a vibration model, naturally have this shape. Setting $B=I$ recovers the standard problem.

For finite $\lambda$, a nonzero solution exists exactly when $A-\lambda B$ is singular:

$$
\det(A-\lambda B)=0.
$$

The matrix-valued expression $A-\lambda B$ is a **matrix pencil**. A pencil is regular if this determinant polynomial is not identically zero. For nonsingular $B$ its degree is $n$, so it has $n$ finite roots over $\mathbb C$, counted with multiplicity. If $B$ is singular, a regular pencil may have fewer finite roots; the remaining eigenvalues are at infinity in a homogeneous representation.

For example, $A=\operatorname{diag}(2,3)$ and $B=\operatorname{diag}(1,0)$ give $\det(A-\lambda B)=3(2-\lambda)$. There is one finite eigenvalue, 2, and one infinite eigenvalue. If instead $A=B=\operatorname{diag}(1,0)$, the determinant is zero for every $\lambda$. This is a singular pencil, requiring more analysis than a list of $n$ ordinary ratios.

## 2. Why not just invert B?

When $B$ is invertible,

$$
B^{-1}Ax=\lambda x.
$$

This is an algebraic reduction, but explicitly forming $B^{-1}A$ can introduce unnecessary cost, rounding and loss of structure. It also excludes singular $B$. A method that works directly with the pair can control perturbations to the original $A$ and $B$ rather than to an already formed product.

Even if $A$ and $B$ are symmetric, $B^{-1}A$ need not look symmetric in ordinary Euclidean coordinates. It is a mistake to conclude from its nonsymmetric appearance that the eigenvalues must be complex.

## 3. The symmetric positive-definite case

Suppose $A=A^T$ and $B=B^T$ is positive definite. Write its Cholesky factorisation as $B=CC^T$, with $C$ nonsingular lower triangular, and set $y=C^Tx$. Multiplying by $C^{-1}$ gives

$$
\underbrace{C^{-1}AC^{-T}}_{S}y=\lambda y.
$$

The matrix $S$ is symmetric because $S^T=C^{-1}A^TC^{-T}=S$. Therefore every generalised eigenvalue is real. The inverse symbols describe transformations; triangular solves implement them.

If $y_i$ are orthonormal eigenvectors of $S$, recover $x_i=C^{-T}y_i$. They obey

$$
x_i^TBx_j=y_i^Ty_j=\delta_{ij}.
$$

The natural orthogonality is measured in the $B$ inner product. The same real-eigenvalue fact follows for any eigenvector from

$$
\lambda=\frac{x^*Ax}{x^*Bx},
$$

whose numerator is real and denominator positive. If $B$ is merely symmetric but indefinite, that argument fails: with
$A=\begin{pmatrix}0&1\\1&0\end{pmatrix}$ and
$B=\operatorname{diag}(1,-1)$, the eigenvalues are $\pm i$.

The demonstration varies a positive diagonal $B$ and a symmetric $A$. It computes the symmetric transformed matrix, eigenvalues, recovered eigenvectors, original-pencil residuals, and $B$-orthogonality.

## 4. Generalised Schur form and QZ

The **QZ algorithm** extends QR to a pair. In a common convention it seeks unitary $Q,Z$ such that

$$
S=Q^*AZ,\qquad T=Q^*BZ
$$

are upper triangular. Writing a unitary left factor directly as $Q_{\rm left}$ instead of $Q^*$ is an equivalent convention. The two-sided transformation is the same for both members of the pair, although its left and right factors need not be each other's adjoints.

Indeed

$$
S-\lambda T=Q^*(A-\lambda B)Z.
$$

Its determinant differs from the original by a nonzero constant. Thus it has the same finite eigenvalues. Since it is triangular,

$$
\det(S-\lambda T)=\prod_{i=1}^n(s_{ii}-\lambda t_{ii}).
$$

When $t_{ii}\ne0$, the corresponding eigenvalue is $s_{ii}/t_{ii}$. More generally store a pair $(\alpha_i,\beta_i)=(s_{ii},t_{ii})$: $\beta_i=0,\alpha_i\ne0$ represents infinity without division. A $0/0$ pair is indeterminate and must not be silently assigned a finite value. Real implementations use quasi-triangular blocks for complex conjugate pairs.

Diagonal ratios give eigenvalues, not generally the eigenvectors themselves. For a finite eigenvalue, solve $(S-\lambda T)y=0$ using the triangular structure and recover $x=Zy$. Arbitrary columns of $Z$ are Schur vectors and need not individually be eigenvectors.

## 5. The algorithmic outline

First reduce the pair to **Hessenberg–triangular form**: the first matrix is upper Hessenberg and the second upper triangular. For example, a QR factorisation of $B$ supplies an initial left transformation that triangularises it. Further coordinated left/right transformations reduce $A$ while maintaining triangular structure in $B$.

Then apply shifted structured QZ sweeps and deflation. For invertible $B$, the relation to QR can be seen from

$$
T^{-1}S
=(Q^*BZ)^{-1}(Q^*AZ)
=Z^*B^{-1}AZ.
$$

So the pair transformations implicitly act on the ordinary eigenproblem for $B^{-1}A$, without explicitly forming the inverse or product. This identity explains the connection; QZ works on the pair and can also handle regular pencils with singular $B$.

A representative dense cost is about $50n^3$ flops, with actual constants depending on arithmetic, convergence and requested vectors. Reliable QZ implementations provide a backward-error interpretation in terms of nearby matrix pairs. This does not guarantee small forward error for a sensitive or nearly singular pencil.

The second part of the explorer changes a diagonal entry of $B$ through zero, displaying homogeneous eigenvalue pairs. It illustrates finite, infinite and indeterminate values directly; it does not claim to implement a production QZ iteration.
