## 1. From one eigenpair to a Schur form

Power iteration follows one vector. The **QR eigenvalue algorithm** evolves an entire matrix through orthogonal changes of basis, seeking all its eigenvalues and, when required, its Schur vectors. This chapter is optional, non-examinable enrichment in the course sequence; that label does not remove any of its mathematical development.

For a dense matrix of moderate size, a carefully engineered QR eigensolver is a standard reliable route to Schur form. Its typical overall work is cubic in the dimension after preprocessing and effective shifting. Dimensions of order $10^4$ illustrate the broad scale of dense problems, not a fixed feasibility threshold: memory, hardware, structure, and whether vectors are required all matter. Large sparse problems often need different methods.

The algorithm combines two familiar ingredients: a QR factorisation and the fact that square products $BC$ and $CB$ have the same characteristic polynomial. When $B$ is invertible, $CB=B^{-1}(BC)B$ proves similarity immediately. In general, the determinant identity $\det(I+tBC)=\det(I+tCB)$ gives the polynomial equality even without invertibility. For rectangular products, dimensions and additional zero eigenvalues need separate accounting; here every factor is square.

## 2. Factor, reverse, repeat

Use the notation $B_0=A$ and, for $k=1,2,\ldots$, compute

$$
B_{k-1}=Q_kR_k,\qquad B_k=R_kQ_k.
$$

Here $Q_k$ is orthogonal and $R_k$ upper triangular. In complex arithmetic, use unitary $Q_k$ and conjugate transposes throughout. This is the unshifted algorithm. Do not confuse the factorisation $B_{k-1}=Q_kR_k$ with the eigenvalue iteration that forms the new matrix $R_kQ_k$.

One line explains why this is meaningful:

$$
B_k=Q_k^*B_{k-1}Q_k.
$$

Indeed $Q_k^*B_{k-1}Q_k=Q_k^*Q_kR_kQ_k=R_kQ_k$. Every iterate is therefore unitarily similar to its predecessor and has the original spectrum in exact arithmetic.

### A complete two-by-two step

Take $A=\begin{pmatrix}2&1\\1&2\end{pmatrix}$. A QR factorisation with positive diagonal is

$$
Q_1=\frac1{\sqrt5}\begin{pmatrix}2&-1\\1&2\end{pmatrix},\qquad
R_1=\frac1{\sqrt5}\begin{pmatrix}5&4\\0&3\end{pmatrix}.
$$

Reversing the factors gives

$$
B_1=\frac15\begin{pmatrix}14&3\\3&6\end{pmatrix}.
$$

Its trace is $4$ and determinant $3$, so its eigenvalues remain $3$ and $1$. The off-diagonal magnitude has decreased from $1$ to $3/5$. Other valid QR sign conventions can change displayed off-diagonal signs while preserving the spectrum and the corresponding change of basis.

## 3. Two identities explain the whole iteration

Define accumulated factors

$$
U_k=Q_1Q_2\cdots Q_k,\qquad
S_k=R_kR_{k-1}\cdots R_1,\qquad U_0=S_0=I.
$$

The order of the triangular factors is reversed. The fundamental identities are

$$
B_k=U_k^*AU_k,\qquad A^k=U_kS_k.
$$

The first follows by substituting each successive unitary similarity. For the second, use induction. It is true at $k=0$. Assuming $A^{k-1}=U_{k-1}S_{k-1}$, the factorisation step gives

$$
U_{k-1}^*AU_{k-1}=Q_kR_k,\qquad
AU_{k-1}=U_{k-1}Q_kR_k.
$$

Therefore

$$
A^k=AU_{k-1}S_{k-1}
=U_{k-1}Q_kR_kS_{k-1}=U_kS_k.
$$

Since a product of upper triangular matrices is upper triangular, this is a QR factorisation of the power $A^k$. The algorithm never forms that power; the identity is an explanation of what its accumulated basis achieves.

## 4. Connection with the power method

Read the first column of $A^k=U_kS_k$:

$$
A^ke_1=(S_k)_{11}U_ke_1.
$$

Whenever this column is nonzero, the first column of $U_k$ is parallel to a power iterate. With a diagonalizable matrix, a uniquely largest eigenvalue magnitude and a nonzero dominant component in $e_1$, it approaches the dominant eigendirection, up to sign or phase.

If $u_1=U_ke_1$ is nearly an eigenvector, then

$$
B_ke_1=U_k^*Au_1\approx\lambda_1e_1.
$$

Thus the first column approaches a diagonal entry with zeros below it. Once this direction decouples, the trailing block represents the remaining eigenvalues, and a related argument acts on the remaining basis directions. This describes the mechanism; a full simultaneous-iteration convergence theorem needs suitable spectral gaps and starting-subspace assumptions. It is not a proof of convergence for every unshifted input.

## 5. What convergence and stability do—and do not—mean

If the iteration converges to complex upper triangular $T$ while $U_k$ converges appropriately, then $A=UTU^*$ is Schur form. For a normal matrix, that complex triangular form is diagonal. In real arithmetic a conjugate eigenvalue pair can remain in a real $2\times2$ block; a real normal rotation need not approach a real diagonal matrix.

Unshifted QR can converge slowly or fail to separate tied magnitudes. Practical algorithms add shifts, structural preprocessing and deflation. A particular shift rule is not automatically globally convergent merely because it is called shifted QR.

The QR algorithm grew from work by Francis and Kublanovskaya. Its practical success rests on numerical design as well as these identities: stable QR factorisation and multiplication by orthogonal factors keep each step close to a unitary similarity of nearby data. Accumulated rounding is analysed over the computation, rather than assuming that exact formulas alone establish stability. Backward stability still allows sensitive nonnormal eigenvalues to have substantial forward error.

To see the local error interpretation, regard $Q$ as exactly unitary and write a computed reversed product as $\\widehat B=RQ+F$. Then

$$
\\widehat B=Q^*(QR+E)Q,\\qquad E=QFQ^*,\\qquad \\|E\\|_2=\\|F\\|_2.
$$

The product error can therefore be moved back to a perturbation of the input without amplification by the change of basis. Factorisation errors and the small loss of orthogonality in computed factors also enter a full analysis. A well-implemented QR eigensolver is backward stable: its computed Schur result corresponds, to rounding accuracy, to a nearby matrix. This controls the matrix error, while eigenvalue conditioning determines what that means for the eigenvalues.

The related SVD problem can be approached algebraically through eigenvectors of $A^*A$, then normalising $Av_i$ for positive singular values. This requires special handling at zero singular values and can lose relative accuracy by squaring conditioning. The Golub–Kahan bidiagonalisation route avoids explicitly forming the Gram matrix and will be developed later.
