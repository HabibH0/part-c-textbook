## 1. Triangular substitution is backward stable

Let $R$ be a nonsingular upper triangular matrix. Back substitution computes the entries in reverse order using

$$
\widehat x_i=\operatorname{fl}\left(\frac{b_i-\sum_{j=i+1}^n r_{ij}\widehat x_j}{r_{ii}}\right).
$$

The standard rounding analysis shows that the computed vector satisfies

$$
(R+\Delta R)\widehat x=b,\qquad |\Delta R|\le\gamma_n|R|,
\qquad \gamma_n=\frac{nu}{1-nu},
$$

assuming $nu<1$ and no overflow or harmful underflow. Absolute values here are taken entry by entry. In particular, a zero entry of $R$ need not acquire a perturbation. Forward substitution has the corresponding property for a lower triangular matrix.

The componentwise result implies a normwise bound $\|\Delta R\|=O(u\|R\|)$ with appropriate dimension and norm constants. Combining it with conditioning gives a first-order relative forward error of order $u\kappa_2(R)$.

### Optional proof idea

Each multiplication, subtraction and division contributes a factor $1+\delta$ with $|\delta|\le u$. Products of at most $n$ such factors, including inverse factors when equations are rearranged, can be written $1+\theta_n$ with $|\theta_n|\le\gamma_n$. Rearranging the computed equation for row $i$ puts these factors on that row's coefficients while leaving $b_i$ unchanged. Collect the rows into $\Delta R$. This explains both the componentwise bound and the preservation of triangular zeros; the detailed operation-by-operation bookkeeping is optional.

A large condition number supplies a poor worst-case bound, not a prediction for every right-hand side. For instance, $R=\operatorname{diag}(1,10^{-12})$ is ill-conditioned but some exactly representable diagonal divisions are exact. Triangular systems often behave better than their general normwise bound suggests. The direction of the data and the componentwise structure both matter.

## 2. Stable stages do not automatically make a stable whole

For pivoted LU, retain the row permutation explicitly. The computed factors obey a bound of the form

$$
\widehat L\widehat U=PA+F,\qquad
\|F\|\le\varepsilon\|\widehat L\|\|\widehat U\|.
$$

The scale on the right is the **product of factor norms**, not necessarily $\|A\|$. The componentwise analysis is more informative still: the error is controlled by a small multiple of $|\widehat L||\widehat U|$.

Backward stability of the two triangular solves means

$$
(\widehat L+\Delta L)\widehat y=Pb,\qquad
(\widehat U+\Delta U)\widehat x=\widehat y.
$$

Substitute the second equation into the first and expand:

$$
\bigl(PA+F+\Delta L\widehat U+\widehat L\Delta U+\Delta L\Delta U\bigr)\widehat x=Pb.
$$

After multiplying by $P^T$, this is $(A+\Delta A)\widehat x=b$. Since a permutation preserves the spectral norm,

$$
\|\Delta A\|\le C\varepsilon\|\widehat L\|\|\widehat U\|+O(\varepsilon^2\|\widehat L\|\|\widehat U\|).
$$

Thus if $\|\widehat L\|\|\widehat U\|=O(\|A\|)$, the complete solve is backward stable. This derivation is the missing link between stable substitutions and a stable original system.

## 3. Growth without and with pivoting

Without pivoting, take

$$
A_\delta=\begin{pmatrix}\delta&1\\1&1\end{pmatrix}
=\begin{pmatrix}1&0\\1/\delta&1\end{pmatrix}
\begin{pmatrix}\delta&1\\0&1-1/\delta\end{pmatrix}.
$$

For small nonzero $\delta$, $A_\delta$ has modest entries while both factors contain huge entries. Multiplying them reconstructs a modest matrix through cancellation. The factor-based error bound can consequently be large relative to the original input. A row swap avoids this tiny first pivot.

Partial pivoting bounds multipliers by $1$ in magnitude, so growth of the upper factor becomes the principal concern, with dimension factors understood. The worst case can nevertheless be exponential. Consider the $n\times n$ matrix with diagonal $1$, entries $-1$ below the diagonal in its first $n-1$ columns, zeros above that diagonal, and a final column of ones. If ties retain the first maximal pivot, elimination produces final-column entries

$$
1,2,4,\ldots,2^{n-1}.
$$

At each stage, adding the pivot row doubles the remaining active final-column entries. The growth factor is $2^{n-1}$ although the largest original entry is $1$. This demonstrates a worst-case limitation of partial pivoting. It does not mean every such exactly representable example suffers a large rounding error: growth describes the potential amplification in the error bound.

In ordinary applications partial pivoting is usually reliable and is widely used because it is cheaper than QR or SVD. Its striking practical success despite pessimistic worst-case bounds has motivated extensive theoretical work. It is not a universal guarantee or a theorem about every possible distribution of inputs. When stronger general stability guarantees are needed, orthogonal methods offer an alternative at additional cost.

## 4. Why Cholesky is different

For symmetric positive definite $A$, exact Cholesky gives $A=R^TR$. Each active Schur complement is positive definite, so exact arithmetic needs no pivoting. Moreover,

$$
\|R\|_2^2=\|R^TR\|_2=\|A\|_2.
$$

Every entry satisfies $|r_{ij}|\le\|R\|_2=\sqrt{\|A\|_2}$. There is no analogue of arbitrarily huge triangular factors hiding behind cancellation in a small $A$.

For a successfully computed Cholesky factor, rounding analysis gives $\widehat R^T\widehat R=A+E$ with $\|E\|=O(u\|A\|)$, including dimension constants. Applying stable triangular solves then gives a backward stable solution of the positive definite system.

There is a finite-precision qualification: a matrix that is positive definite in exact arithmetic can be so close to singularity that input rounding or the factorisation loses a positive pivot. Exact existence does not guarantee numerical completion for arbitrarily ill-conditioned data. If the computed factorisation completes under the usual arithmetic assumptions, its backward-error guarantee is the relevant conclusion. This is the same issue encountered when normal equations erase a tiny positive eigenvalue.

## 5. What to inspect in a computed solve

Separate three checks: whether a factorisation completed, how large its reconstruction or residual error is on the scale of the input, and how strongly the problem amplifies that backward error. A tiny residual supports a good backward interpretation; it does not establish small forward error without conditioning information. Conversely, exact-looking answers in a growth example do not prove that its algorithm is stable for all nearby inputs.
