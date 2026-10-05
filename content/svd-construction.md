## 1. A coordinate system adapted to a matrix

A matrix can mix coordinates so thoroughly that its action is hard to see from its entries. The **singular value decomposition**, or **SVD**, chooses orthonormal coordinates in the input and output spaces in which the action becomes diagonal: each coordinate is stretched by a nonnegative factor.

You need matrix multiplication, orthonormal bases, eigenvalues, and the Euclidean norm. Recall that a matrix with orthonormal columns preserves the lengths of its input vectors, even when it is rectangular.

For a real symmetric matrix, the spectral theorem gives

$$
A=V\Lambda V^T,\qquad V^TV=VV^T=I.
$$

Its eigenvalues are real and its eigenvectors can be chosen orthonormal. The word *chosen* matters: within a repeated eigenspace, an arbitrary independent basis need not already be orthogonal. A normalised eigenvector can change sign, and a repeated eigenspace admits different orthonormal bases. For the identity, every **nonzero** vector is an eigenvector.

The SVD extends the idea of diagonalising an action to **every** matrix: rectangular or square, singular or nonsingular, real or complex. The input and output bases can be different, so the matrix need not have an eigenbasis.

## 2. The thin singular value decomposition

**SVD theorem.** If $A\in\mathbb R^{m\times n}$ and $m\ge n$, there exist

$$
U\in\mathbb R^{m\times n},\qquad \Sigma=\operatorname{diag}(\sigma_1,\ldots,\sigma_n)\in\mathbb R^{n\times n},\qquad V\in\mathbb R^{n\times n}
$$

such that

$$
A=U\Sigma V^T,\qquad U^TU=V^TV=I_n,\qquad \sigma_1\ge\cdots\ge\sigma_n\ge0.
$$

The $\sigma_i$ are the **singular values**. Columns $u_i$ of $U$ are **left singular vectors**; columns $v_i$ of $V$ are **right singular vectors**. Their lengths are one, including vectors associated with a zero singular value. The rank of $A$ is the number of positive singular values.

For complex matrices, replace transposes by conjugate transposes:

$$
A=U\Sigma V^*,\qquad U^*U=V^*V=I.
$$

The diagonal entries of $\Sigma$ remain real and nonnegative. We will write most derivations in real notation; their complex versions use the same argument with $T$ replaced by $*$.

### Read the product from right to left

Write an input as $x=\sum_i\alpha_i v_i$, so $\alpha=V^Tx$. Then

$$
Ax=\sum_{i=1}^n\sigma_i\alpha_i u_i.
$$

First $V^T$ changes the input coordinates by a rotation or reflection. Next $\Sigma$ stretches or shrinks each coordinate, possibly to zero. Finally $U$ places these coordinates in orthonormal output directions. For a tall matrix this last step embeds an $n$-dimensional coordinate space in $\mathbb R^m$; it is not a square rotation of all of $\mathbb R^m$.

The unit sphere becomes an ellipsoid with semiaxis lengths $\sigma_i$ in directions $u_i$. Zero singular values collapse directions. In two dimensions this is an ellipse, a line segment, or a point.

### An equivalent sum of outer products

Multiplying by columns gives

$$
A=\sum_{i=1}^n\sigma_i u_i v_i^T.
$$

Each nonzero term has rank one. The map $u_i v_i^T$ measures the input component along $v_i$ and places it in direction $u_i$; $\sigma_i$ scales that contribution. Keeping singular values in descending order makes the first term the largest stretch.

## 3. Constructing the SVD from a Gram matrix

Suppose first that $m\ge n$ and $A$ has independent columns. The **Gram matrix** $G=A^TA$ is symmetric positive definite, because

$$
x^TGx=\|Ax\|_2^2>0\quad(x\ne0).
$$

By the spectral theorem, choose an orthogonal $V$ with

$$
A^TA=V\Lambda V^T,\qquad \Lambda=\operatorname{diag}(\lambda_1,\ldots,\lambda_n),\qquad \lambda_i>0.
$$

Order the eigenvalues descending and define $\sigma_i=\sqrt{\lambda_i}$, $\Sigma=\Lambda^{1/2}$, and

$$
U=AV\Sigma^{-1}.
$$

The key check is

$$
U^TU=\Sigma^{-1}V^TA^TAV\Sigma^{-1}=\Sigma^{-1}\Sigma^2\Sigma^{-1}=I.
$$

Thus the columns of $U$ are orthonormal. Finally,

$$
U\Sigma V^T=AV\Sigma^{-1}\Sigma V^T=AVV^T=A.
$$

This proves both existence and the formula for the positive singular values. Simply writing $U=AV\Sigma^{-1}$ is not a proof until orthonormality has been checked.

### What changes if the rank is deficient?

Now $A^TA$ is positive semidefinite. Let its positive eigenvalues be $\lambda_1,\ldots,\lambda_r$. Define $u_i=Av_i/\sigma_i$ for $i\le r$. The same inner-product calculation shows these $r$ vectors are orthonormal.

For $i>r$, $\|Av_i\|_2^2=v_i^TA^TAv_i=0$, so $Av_i=0$. Do **not** divide by $\sigma_i=0$. Instead, complete $u_1,\ldots,u_r$ to an orthonormal set of $n$ vectors in $\mathbb R^m$. This is possible because $m\ge n$. The extra vectors lie perpendicular to the range of $A$ and their terms in $U\Sigma V^T$ vanish. Hence the same factorisation holds.

If $A=0$, every singular value is zero and any compatible orthonormal factors work. Existence of an SVD never requires invertibility.

## 4. Full, thin, and compact forms

For $m\ge n$, complete the thin $U$ to an orthogonal basis $[U,U_\perp]$ of $\mathbb R^m$. Here $U_\perp\in\mathbb R^{m\times(m-n)}$, $U^TU_\perp=0$, and $U_\perp^TU_\perp=I$. Then

$$
A=[U,U_\perp]\begin{pmatrix}\Sigma\\0\end{pmatrix}V^T.
$$

This is the **full SVD**. The zero block is $(m-n)\times n$. Extending an orthonormal set can be done by orthogonalisation; Householder methods provide an efficient construction.

For arbitrary shape, put $p=\min(m,n)$. The full form uses $U_f\in\mathbb R^{m\times m}$, $V_f\in\mathbb R^{n\times n}$ and a rectangular diagonal $\Sigma_f\in\mathbb R^{m\times n}$. Its first $p$ diagonal entries are the singular values. The thin form keeps $p$ columns of each factor and a $p\times p$ diagonal matrix. The **compact SVD** keeps only the $r$ positive singular values and their vectors:

$$
A=U_r\Sigma_r V_r^T.
$$

Thin and compact coincide only at full rank. For a wide matrix, an SVD can be obtained by applying the tall case to $A^T$ and transposing. The full $V_f$ is important when describing all right-null directions.

## 5. A complete rectangular example

Consider

$$
A=\begin{pmatrix}-1&-2\\2&1\\1&0\\0&1\end{pmatrix}.
$$

Its columns have squared length $6$ and inner product $4$, so

$$
A^TA=\begin{pmatrix}6&4\\4&6\end{pmatrix}.
$$

The characteristic polynomial is $(\lambda-6)^2-16=(\lambda-10)(\lambda-2)$. Choose

$$
V=\frac1{\sqrt2}\begin{pmatrix}1&-1\\1&1\end{pmatrix},\qquad\Sigma=\begin{pmatrix}\sqrt{10}&0\\0&\sqrt2\end{pmatrix}.
$$

These eigenvectors solve $(A^TA-\lambda I)v=0$: the eigenproblem is for the **Gram matrix**, not for the rectangular $A$. Multiplication gives

$$
Av_1=\frac1{\sqrt2}(-3,3,1,1)^T,\qquad Av_2=\frac1{\sqrt2}(-1,-1,-1,1)^T.
$$

Dividing by the respective singular values yields

$$
U=\begin{pmatrix}-3/\sqrt{20}&-1/2\\3/\sqrt{20}&-1/2\\1/\sqrt{20}&-1/2\\1/\sqrt{20}&1/2\end{pmatrix}.
$$

Check the squared column lengths: $(9+9+1+1)/20=1$ and $4/4=1$. Their inner product is $(3-3-1+1)/(2\sqrt{20})=0$. Also $U\Sigma=AV$, hence $U\Sigma V^T=A$.

### A proof is not automatically a good numerical algorithm

For this small example, a characteristic polynomial and a Gram matrix are convenient by hand. They are not the general recipe for a large, reliable SVD computation. Polynomial roots are not how large eigenproblems are normally solved. Moreover, forming $A^TA$ squares the ratio of largest to smallest positive singular value and can make small singular values harder to resolve in floating-point arithmetic. Practical SVD algorithms work with orthogonal transformations and specialised eigenvalue methods. The Gram construction here explains why the decomposition exists.
