## 1. From a teaching algorithm to a practical solver

The basic ingredients are now in place: orthogonal similarity, a useful shift, cheap Hessenberg steps, and deflation. Practical implementations add further techniques to improve speed and handle cases a simple scalar-shift loop cannot. This lesson retains those optional refinements at a conceptual level; it does not claim that the small demonstrations implement a complete production eigensolver.

## 2. Conjugate double shifts use real arithmetic

A real matrix may have complex eigenvalues. Instead of applying a single nonreal shift and turning every entry complex, pair the shifts $s=a+ib$ and $\overline s=a-ib$. Their polynomial is

$$
(A-sI)(A-\overline sI)
=A^2-(s+\overline s)A+s\overline s I
=A^2-2aA+(a^2+b^2)I.
$$

Every coefficient is real. Thus the paired polynomial admits a real QR factorisation even though its shifts are nonreal. For $s=2+3i$, the polynomial is $A^2-4A+13I$.

At the level of the accumulated-factor theorem, factoring this quadratic polynomial supplies the change of basis associated with a conjugate-pair shift. Practical **implicit double-shift** methods implement the effect through local transformations while maintaining Hessenberg form; they do not normally form a dense $A^2$ at each iteration. Forming the displayed polynomial in the small demonstration illustrates the identity, not the efficient implementation.

The pair can encourage convergence of a real $2\times2$ Schur block containing conjugate eigenvalues. Keeping that block is a successful real Schur result. It is not a failure to make two impossible real diagonal eigenvalues.

## 3. Aggressive early deflation

Ordinary scalar deflation watches a single bottom coupling. **Aggressive early deflation** examines a trailing window, for example a block of around $100\times100$ in a sufficiently large problem, to discover several eigenvalues or blocks that are already almost decoupled.

Conceptually, compute a small Schur form in the window and transform the coupling to the rest of the matrix into that local basis. Check whether particular directions have coupling small enough to discard as a controlled backward perturbation. Reordering the local Schur blocks can bring these nearly isolated directions into positions where they can be deflated together.

The window need not be exactly 100: its useful size depends on the active matrix and implementation. A local Schur form alone is not evidence of decoupling; the transformed coupling is what must be tested. In a Hessenberg problem that coupling has a restricted shape, which makes the examination economical.

This technique, associated with work by Braman, Byers and Mathias, can produce dramatic practical speedups. An order-of-magnitude improvement is an illustrative possibility, not a promised tenfold improvement for every matrix. It reduces time spent sweeping over eigenvalues that are already sufficiently resolved, even when the simple bottom-entry test has not yet detected them.

## 4. Balancing changes coordinate scales

Before iteration, one may apply a diagonal similarity

$$
B=DAD^{-1},\qquad D\text{ nonsingular and diagonal}.
$$

The goal is to reduce severe row/column scale disparities, often reducing the norm of the matrix presented to the eigensolver and improving the eigenvalue conditioning in those coordinates. Similarity preserves the eigenvalues exactly:

$$
\det(zI-B)=\det(D(zI-A)D^{-1})=\det(zI-A).
$$

For

$$
A=\begin{pmatrix}1&100\\0.01&2\end{pmatrix},\qquad
D=\begin{pmatrix}0.1&0\\0&10\end{pmatrix},
$$

we obtain

$$
B=\begin{pmatrix}1&1\\1&2\end{pmatrix}.
$$

Both matrices have trace $3$, determinant $1$, and eigenvalues $(3\pm\sqrt5)/2$. The new matrix is symmetric, while the original coordinates make one off-diagonal entry ten thousand times the other. Its Frobenius norm falls from approximately $100.025$ to $\sqrt7$.

## 5. Balancing has a different stability story

Unlike an orthogonal transformation, a diagonal scaling need not preserve norms. If a stable computation on $B$ solves a perturbed problem $B+E_B$, transforming back gives

$$
D^{-1}(B+E_B)D=A+D^{-1}E_BD,\qquad
\|D^{-1}E_BD\|_2\le\|D^{-1}\|_2\|D\|_2\|E_B\|_2.
$$

The factor is $\kappa_2(D)$. Thus a small backward error measured in balanced coordinates is not automatically equally small in the original norm. Balancing is a useful scaling strategy, not a universal guarantee that every conditioning or error measure improves.

If $B=UTU^*$, then $A=(D^{-1}U)T(U^*D)$. This is a similarity representation of the original matrix, but $D^{-1}U$ is generally not unitary. Keep track of scaling when interpreting eigenvectors or claiming an orthogonal Schur basis of the original input.

The demonstration varies the diagonal scale and shows both norm reduction and $\kappa_2(D)$, while checking the unchanged trace and determinant. Over-scaling can make the norm large again. Choosing a scale sensibly requires looking at the transformed problem and the route back to the original one.

## 6. Where this leads next

For symmetric matrices, Hessenberg reduction becomes tridiagonal reduction and specialised shifts and deflation are particularly effective. For the SVD, bidiagonalisation plays the corresponding structural role. These are closely related applications of orthogonal transformations, but their details deserve their own development rather than being inferred from a general nonsymmetric QR loop.
