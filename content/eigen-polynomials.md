## 1. From solving equations to finding the spectrum

A linear system $Ax=b$ asks for the response to a specified right-hand side. An eigenvalue problem asks for a nonzero direction whose image stays on the same line:

$$
Ax=\lambda x,\qquad x\ne0.
$$

Both $x$ and $\lambda$ are unknown. Rearranging gives $(\lambda I-A)x=0$, so

$$
\lambda\text{ is an eigenvalue of }A
\quad\Longleftrightarrow\quad
\det(\lambda I-A)=0.
$$

The determinant on the right is the **characteristic polynomial**, a monic polynomial of degree $n$ for an $n\times n$ matrix. Over $\mathbb C$ it has $n$ roots counting algebraic multiplicity. A real matrix can have nonreal roots, occurring in conjugate pairs.

For a nonsingular linear system, $x=A^{-1}b$ is an exact symbolic expression, although a practical implementation solves the system without forming the inverse. There is no comparable universal formula by radicals for arbitrary eigenvalues in arbitrary dimension. Low-dimensional and specially structured cases can have explicit formulas; the general problem is different.

## 2. Every polynomial can be an eigenvalue problem

Let

$$
p(z)=z^n+a_{n-1}z^{n-1}+\cdots+a_1z+a_0,\qquad a_j\in\mathbb C.
$$

Its **companion matrix** in the convention used here is

$$
C=\begin{pmatrix}
-a_{n-1}&-a_{n-2}&\cdots&-a_1&-a_0\\
1&0&\cdots&0&0\\
0&1&\cdots&0&0\\
\vdots&&\ddots&&\vdots\\
0&\cdots&0&1&0
\end{pmatrix}.
$$

The negative coefficients run in descending order across the first row. The subdiagonal consists of ones; all other entries are zero. A nonconstant polynomial with a nonunit leading coefficient can first be divided by that coefficient. The zero polynomial is not part of this construction.

### Proof of the correspondence

Suppose $p(\lambda)=0$. Set

$$
v(\lambda)=(\lambda^{n-1},\lambda^{n-2},\ldots,\lambda,1)^T.
$$

This vector is nonzero because its last entry is $1$. Its first component after multiplication by $C$ is

$$
-a_{n-1}\lambda^{n-1}-\cdots-a_1\lambda-a_0=\lambda^n.
$$

Each lower row simply shifts an entry down. Therefore $Cv(\lambda)=\lambda v(\lambda)$.

Conversely, let $Cw=\lambda w$ with $w\ne0$. The lower rows give $w_{j-1}=\lambda w_j$ for $j=2,\ldots,n$. If $w_n=0$, these equations force every entry to vanish, a contradiction. Thus $w=w_n v(\lambda)$. Substitution into the first row yields $p(\lambda)=0$.

In fact $\det(zI-C)=p(z)$, including multiplicities. Expanding the first-row cofactors of $zI-C$ gives the terms $z^n,a_{n-1}z^{n-1},\ldots,a_0$ in order. Thus the eigenvalues encode every root with its algebraic multiplicity, not just a set of distinct roots.

### Worked example

For $p(z)=z^3-6z^2+11z-6=(z-1)(z-2)(z-3)$,

$$
C=\begin{pmatrix}6&-11&6\\1&0&0\\0&1&0\end{pmatrix}.
$$

At $\lambda=2$, $v=(4,2,1)^T$ and $Cv=(8,4,2)^T=2v$. Notice the negative coefficient signs and the descending powers in the eigenvector. Both depend on the chosen companion convention.

There are many matrices with the same prescribed eigenvalues. For every invertible $S$, $SCS^{-1}$ has the same characteristic polynomial. Different changes of basis provide infinitely many representatives when the similarity orbit is nontrivial; repeated eigenvalues can also allow distinct Jordan structures. The existence of one companion matrix is enough for the root-finding connection.

## 3. Why approximation and iteration are natural

The Abel–Ruffini obstruction says there is no universal radical formula for roots of general polynomials of degree at least five. If arbitrary eigenvalues could always be expressed by a finite sequence of arithmetic operations and radicals, applying that procedure to companion matrices would supply such a forbidden polynomial formula.

This statement needs its computational model: it does **not** say that no finite symbolic representation of a root can exist, or that no special matrix can be solved exactly. It explains why general numerical eigensolvers use iterative approximation rather than a universal finite arithmetic-and-radicals recipe.

The SVD has the same connection, since

$$
\sigma_i(A)=\sqrt{\lambda_i(A^*A)}.
$$

This identity is a mathematical link, not a recommendation to compute small singular values by explicitly forming $A^*A$, which squares conditioning. Reliable SVD algorithms use more careful transformations.

Iteration does not mean poor accuracy. A backward-stable eigensolver can deliver the exact spectral structure of a nearby matrix to working precision. The natural target for a general matrix is a unitary Schur factorisation, introduced next. Extracting eigenvalues from a characteristic polynomial is useful conceptually but is not usually the best route for a general matrix: forming polynomial coefficients can itself be sensitive.

## 4. Optional application: optimise a polynomial

For a real polynomial $g(t)$, interior extrema satisfy $g'(t)=0$. Its derivative's roots can therefore be found as eigenvalues of a companion matrix. Retain real critical points in the domain, evaluate $g$ there, and compare with any boundary values. A critical point need not be a minimum.

For example, minimise $g(t)=t^4-2t^2$ on $[-2,2]$. Its derivative is $4(t^3-t)$, so use the monic polynomial $t^3-t$ and

$$
C=\begin{pmatrix}0&1&0\\1&0&0\\0&1&0\end{pmatrix}.
$$

The eigenvalues are $-1,0,1$. The corresponding values of $g$ are $-1,0,-1$, while $g(-2)=g(2)=8$. The global minimum is $-1$, attained at both $-1$ and $1$. On an unbounded domain, behaviour at infinity also needs checking; a list of stationary points alone does not establish a global minimum.
