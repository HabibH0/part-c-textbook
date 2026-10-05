## 1. Read a linear map through its singular vectors

The SVD is useful because it separates the directions that a matrix preserves from the directions it destroys. In this lesson, let $A\in\mathbb R^{m\times n}$ have rank $r$ and full singular-vector bases. Its compact factorisation is

$$
A=U_r\Sigma_r V_r^T=\sum_{i=1}^r\sigma_i u_i v_i^T,\qquad \sigma_i>0.
$$

You need the SVD notation from the preceding lesson and the definitions of range, null space, and rank. In complex arithmetic every transpose below becomes an adjoint.

## 2. Singular triplets and rank

From $A=U\Sigma V^T$, orthogonality gives

$$
Av_i=\sigma_i u_i,\qquad A^Tu_i=\sigma_i v_i.
$$

Equivalently, $u_i^TA=\sigma_i v_i^T$. The triple $(\sigma_i,u_i,v_i)$, with unit vectors, is a **singular triplet**. The two equations matter: checking only $Av=\sigma u$ is not enough to show that an arbitrary unit $v$ is a right singular vector. For example, any nonzero $Av$ can be normalised to manufacture such a first equation.

Multiplication by invertible orthogonal factors does not change rank. Consequently,

$$
\operatorname{rank}(A)=\operatorname{rank}(\Sigma)=\#\{i:\sigma_i>0\}=r.
$$

This is an exact algebraic statement. In floating-point data, deciding whether a tiny singular value should be treated as zero requires a tolerance informed by scale and error. A small positive value is not mathematically zero.

### Why row rank equals column rank

The column space will have basis $u_1,\ldots,u_r$ and the row space basis $v_1,\ldots,v_r$. Both therefore have dimension $r$. The SVD supplies a direct proof of equality of row and column rank rather than merely giving two unrelated ways to calculate a number.

## 3. Four fundamental subspaces

For any input $x$,

$$
Ax=\sum_{i=1}^r\sigma_i(v_i^Tx)u_i.
$$

Thus every output lies in $\operatorname{span}(u_1,\ldots,u_r)$. Conversely, $u_i=A(v_i/\sigma_i)$ for $i\le r$, so every listed basis vector is an output. Both inclusions establish

$$
\operatorname{range}(A)=\operatorname{span}(u_1,\ldots,u_r).
$$

Apply the same argument to $A^T$:

$$
\operatorname{range}(A^T)=\operatorname{span}(v_1,\ldots,v_r).
$$

This is the row space, identified as a subspace of column vectors in $\mathbb R^n$.

For the null space, orthonormality of the $u_i$ gives

$$
\|Ax\|_2^2=\sum_{i=1}^r\sigma_i^2(v_i^Tx)^2.
$$

The sum vanishes exactly when all $v_i^Tx=0$ for $i\le r$. Hence

$$
\operatorname{null}(A)=\operatorname{span}(v_{r+1},\ldots,v_n),\qquad\dim\operatorname{null}(A)=n-r.
$$

Similarly,

$$
\operatorname{null}(A^T)=\operatorname{span}(u_{r+1},\ldots,u_m),\qquad\dim\operatorname{null}(A^T)=m-r.
$$

A null space is never empty: it always contains zero. When the spanning list is empty, its span is $\{0\}$. A tall full-column-rank matrix has trivial right null space but can have a nontrivial left null space.

### The rectangular trap

If $m<n$, even full row rank leaves $n-m$ right-null directions. These belong to the extra columns of the full $V_f$ and are absent from a thin $V$. For any wide matrix $m<n$, $r\le m<n$, so a nonzero right-null vector must exist. The last column of a full $V_f$ is one such vector.

## 4. Coordinates and projections

The input space splits into two perpendicular pieces: row space and null space. The output space splits into range and left null space. Their orthogonal projectors are

$$
P_{\rm row}=V_rV_r^T,\quad P_{\rm null}=I_n-V_rV_r^T,
$$

$$
P_{\rm range}=U_rU_r^T,\quad P_{\rm left\ null}=I_m-U_rU_r^T.
$$

For example, $U_rU_r^Tb$ first finds the coordinates of $b$ along each $u_i$, then reconstructs its component in the range. Symmetry and $P^2=P$ verify that it is an orthogonal projector. Neither $U_rU_r^T=I_m$ nor $V_rV_r^T=I_n$ is generally true.

### Worked example: a rank-one map

Take

$$
A=\begin{pmatrix}3&0&0\\0&0&0\end{pmatrix}.
$$

The range is $\operatorname{span}(e_1)$ in $\mathbb R^2$, the row space is $\operatorname{span}(e_1)$ in $\mathbb R^3$, the right null space is $\operatorname{span}(e_2,e_3)$, and the left null space is $\operatorname{span}(e_2)$ in $\mathbb R^2$.

The same symbol $e_1$ occurs in different ambient spaces; dimensions are part of the answer. Projecting $(4,5)^T$ onto the range gives $(4,0)^T$. Projecting $(4,5,6)^T$ onto the null space gives $(0,5,6)^T$.

## 5. Exact low-rank factors

Because all terms after the $r$th vanish,

$$
A=U_r\Sigma_rV_r^T,
$$

where $U_r$ is $m\times r$, $\Sigma_r$ is $r\times r$, and $V_r$ is $n\times r$. Grouping $U_r\Sigma_r$ into one factor expresses $A$ as an $m\times r$ matrix times an $r\times n$ matrix.

Conversely, if $A=BC$ with $B\in\mathbb R^{m\times r}$ and $C\in\mathbb R^{r\times n}$, every column of $A$ lies in the span of $B$, so $\operatorname{rank}(A)\le r$. Equality is not guaranteed unless the factors supply $r$ independent directions.

At exact rank $r$, the compact SVD loses no information. An approximation is needed only if we discard a positive singular value. That distinction will matter in the last lesson.

## 6. Solving equations in singular coordinates

The SVD also describes linear solves and least squares. These applications illustrate the decomposition's meaning; more economical algorithms can be preferable for a particular solve.

Let $\beta_i=u_i^Tb$. If $b\in\operatorname{range}(A)$, then

$$
x_\star=\sum_{i=1}^r\frac{\beta_i}{\sigma_i}v_i
$$

satisfies $Ax_\star=b$. Every solution is $x=x_\star+z$ with $z\in\operatorname{null}(A)$. The two terms are perpendicular, so

$$
\|x_\star+z\|_2^2=\|x_\star\|_2^2+\|z\|_2^2.
$$

Thus $x_\star$ is the unique solution of smallest Euclidean norm. If $A$ is square and nonsingular, this reduces to $A^{-1}=V\Sigma^{-1}U^T$ and there is just one solution.

If $b$ is not in the range, no exact solution exists. Split $b=U_rU_r^Tb+b_\perp$, with $b_\perp$ perpendicular to every output. Then

$$
\|Ax-b\|_2^2=\sum_{i=1}^r(\sigma_i v_i^Tx-\beta_i)^2+\|b_\perp\|_2^2.
$$

Choose $v_i^Tx=\beta_i/\sigma_i$ to minimise the first sum. The same $x_\star$ is the minimum-norm least-squares solution, and the smallest residual norm is $\|b_\perp\|_2$. The map $A^+=V_r\Sigma_r^{-1}U_r^T$ is called the **pseudoinverse**; $x_\star=A^+b$.

For the rank-one example with $b=(6,4)^T$, all least-squares minimisers are $(2,s,t)^T$, the minimum-norm one is $(2,0,0)^T$, and the residual length is $4$. An exact solution does not exist because the second output coordinate must be zero.

Dividing by a very small positive $\sigma_i$ amplifies the corresponding component of $b$. This connects the geometry of the SVD to sensitivity of a linear solve.
