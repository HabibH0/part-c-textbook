## 1. A reflection expressed by one vector

For a real unit vector $v\in\mathbb R^m$, define the Householder reflector

$$
H=I-2vv^T.
$$

It is a rank-one change to the identity, not itself a rank-one matrix. It is symmetric, and

$$
H^2=I-4vv^T+4v(v^Tv)v^T=I.
$$

Thus $H^{-1}=H^T=H$, so $H$ is orthogonal. Along $v$, $Hv=-v$; on the hyperplane $v^Tx=0$, $Hx=x$. Its eigenvalues are $-1$ once and $+1$ with multiplicity $m-1$.

Decompose an input as $x=x_\perp+(v^Tx)v$. The reflector reverses its perpendicular-to-the-hyperplane component and keeps $x_\perp$ fixed. The displacement is $-2v(v^Tx)$, twice the vector from $x$ to its projection on the reflecting hyperplane. This explains the geometry shown in the demonstration.

## 2. Map any two distinct vectors of equal length

Suppose $\|a\|_2=\|b\|_2=\rho$ and $a\ne b$. Choose

$$
v=\frac{a-b}{\|a-b\|_2}.
$$

The direction is necessary: from $Ha=b$ we get $2v(v^Ta)=a-b$, so $v$ must be parallel to $a-b$ (its sign is irrelevant to $vv^T$). To verify the choice without assuming unit-length inputs,

$$
\|a-b\|_2^2=2\rho^2-2a^Tb,
\qquad (a-b)^Ta=\rho^2-a^Tb.
$$

Therefore

$$
vv^Ta=(a-b)\frac{\rho^2-a^Tb}{2\rho^2-2a^Tb}
=\tfrac12(a-b),
$$

and $Ha=a-2vv^Ta=b$. Since $H^2=I$, the same reflector sends $b$ back to $a$. If $a=b$, the displayed normalisation is undefined; use the identity if no change is needed.

## 3. Annihilate the tail of a column

For $x\ne0$, take $b=\|x\|_2e_1$. If $x\ne b$, the preceding construction gives

$$
v=\frac{x-\|x\|_2e_1}{\|x-\|x\|_2e_1\|_2},\qquad
Hx=\|x\|_2e_1.
$$

All coordinates below the first become zero. For $x=(3,4)^T$, $v=(-1,2)^T/\sqrt5$, giving

$$
H=\begin{pmatrix}3/5&4/5\\4/5&-3/5\end{pmatrix},
\qquad Hx=(5,0)^T.
$$

Handle the exceptional cases explicitly. If $x=0$, use no transformation. If $x=\|x\|e_1$, the identity already does the job. If $x=-\|x\|e_1$, a sign flip in the first coordinate maps it to the positive target.

### Choose a sign that avoids cancellation

The positive target is useful for the existence proof, but if $x$ is close to that target, subtracting $\|x\|$ from $x_1$ can lose significant digits. A practical construction chooses

$$
\alpha=-\operatorname{sign}(x_1)\|x\|_2,\qquad
v=\frac{x-\alpha e_1}{\|x-\alpha e_1\|_2},
$$

with $\operatorname{sign}(0)=1$. Now $Hx=\alpha e_1$, still with a zero tail. This makes the first difference large rather than a cancellation. Stable norm evaluation also matters. QR does not require every diagonal entry of $R$ to be positive; column/row sign changes can impose that convention afterwards.

## 4. Build QR one active column at a time

Let $A\in\mathbb R^{m\times n}$, $m\ge n$. At stage $k$, work with rows $k,\ldots,m$ of the current column $k$. Construct a reflector for that tail and embed its vector with $k-1$ leading zeros:

$$
v_k=(0,\ldots,0,*,\ldots,*)^T,\qquad H_k=I-2v_kv_k^T.
$$

Because $H_k$ acts as the identity on earlier coordinates, it does not spoil the zeros already made in columns $1,\ldots,k-1$. Successive stages clear below the first diagonal position, then the second, and so on. At the end,

$$
H_n\cdots H_2H_1A=\begin{pmatrix}R\\0\end{pmatrix}.
$$

Invert the transformations in the correct order:

$$
A=H_1H_2\cdots H_n\begin{pmatrix}R\\0\end{pmatrix}
=Q_F\begin{pmatrix}R\\0\end{pmatrix}.
$$

This is **full QR**, with $Q_F\in\mathbb R^{m\times m}$ orthogonal. Partition $Q_F=(Q,Q_\perp)$ into its first $n$ and last $m-n$ columns. Then $A=QR$ is thin QR. When $m=n$, the zero block and $Q_\perp$ have no rows/columns; a last scalar sign change can be omitted.

The algorithm proves existence even for rank-deficient input: if an active tail is zero, skip its reflector. A singular $R$ is allowed, unlike dividing by a zero Gram–Schmidt residual. For full column rank, $Q$ spans the column space and $Q_\perp$ spans its orthogonal complement. Applying this to an orthonormal input matrix also proves that its columns can be completed to a square orthogonal basis.

## 5. Apply a reflector without forming it

For any vector $a$,

$$
Ha=a-2v(v^Ta).
$$

Compute one inner product, then one scaled vector subtraction. This takes $O(m)$ operations, rather than $O(m^2)$ for a dense matrix-vector product. Apply the same idea to the active columns and store the reflector vectors; do not construct every dense $H_k$.

Updating an active $p\times q$ block costs about $4pq$ flops. Summing over columns gives leading factorisation cost

$$
2mn^2-\frac23n^3.
$$

At $m=n$ this is $\tfrac43n^3$, twice the $\tfrac23n^3$ LU leading cost. These counts concern the usual compact factorisation; explicitly forming a full $Q_F$ requires additional work. To apply $Q_F^Tb$ directly, apply $H_1$ to $b$, then $H_2$, and so on—the rightmost matrix in the written product acts first.

## 6. Stability and optional rank revelation

Householder QR is backward stable under the standard floating-point model: computed factors reconstruct $A+\Delta A$ with $\|\Delta A\|$ small on the scale of $A$. An explicitly accumulated $\widehat Q$ is orthogonal to rounding accuracy, with $\|\widehat Q^T\widehat Q-I\|$ of order unit roundoff times dimension-dependent factors. “Rounding accuracy” is not exact orthogonality or a dimension-free equality to one machine epsilon. Appropriate scaling avoids exceptional overflow/underflow.

Pivoting is not required for this stability property. **Optional, non-examinable extension:** column-pivoted QR writes $AP=QR$ (equivalently $A=QRP^T$). Choosing columns adaptively can expose a useful leading independent set and help estimate numerical rank. Plain unpivoted diagonal entries are not singular values, and a simplistic threshold need not be a reliable rank certificate. Rank revelation and backward stability are different objectives.
