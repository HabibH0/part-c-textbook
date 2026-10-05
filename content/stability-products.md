## 1. Dot products have a backward interpretation

For the usual sequential dot product, rounding analysis gives

$$
\widehat s=\operatorname{fl}(y^Tx)=\sum_{i=1}^n y_ix_i(1+\theta_i),
\qquad |\theta_i|\le\gamma_n=\frac{nu}{1-nu}.
$$

Set $\Delta y_i=\theta_i y_i$. Then

$$
\widehat s=(y+\Delta y)^Tx,\qquad |\Delta y|\le\gamma_n|y|.
$$

Only one input needs to be perturbed. The fully general notation $(y+\Delta y)^T(x+\Delta x)$ also works, but is unnecessary here. Large relative error in a dot product close to zero is still possible because cancellation makes the underlying problem relatively sensitive.

## 2. Matrix–vector multiplication: collect row errors

Each component of $\operatorname{fl}(Ax)$ is a dot product of one row with the same vector $x$. Apply the previous argument independently to each row, perturbing the row rather than $x$. These row perturbations assemble into one matrix:

$$
\operatorname{fl}(Ax)=(A+\Delta A)x,\qquad |\Delta A|\le\gamma_n|A|.
$$

This is backward stability, with normwise constants depending on dimensions and norm choice. It works because every output component can be explained by changing a different row of the same input matrix.

## 3. Why matrix–matrix multiplication is harder

A backward-stable matrix product would require

$$
\operatorname{fl}(AB)=(A+\Delta A)(B+\Delta B),\qquad
\|\Delta A\|\le\varepsilon\|A\|,\quad \|\Delta B\|\le\varepsilon\|B\|.
$$

Applying the matrix–vector result to each column instead gives $(A+\Delta A_j)b_j$. Different columns generally require different $\Delta A_j$. One cannot simply rename all those matrices as one common $\Delta A$.

### A concrete obstruction

Use a toy binary system with eight significant bits and rounding to nearest, ties to even. Take

$$
a=\begin{pmatrix}1\\17/16\end{pmatrix},\qquad b^T=\begin{pmatrix}1&17/16\end{pmatrix}.
$$

The exact outer product has rank one. Its bottom-right entry is $289/256=1.12890625$, halfway between adjacent floating-point values. It rounds to $9/8=1.125$, so the computed matrix is

$$
\widehat C=\begin{pmatrix}1&17/16\\17/16&9/8\end{pmatrix},\qquad
\det\widehat C=\frac98-\left(\frac{17}{16}\right)^2=-\frac1{256}\ne0.
$$

Thus $\widehat C$ has rank two. Every product of a $2\times1$ column and a $1\times2$ row has rank at most one, even after perturbing both factors. There is no exact backward interpretation of this shape at all, let alone one with small perturbations. The same obstruction can occur at higher precision with smaller increments. This proves that general matrix multiplication is not backward stable.

## 4. The forward bound that still holds

Standard multiplication does satisfy

$$
|\widehat C-AB|\le\gamma_n|A||B|,\qquad
\|\widehat C-AB\|\le\varepsilon\|A\|\|B\|,
$$

where the normwise $\varepsilon$ absorbs dimension-dependent constants. The denominator in a relative output bound is $\|AB\|$, which may be small through cancellation.

If $A$ is square and invertible, then $B=A^{-1}(AB)$ implies

$$
\frac{\|A\|_2\|B\|_2}{\|AB\|_2}\le\|A\|_2\|A^{-1}\|_2=\kappa_2(A).
$$

If $B$ is square and invertible, apply $A=(AB)B^{-1}$ instead to obtain the bound $\kappa_2(B)$. When both assumptions hold and $AB\ne0$,

$$
\frac{\|\widehat C-AB\|_2}{\|AB\|_2}\le\varepsilon\min\{\kappa_2(A),\kappa_2(B)\}.
$$

These inverse-based bounds must not be applied indiscriminately to arbitrary rectangular factors. If only one invertibility assumption holds, use only its corresponding bound.

## 5. Orthogonal factors make a decisive difference

Let $Q$ be square orthogonal and write the actual error matrix as $E=\operatorname{fl}(QB)-QB$. Since $\|Q\|_2=1$,

$$
\|E\|_2\le\varepsilon\|B\|_2.
$$

Define $\Delta B=Q^TE$. Then $Q\Delta B=E$, $\|\Delta B\|_2=\|E\|_2$, and

$$
\operatorname{fl}(QB)=Q(B+\Delta B).
$$

This is a backward interpretation as well as a small relative forward bound, because $\|QB\|_2=\|B\|_2$. On the right, if $E=\operatorname{fl}(AQ)-AQ$, set $\Delta A=EQ^T$ to obtain $\operatorname{fl}(AQ)=(A+\Delta A)Q$.

More generally a square well-conditioned left factor permits $\Delta B=A^{-1}E$, with relative size bounded by $\varepsilon\kappa_2(A)$. Orthogonality is especially convenient because the factor is exactly one. Orthogonal multiplication preserves error size instead of amplifying it.

## 6. Separate stable solves do not prove a stable inverse

Solving $Ax_i=e_i$ gives columns of $A^{-1}$. A backward-stable solver returns columns satisfying

$$
(A+\Delta A_i)\widehat x_i=e_i,\qquad \|\Delta A_i\|\le\varepsilon\|A\|.
$$

The equation involves $A+\Delta A_i$, **not its inverse** on the left. Equivalently $\widehat x_i=(A+\Delta A_i)^{-1}e_i$.

Different columns can require different perturbations. For $\widehat X=[\widehat x_1,\ldots,\widehat x_n]$ and $F=I-A\widehat X$, a common perturbation would have to satisfy $\Delta A\widehat X=F$. If $\widehat X$ is invertible, the only candidate is $\Delta A=F\widehat X^{-1}$. Its size need not be $O(u\|A\|)$. Columnwise stability alone does not establish backward stability of the whole inverse.

## 7. The design lesson

Ill-conditioned intermediate transformations can amplify rounding errors, as in delicate nonnormal eigenvector decompositions or Jordan-form calculations. This is a reason to prefer orthogonal transformations, not a theorem that every algorithm touching an ill-conditioned matrix is unstable. A stable solver can accept an ill-conditioned matrix; that was the central distinction between stability and conditioning.

Orthogonal transformations underpin Householder QR and QR-based solves, the QR eigenvalue algorithm, the Golub–Kahan approach to the SVD, and the QZ method for $Ax=\lambda Bx$. Each algorithm still needs its own analysis, but preserving norms provides the common mechanism for controlling rounding error.
