## The question: what can the shape of a matrix tell us?

Two matrices of the same size can behave very differently. Symmetry gives real eigenvalues and orthogonal eigendirections. Triangularity makes systems easier to solve. Sparsity can make an enormous matrix affordable to use. A good numerical method notices structure before doing arithmetic.

### Before you begin

Review transpose, conjugate transpose, linear independence, and the invertibility equivalences from Lesson 1. You should be able to check $Ax=\lambda x$ by multiplication.

This lesson covers matrix structures, eigenvalues, subspaces, the subspace intersection lemma and its proof, and elementary matrix identities. Norm-dependent identities are completed in Lesson 3.

## 1. A catalogue of useful structure

### Symmetric and Hermitian

A real square matrix is **symmetric** when $A^T=A$, or $A_{ij}=A_{ji}$. The complex counterpart is **Hermitian**: $A^*=A$, or $A_{ij}=\overline{A_{ji}}$.

The most important fact is the spectral theorem:

$$A=V\Lambda V^T,\qquad V^TV=VV^T=I,\qquad \Lambda=\operatorname{diag}(\lambda_1,\ldots,\lambda_n)$$

for real symmetric $A$. Its eigenvalues are real, and its eigenvectors can be chosen to form an orthonormal basis. In the Hermitian case, replace $V^T$ by $V^*$. This is much stronger than merely having eigenvalues.

**Positive definite** means symmetric/Hermitian with every eigenvalue positive; **positive semidefinite** permits zero eigenvalues. Equivalently,

$$A\succ0\iff x^*Ax>0\text{ for all }x\ne0,\qquad A\succeq0\iff x^*Ax\ge0\text{ for all }x.$$

To see the equivalence, set $z=V^*x$. Then $x^*Ax=\sum_i\lambda_i|z_i|^2$. Positive diagonal entries alone do not imply positive definiteness: $\begin{pmatrix}1&2\\2&1\end{pmatrix}$ has eigenvalues $3,-1$.

### Orthogonal, unitary, and orthonormal columns

A real square matrix is **orthogonal** when $Q^TQ=QQ^T=I$. Its complex counterpart is **unitary**, with $Q^*Q=QQ^*=I$. For a square matrix, either equality implies the other by the one-sided inverse argument.

A rectangular matrix $Q\in\mathbb C^{m\times n}$ has **orthonormal columns** when $Q^*Q=I_n$. Necessarily $m\ge n$. Such a matrix is sometimes called an “orthonormal matrix”; this means orthonormal columns, not necessarily a square matrix.

For a tall matrix, $QQ^*$ is generally **not** the identity. For example,

$$Q=\begin{pmatrix}1&0\\0&1\\0&0\end{pmatrix},\quad Q^TQ=I_2,\quad QQ^T=\operatorname{diag}(1,1,0).$$

The last matrix projects onto the plane spanned by the columns of $Q$.

### Skew-symmetric, skew-Hermitian, and normal

**Skew-symmetric** means $A^T=-A$; **skew-Hermitian** means $A^*=-A$. A real skew-symmetric matrix has zero diagonal. In the complex case, skew-Hermitian diagonal entries can be purely imaginary.

A complex square matrix is **normal** when $A^*A=AA^*$. Precisely the normal matrices admit a unitary diagonalisation:

$$A=U\Lambda U^*,\qquad U^*U=I,$$

with diagonal $\Lambda$. Hermitian and unitary matrices are examples. For real matrices, normality reads $A^TA=AA^T$, but a real orthogonal diagonalisation need not exist: the $90^\circ$ rotation is normal and has complex eigenvalues. This is why the complex formulation is the right general statement.

### Triangular, tridiagonal, and Hessenberg

- **Upper triangular:** $A_{ij}=0$ whenever $i>j$; everything below the diagonal is zero.
- **Lower triangular:** $A_{ij}=0$ whenever $i<j$.
- **Tridiagonal:** $A_{ij}=0$ whenever $|i-j|>1$; only the diagonal and its two neighbours may be nonzero.
- **Upper Hessenberg:** $A_{ij}=0$ whenever $i>j+1$; one subdiagonal is allowed below the diagonal. The condition also makes sense for rectangular matrices.

Every upper triangular matrix is upper Hessenberg. A symmetric upper Hessenberg matrix is tridiagonal: symmetry forces zeros above the first superdiagonal as well. Hessenberg structure becomes central in eigenvalue and Krylov algorithms later.

### Sparse and dense

A matrix is **sparse** when most entries are zero; $\operatorname{nnz}(A)$ counts its nonzero entries. Otherwise it is called dense. There is no universal numerical threshold in this definition. Sparsity is about the entries that actually occur, and efficient storage and algorithms must exploit it to obtain a benefit.

Other matrix structures include Hankel, Toeplitz, circulant, and symplectic matrices: Toeplitz matrices are constant along diagonals, Hankel matrices along anti-diagonals, circulant rows are cyclic shifts, and symplectic matrices preserve a specified nondegenerate skew-symmetric bilinear form. No additional theory of these classes is required here.

## 2. Eigenvalues: the basic facts

An $n\times n$ matrix has $n$ complex eigenvalues **counted with algebraic multiplicity**. This does not promise $n$ linearly independent eigenvectors.

For example, $J=\begin{pmatrix}1&1\\0&1\end{pmatrix}$ has characteristic polynomial $(\lambda-1)^2$, but $(J-I)x=0$ forces $x_2=0$. Its eigenspace has dimension one, so it is not diagonalisable. Repeated eigenvalues alone are not the problem: the identity matrix also has a repeated eigenvalue and has a full eigenbasis.

### Worked example

Let

$$A=\begin{pmatrix}2&1&1\\1&2&1\\1&1&2\end{pmatrix}=I+\mathbf1\mathbf1^T,\qquad\mathbf1=(1,1,1)^T.$$

Each row sums to four, so $A\mathbf1=4\mathbf1$. If $\mathbf1^Tx=0$, then $Ax=x+\mathbf1(\mathbf1^Tx)=x$. Thus the remaining eigenspace is the plane whose coordinates sum to zero, and it has eigenvalue one.

In particular, $(1,-1,0)^T$ and $(0,1,-1)^T$ are eigenvectors for $\lambda=1$. These two vectors are independent but not orthogonal. The spectral theorem says an orthonormal choice **exists**, not that any pair of eigenvectors you write down is already orthogonal. One orthonormal eigenbasis is

$$v_1=\frac{1}{\sqrt3}(1,1,1)^T,\quad v_2=\frac{1}{\sqrt2}(1,-1,0)^T,\quad v_3=\frac{1}{\sqrt6}(1,1,-2)^T.$$

With $V=[v_1,v_2,v_3]$, we obtain $A=V\operatorname{diag}(4,1,1)V^T$.

### Characteristic polynomials and numerical computation

The eigenvalues are the roots of

$$p_A(\lambda)=\det(\lambda I-A)=\prod_{i=1}^n(\lambda-\lambda_i).$$

Why? $\lambda$ is an eigenvalue exactly when $(\lambda I-A)x=0$ has a nonzero solution, equivalently when $\lambda I-A$ is singular.

General polynomial equations of degree at least five have no universal solution formula using radicals. Therefore there is no such universal formula for eigenvalues of arbitrary matrices of size five or larger. This **does not** say that every such matrix lacks exactly computable eigenvalues: diagonal matrices are an immediate counterexample. Nor does it prevent accurate numerical approximations. Later algorithms, including QR iteration, compute eigenvalues numerically without relying on a general radicals formula.

## 3. Subspaces: sets of possible linear combinations

A subspace $S\subseteq\mathbb R^n$ contains zero and is closed under addition and scalar multiplication. If independent vectors $v_1,\ldots,v_d$ form a basis, then

$$S=\left\{\sum_{i=1}^d c_i v_i:c_i\in\mathbb R\right\}.$$

The number $d$ is the dimension. Dependent spanning vectors are allowed, but then their number is not the dimension; remove redundant vectors to obtain a basis. The zero subspace has dimension zero.

Collecting basis vectors into a tall matrix $V=[v_1,\ldots,v_d]\in\mathbb R^{n\times d}$ gives the convenient representation

$$S=\operatorname{span}(V)=\{Vc:c\in\mathbb R^d\}.$$

Different bases can describe the same subspace. Replacing $V$ by $VR$ with invertible $R\in\mathbb R^{d\times d}$ changes coordinates, but not the set of possible vectors. An orthonormal basis $Q$ is particularly convenient: $Q^TQ=I$ and a vector $x\in S$ has coordinates $Q^Tx$. QR factorisation will later construct such a basis systematically; there is no loss of generality in using one.

### Worked example: coordinates and projection

For $S=\{(a,b,0)^T:a,b\in\mathbb R\}$, take the two-column matrix $Q$ from the earlier example. A vector $(3,-2,0)^T$ has coordinates $(3,-2)^T$. A vector $z=(3,-2,5)^T$ is not in $S$, but $QQ^Tz=(3,-2,0)^T$ is its orthogonal projection. The discarded part $(0,0,5)^T$ is perpendicular to both basis vectors.

## 4. Subspace intersection lemma: sufficiently large subspaces must overlap

**Statement.** Let $V_1\in\mathbb R^{n\times d_1}$ and $V_2\in\mathbb R^{n\times d_2}$ each have independent columns. If $d_1+d_2>n$, then $\operatorname{span}(V_1)$ and $\operatorname{span}(V_2)$ have a nonzero vector in common.

**Intuition.** Two planes through the origin in three dimensions cannot meet only at zero. Together they have more basis directions than the ambient space can accommodate independently.

**Proof, with the nonzero step made explicit.** Form

$$M=[V_1,V_2]\in\mathbb R^{n\times(d_1+d_2)}.$$

There are more columns than rows, so rank–nullity gives a nonzero null vector. Write it as $c=(c_1^T,-c_2^T)^T$. Then

$$Mc=0\quad\Longrightarrow\quad V_1c_1=V_2c_2=:x.$$

This vector lies in both subspaces. It remains to check that it is **not zero**. If $x=0$, column independence of each $V_i$ implies $c_1=c_2=0$, contradicting $c\ne0$. Thus the common vector is nonzero, as required. The same proof works over $\mathbb C$.

The strict inequality matters. In $\mathbb R^2$, the two coordinate axes have dimensions summing to two but intersect only at zero. More generally, the dimension formula gives $\dim(S_1\cap S_2)\ge d_1+d_2-n$; the lemma is the special case where this lower bound is positive.

## 5. Matrix identities that save work—and prevent mistakes

### Reversing the order

For compatible matrices,

$$ (AB)^T=B^TA^T,\qquad (AB)^*=B^*A^*.$$

The $(i,j)$ entry on either side is the same sum: $(AB)^T_{ij}=\sum_k A_{jk}B_{ki}$. The reversal is essential. Likewise, if square $A,B$ are invertible,

$$(AB)^{-1}=B^{-1}A^{-1},$$

because $(AB)(B^{-1}A^{-1})=I$ and the reverse product is also $I$. For square matrices, $AB=I$ already implies $BA=I$; revisit the injectivity argument in Lesson 1. For rectangular matrices, this implication can fail.

### A block inverse you can check directly

For any $X\in\mathbb R^{m\times n}$,

$$\begin{pmatrix}I_m&X\\0&I_n\end{pmatrix}^{-1}=\begin{pmatrix}I_m&-X\\0&I_n\end{pmatrix}.$$

Block multiplication gives identity diagonal blocks and off-diagonal block $-X+X=0$. No inverse of $X$ is required; $X$ need not even be square. Another explanation is that the strictly upper block part $N$ satisfies $N^2=0$, so $(I+N)(I-N)=I$.

### Which structures survive arithmetic?

Upper triangular matrices of the same square size remain upper triangular under addition and multiplication; the inverse of an invertible upper triangular matrix is upper triangular too. The same statements hold separately for lower triangular matrices. In a product, an entry below the diagonal could only receive a nonzero contribution if an index were simultaneously at least the row index and at most the smaller column index—impossible. For inversion, solve $Tx=e_j$ by back substitution: entries below position $j$ vanish.

Triangular matrices of a fixed size and orientation form a ring: addition, subtraction, and multiplication stay within the class, and the identity belongs to it. This does **not** mean every triangular matrix is invertible; singular triangular matrices exist.

Symmetry is preserved by addition and by inversion when an inverse exists:

$$(A+B)^T=A+B,\qquad (A^{-1})^T=(A^T)^{-1}=A^{-1}.$$

But a product of symmetric matrices need not be symmetric, since $(AB)^T=BA$. It is symmetric precisely when $AB=BA$. For example,

$$A=\begin{pmatrix}1&0\\0&2\end{pmatrix},\quad B=\begin{pmatrix}0&1\\1&0\end{pmatrix},\quad AB=\begin{pmatrix}0&1\\2&0\end{pmatrix}.$$

Both factors are symmetric; their product is not. Trace identities and the Neumann series follow in Lesson 3, after introducing norms.

## What to carry forward

Structure predicts what an algorithm can exploit. Eigenvalues count with multiplicity, while eigenvectors need not form a basis. A subspace is a set of vectors, not one particular basis matrix. Finally, matrix multiplication has an order: transpose and inverse reverse it, and symmetry does not remove that issue.
