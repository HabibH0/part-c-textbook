## 1. More equations than unknowns

Measurements often give more equations than a simple model has parameters. Oversampling can help distinguish a shared pattern from measurement noise, but generally makes exact agreement impossible. For $A\in\mathbb R^{m\times n}$, $m\ge n$, and $b\in\mathbb R^m$, the Euclidean least-squares problem is

$$
\min_{x\in\mathbb R^n}\|Ax-b\|_2.
$$

Minimising the squared norm gives the same minimisers. We use $r=b-Ax$ when discussing residual vectors; its norm equals that of $Ax-b$. An overdetermined system can be consistent, but a general $b$ need not lie in $\operatorname{range}(A)$.

Throughout the main result assume **full column rank**, $\operatorname{rank}(A)=n$. This makes the coefficient vector unique. A rank-deficient matrix still has a least-squares fit, but infinitely many coefficient vectors attain it; a common extra requirement is minimum Euclidean coefficient norm, supplied by the pseudoinverse.

## 2. Rotate the residual into two blocks

Take a full QR factorisation,

$$
A=Q_F\begin{pmatrix}R\\0\end{pmatrix},\qquad Q_F=(Q,Q_\perp).
$$

Because $Q_F$ is square orthogonal, it preserves the length of every residual:

$$
\|Ax-b\|_2^2
=\|Q_F^T(Ax-b)\|_2^2
=\|Rx-Q^Tb\|_2^2+\|Q_\perp^Tb\|_2^2.
$$

The first term can be changed by choosing $x$. The second is independent of $x$ and measures the component of $b$ outside the column space. Since full rank makes $R$ nonsingular, we can set the first term to zero in exactly one way:

$$
Rx_*=Q^Tb,\qquad x_*=R^{-1}Q^Tb.
$$

The inverse formula states the mathematics; the algorithm performs a triangular solve. This proves existence and uniqueness and gives the minimum residual norm $\|Q_\perp^Tb\|_2$.

Using thin $Q^T$ alone as though it preserved every $m$-vector's norm would omit the unavoidable second term. The full orthogonal extension makes the proof valid.

## 3. The fitted vector is an orthogonal projection

Multiplying the solution equation by $Q$ gives

$$
Ax_*=QQ^Tb,\qquad r_*=b-Ax_*=(I-QQ^T)b.
$$

The fit is the projection of $b$ onto the column space, and $Q^Tr_*=0$. The residual is orthogonal to every column of $A$. For any other coefficient vector $x_*+h$,

$$
\|b-A(x_*+h)\|_2^2=\|r_*\|_2^2+\|Ah\|_2^2.
$$

Full column rank makes the second term positive for $h\ne0$, another proof of uniqueness. If $A$ is rank deficient, a nonzero null vector $h$ gives the same fit and explains the nonuniqueness of coefficients. The fitted vector itself remains unique.

### A complete example

Let

$$
A=\begin{pmatrix}1&0\\0&1\\1&1\end{pmatrix},\qquad b=(1,1,0)^T.
$$

One thin QR is

$$
q_1=(1,0,1)^T/\sqrt2,\qquad
q_2=(-1,2,1)^T/\sqrt6,
$$

$$
R=\begin{pmatrix}\sqrt2&1/\sqrt2\\0&\sqrt{3/2}\end{pmatrix}.
$$

The transformed right-hand side is $Q^Tb=(1/\sqrt2,1/\sqrt6)^T$. Back substitution yields $x_2=1/3$ and $x_1=1/3$. Thus

$$
Ax_*=(1/3,1/3,2/3)^T,\quad
r_*=(2/3,2/3,-2/3)^T,\quad\|r_*\|_2^2=4/3.
$$

Both column inner products with $r_*$ vanish. A zero residual is unattainable, because the first two equations would force $x=(1,1)$ while the third requires their sum to be zero. The demonstration varies $b$ and verifies fit, residual, and orthogonality numerically.

## 4. The practical QR algorithm

Compute Householder QR and apply the stored reflectors to $b$ as the factorisation proceeds. The first $n$ components of $Q_F^Tb$ form the triangular right-hand side, and the remaining components measure the minimum residual. Solve $Rx=Q^Tb$ by back substitution. Explicitly constructing $Q_\perp$ is unnecessary.

This process is backward stable under the standard arithmetic assumptions: the computed $\widehat x$ solves a nearby problem

$$
\min_x\|(A+\Delta A)x-(b+\Delta b)\|_2
$$

with small input perturbations. The sign is consistent with the original $Ax-b$ objective. As before, backward stability does not imply tiny forward coefficient errors for an ill-conditioned problem.

An ordinary LU factorisation of a rectangular matrix does not supply the orthogonal residual split. Solving a selected square subset of equations generally does not minimise the residual over all rows. QR is a stable standard method; it is not the only mathematical route. SVD and the normal equations provide alternatives with different costs and accuracy properties.

## 5. Square systems and the SVD alternative

When $m=n$ and $A$ is nonsingular, the same algorithm solves $Ax=b$: there is no perpendicular block, and $Rx=Q^Tb$. Householder QR has stronger general backward-stability behaviour than pivoted LU, whose exceptional growth cases remain possible. Its leading dense factorisation count, $\tfrac43n^3$, is twice LU's $\tfrac23n^3$, which explains why LU is commonly chosen for general square systems. A factor-of-two flop comparison is not a universal runtime ratio.

Another stable route is the SVD. For a nonsingular square matrix,

$$
x=V\Sigma^{-1}U^Tb.
$$

For a full-column-rank tall matrix use the thin factors, and for a deficient matrix use $\Sigma^+$ to obtain the minimum-norm least-squares solution. SVD is usually more expensive; a rough order-of-magnitude comparison such as about ten times a QR-based route can be illustrative, but depends on dimensions, algorithms and whether vectors are requested. The extra cost buys direct access to singular values, rank information, and minimum-norm handling.

## 6. Optional, non-examinable extension: the norm changes the fit

The Euclidean projection argument relies on the 2-norm and its inner product. Replacing the objective by $\|Ax-b\|_1$ generally changes the minimiser. Minimising a 1-norm often promotes zeros in the quantity being penalised; here that quantity is the **residual**, not necessarily the coefficient vector.

For a constant model fitted to observations $0,0,9$, the squared 2-norm is $2c^2+(9-c)^2$, uniquely minimised at the mean $c=3$. The 1-norm is $2|c|+|9-c|$, minimised at the median $c=0$, leaving residual $(0,0,9)$. This illustrates sparse residuals; it is not a promise that every 1-norm problem has a unique solution or the same sparsity pattern.

Do not confuse this with low-rank approximation: truncated SVD is optimal for every unitarily invariant matrix norm, whereas changing the norm in a regression objective can change the coefficients. Even for low-rank approximation, a norm that is not unitarily invariant—such as the induced matrix 1-norm—need not retain truncated-SVD optimality.
