## 1. Two properties must survive rounding

A QR factorisation needs both a small reconstruction error and an orthogonal factor. For Householder QR, the computed factors satisfy

$$
\|\widehat Q^T\widehat Q-I\|=O(u),\qquad
\|A-\widehat Q\widehat R\|=O(u\|A\|),
$$

with dimension factors absorbed and $\widehat R$ upper triangular. For tall matrices, $\widehat Q$ is the thin factor; a full orthogonal factor can also be formed. As throughout the chapter, assume no overflow or harmful underflow.

A tiny reconstruction error alone is insufficient. For example, $Q=\operatorname{diag}(2,1/2)$ and $R=\operatorname{diag}(1/2,2)$ multiply to the identity, but $Q^TQ\ne I$. Calling this a valid QR factorisation would ignore its defining geometric property.

## 2. Why a sequence of reflectors is stable

First consider exact orthogonal reflectors $H_1,\ldots,H_n$, and let $B_0=A$. A computed application can be described as

$$
\widehat B_i=H_i\widehat B_{i-1}+E_i,\qquad
\|E_i\|\le c_i u\|\widehat B_{i-1}\|.
$$

Expand the recurrence:

$$
\widehat B_n=H_n\cdots H_1A+
\sum_{i=1}^n H_n\cdots H_{i+1}E_i.
$$

An empty product is the identity. Since multiplying by orthogonal matrices preserves the norm, later transformations do not amplify an earlier $E_i$. To first order the accumulated error is bounded by $(\sum_i c_i)u\|A\|$, rather than a product of large transformation norms.

For a full factorisation, set $Q_*=H_1\cdots H_n$. Then

$$
\begin{pmatrix}\widehat R\\0\end{pmatrix}=Q_*^TA+E_R,\qquad
\|E_R\|=O(u\|A\|).
$$

Forming the orthogonal product also incurs error:

$$
\widehat Q_F=Q_*+E_Q,\qquad \|E_Q\|=O(u).
$$

Therefore $\widehat Q_F^T\widehat Q_F-I=Q_*^TE_Q+E_Q^TQ_*+E_Q^TE_Q=O(u)$, and

$$
\widehat Q_F\begin{pmatrix}\widehat R\\0\end{pmatrix}
=(Q_*+E_Q)(Q_*^TA+E_R)=A+O(u\|A\|).
$$

Taking the first $n$ columns gives the thin-factor conclusions.

This is a proof sketch of the mechanism. Actual reflector vectors are themselves computed. A full analysis accounts for their construction and associates the steps with nearby exact orthogonal reflectors; the resulting bounds retain the same form. Merely writing a nominally orthogonal formula without controlling its implementation would not be a proof.

## 3. Backward accuracy is not factorwise forward accuracy

The computed $\widehat Q$ is generally only nearly orthogonal. A precise backward statement uses a nearby exactly orthogonal factor $\widetilde Q$ with $\|\widetilde Q-\widehat Q\|=O(u)$ and

$$
A+\Delta A=\widetilde Q\widehat R,\qquad \|\Delta A\|=O(u\|A\|).
$$

For example, when $\widehat Q$ has full column rank and its orthogonality defect is small, its polar correction $\widehat Q(\widehat Q^T\widehat Q)^{-1/2}$ is exactly orthonormal and differs by $O(u)$. Multiplying this small correction by $\widehat R$, whose norm is comparable to $\|A\|$, preserves the reconstruction-error scale. This explains the mixed forward–backward interpretation of stored factors.

None of these statements promises that $\widehat Q$ and $\widehat R$ are individually close to particular exact factors of the unperturbed $A$. QR factors can be sensitive for nearly dependent columns. Sign conventions must also be fixed before comparing factors: flipping a column of $Q$ and the corresponding row of $R$ leaves their product unchanged.

When Householder QR is used to solve $Ax=b$, or a full-column-rank least-squares problem, applying stored reflectors and solving the triangular system yields a stable overall method under the usual assumptions. This remains a backward-error claim. Least-squares forward sensitivity also depends on geometry and the residual, and should not automatically be reduced to the square-system bound $u\kappa_2(A)$.

## 4. Optional extension: three Gram–Schmidt variants

The following material is non-examinable enrichment, but helps explain why algebraically equivalent constructions behave differently.

In **classical Gram–Schmidt**, all projection coefficients for column $a_j$ use that original column:

$$
r_{ij}=q_i^Ta_j,\qquad
w=a_j-\sum_{i<j}r_{ij}q_i,\qquad
q_j=w/\|w\|.
$$

In **modified Gram–Schmidt**, update the remainder after each projection:

$$
w\leftarrow a_j;\qquad
r_{ij}\leftarrow q_i^Tw,quad w\leftarrow w-r_{ij}q_i
\quad(i=1,\ldots,j-1);\qquad q_j=w/\|w\|.
$$

The methods agree in exact arithmetic, but their intermediate rounded quantities differ. The usual schematic orthogonality estimates are

$$
\|\widehat Q_{\rm CGS}^T\widehat Q_{\rm CGS}-I\|\lesssim u\kappa_2(A)^2,
\qquad
\|\widehat Q_{\rm MGS}^T\widehat Q_{\rm MGS}-I\|\lesssim u\kappa_2(A).
$$

These estimates include dimension constants and numerical-rank assumptions. They become uninformative once the right side is order one; they are not equality predictions. A small $\|A-\widehat Q\widehat R\|$ can coexist with poor orthogonality, so ordinary Gram–Schmidt is not generally a backward-stable QR construction in the same sense as Householder QR.

With **reorthogonalisation**, perform Gram–Schmidt again on the computed basis. If $\widehat Q_1\approx\widehat Q_2R_2$ and $A\approx\widehat Q_1R_1$, use the updated triangular factor $R_2R_1$, not just $R_1$. When the first pass retains a sufficiently independent basis and the arithmetic assumptions hold, a second pass can restore orthogonality to $O(u)$.

“Twice is enough” is a powerful practical principle, not permission to ignore numerical rank. If the first pass loses a direction completely, another pass cannot recreate information that has vanished.

## 5. An experiment that separates the two errors

The demonstration uses the full-column-rank matrix

$$
A_\delta=\begin{pmatrix}1&1&1\\\delta&0&0\\0&\delta&0\\0&0&\delta\end{pmatrix}.
$$

Its Gram matrix is $\boldsymbol1\boldsymbol1^T+\delta^2I$, so the eigenvalues are $3+\delta^2,\delta^2,\delta^2$ and

$$
\kappa_2(A_\delta)=\frac{\sqrt{3+\delta^2}}{\delta}\quad(\delta>0).
$$

As $\delta$ shrinks, the columns become nearly parallel. Compare the actual measured Frobenius orthogonality defect $\|\widehat Q^T\widehat Q-I\|_F$ and relative reconstruction error $\|A-\widehat Q\widehat R\|_F/\|A\|_F$ for classical, modified, twice-applied modified Gram–Schmidt, and Householder QR. These are computed measurements, not plotted theoretical bounds. The important distinction is whether both defining QR properties survive.
