## 1. Appending rows cannot reduce ordered singular values

Courant–Fischer is a way to prove statements about whole spectra without finding any singular vectors explicitly. This lesson develops two block-matrix comparisons and then reviews which decompositions describe a matrix in useful coordinates.

The block comparisons in Sections 1–3 are an optional extension. The decomposition review that follows brings together the main forms used throughout the course.

Let $A_1\in\mathbb C^{m_1\times n}$ and $A_2\in\mathbb C^{m_2\times n}$ have the same number of columns, and form

$$
B=\begin{pmatrix}A_1\\A_2\end{pmatrix}.
$$

For every compatible index $i$,

$$
\boxed{\sigma_i(B)\ge\max\{\sigma_i(A_1),\sigma_i(A_2)\}.}
$$

If a component is too short to have an $i$th conventional singular value, pad its input-space singular-value list with zeros. This keeps the comparisons dimensionally meaningful; one can instead restrict $i$ to values present in every list.

For any $x$,

$$
\|Bx\|_2^2=\|A_1x\|_2^2+\|A_2x\|_2^2\ge\|A_jx\|_2^2,\qquad j=1,2.
$$

Take square roots, restrict to unit vectors in a **fixed** $i$-dimensional subspace $S$, and minimise. The inequality is pointwise, so the minimum for $B$ is at least the minimum for each $A_j$ on that same $S$. Now maximise over $S$. Courant–Fischer gives $\sigma_i(B)\ge\sigma_i(A_j)$ for each $j$, proving the maximum-of-two statement.

The geometric reason is that extra output coordinates add squared length. They cannot cancel measurements already present in $A_1x$.

### Example and equality

Take $A_1=\operatorname{diag}(3,1)$ and $A_2=(0,t)$. Then

$$
B^*B=\operatorname{diag}(9,1+t^2).
$$

The singular values are $3$ and $\sqrt{1+t^2}$, **sorted**. Before $|t|=\sqrt8$, the smaller value grows while the larger stays at $3$. Beyond that point their order switches. The theorem compares ordered values, not a permanently labelled coordinate direction. Appending a zero row gives equality for the entire spectrum, so an increase need not be strict.

## 2. Appending columns: enlarge the choices of subspace

Now let $A_1\in\mathbb C^{m\times n_1}$ and $A_2\in\mathbb C^{m\times n_2}$ have the same number of rows, and form

$$
C=\begin{pmatrix}A_1&A_2\end{pmatrix}.
$$

Again,

$$
\boxed{\sigma_i(C)\ge\max\{\sigma_i(A_1),\sigma_i(A_2)\}.}
$$

The row-stacking proof cannot be copied word for word: the full input is now $(x_1,x_2)$ and $Cx=A_1x_1+A_2x_2$, whose two contributions **can cancel**. Instead use a restriction on the outer optimisation.

Embed $\mathbb C^{n_1}$ isometrically into the full input space by $x_1\mapsto(x_1,0)$. Each $i$-dimensional subspace $S_1\subset\mathbb C^{n_1}$ gives an $i$-dimensional subspace

$$
\widetilde S_1=\{(x_1,0):x_1\in S_1\}\subset\mathbb C^{n_1+n_2}.
$$

On this embedded subspace, $\|C(x_1,0)\|_2=\|A_1x_1\|_2$ and the input norms agree. Maximising the inner minimum over **all** full-space subspaces can only be at least the maximum over this restricted family. The latter is $\sigma_i(A_1)$. Repeat with $(0,x_2)$ for $A_2$.

Alternatively, apply the row-stacking result to $C^*=\binom{A_1^*}{A_2^*}$ and use equality of a matrix's and its adjoint's conventional singular values. This gives a short independent proof and handles rectangular shapes cleanly.

For example, $A_1=(1)$ and $A_2=(1)$ yield $C=(1,1)$ with singular value $\sqrt2\ge1$. Yet $C(1,-1)^T=0$. The comparison does not say that every input direction becomes stronger or that appending columns removes a null space.

## 3. Deleting rows and columns

Reverse the previous conclusions: deleting rows or columns cannot increase corresponding ordered singular values. Repeated deletion implies

$$
\sigma_i(M)\le\sigma_i(A)
$$

for any submatrix $M$ of $A$ and indices present in the smaller matrix's singular-value list. The dimensions and the ordering must still be tracked. This is a monotonicity statement, not a claim of equality or a complete interlacing theorem.

It also does not imply that a condition number improves when measurements are added. Both extreme singular values can change. For example, appending a strong measurement in an already strong direction can increase $\sigma_1$ while leaving $\sigma_{\min}$ fixed, worsening their ratio. Appending a row in a previously weak direction can do the opposite. The demonstration shows both choices.

## 4. A map of matrix decompositions

A decomposition is a mathematical statement with assumptions, not just a product of letters. Distinguish transformations using two bases from **similarity** transformations using one basis and its inverse.

| Decomposition | Form and assumptions | What the factors mean |
| --- | --- | --- |
| Singular value decomposition | $A=U\Sigma V^*$ for every real or complex rectangular matrix | Orthonormal factors and a nonnegative diagonal; two possibly different bases |
| Eigenvalue decomposition | $A=X\Lambda X^{-1}$ for a diagonalizable square matrix | Eigenvectors in $X$ and eigenvalues in diagonal $\Lambda$ |
| Normal spectral decomposition | $A=Q\Lambda Q^*$ when $A^*A=AA^*$ | A unitary eigenbasis; eigenvalues can be complex |
| Symmetric or Hermitian spectral decomposition | $A=Q\Lambda Q^*$ with real $\Lambda$ | For real symmetric $A$, $Q$ can be real orthogonal |
| Jordan decomposition | $A=XJX^{-1}$ for every square matrix over $\mathbb C$ | A block-diagonal matrix of Jordan blocks |
| Schur decomposition | $A=QTQ^*$ for every complex square matrix | $Q$ unitary, $T$ upper triangular |
| QR factorisation | $A=QR$; for tall $A$, thin $Q$ has orthonormal columns | $R$ is upper triangular; no eigenbasis is required |
| LU factorisation | $A=LU$ when elimination can proceed without row exchanges; more generally $PA=LU$ | $L$ lower triangular, $U$ upper triangular, and $P$ a row permutation |

In real arithmetic, the real Schur form is generally **quasi-triangular**, with $1\times1$ and $2\times2$ diagonal blocks. The $2\times2$ blocks accommodate complex conjugate eigenvalue pairs. Real triangular Schur form is available when all eigenvalues are real. Do not silently apply the complex triangular statement while insisting every factor be real.

For a tall $m\times n$ matrix, thin QR has $Q\in\mathbb R^{m\times n}$ and $R\in\mathbb R^{n\times n}$. It exists even if $A$ is rank deficient, though $R$ is then singular. A full QR uses a square orthogonal $Q$ and an upper trapezoidal factor. LU needs suitable pivots: the nonsingular matrix $\begin{pmatrix}0&1\\1&0\end{pmatrix}$ already shows why row exchanges can be necessary. Algorithms for QR and pivoted LU come next; here the aim is to recognise the forms and their assumptions.

## 5. Jordan form and Schur form serve different purposes

A Jordan block of length $s$ is

$$
J_s(\lambda)=\begin{pmatrix}\lambda&1&&0\\&\lambda&\ddots&\\&&\ddots&1\\0&&&\lambda\end{pmatrix}.
$$

Jordan form is a block diagonal collection of these blocks. It refines an eigenvalue decomposition by accommodating missing eigenvectors through generalised eigenvector chains. Diagonalizability means all the blocks have size one. The eigenvalues and block sizes classify a complex matrix up to similarity, apart from the order of blocks.

That exact classification is numerically fragile. The previous lesson's example turns a size-$n$ Jordan block into $n$ distinct eigenvalues under an arbitrarily small perturbation. The matrix of generalised eigenvectors can also be ill conditioned. Jordan form is therefore not a dependable target for computing the exact structure of noisy data.

Schur form instead uses a unitary basis and keeps an upper triangular $T$, including its off-diagonal entries. Its diagonal contains the eigenvalues because the characteristic polynomial of a triangular matrix is the product of its diagonal factors. It exists even for defective matrices: a Jordan block is already an upper triangular Schur factor with $Q=I$.

## 6. Orthogonal transformations and numerical reliability

The SVD, Schur form, and QR are built from orthogonal or unitary factors; normal and Hermitian spectral decompositions also admit a unitary eigenbasis. Unit-length preservation means these coordinate transformations have spectral condition number one. Backward stable algorithms are available for the SVD, Schur form, and QR, and for the Hermitian eigenproblem.

This is a statement about the **existence of suitable algorithms**, not a guarantee for every implementation that writes the same factorisation. Nor does it remove inherent sensitivity: a stable Schur algorithm for a nonsymmetric matrix may still reveal very sensitive eigenvalues. General eigenvector and Jordan similarity factors need not be well conditioned. LU is not an orthogonal factorisation and requires its own pivoting and stability analysis.

The chapter's conclusions fit together: subspace extrema characterise spectra, perturbation bounds quantify some sensitivities, and the choice of decomposition determines which structure an algorithm can exploit. The next chapter turns to solving linear systems using elimination and triangular factors.
