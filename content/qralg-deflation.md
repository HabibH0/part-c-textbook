## 1. A zero coupling splits the problem

Suppose an upper Hessenberg iterate has $h_{n,n-1}=0$. All earlier entries in its final row are already zero by structure, so it has block form

$$
H=\begin{pmatrix}H_{11}&c\\0&d\end{pmatrix}.
$$

Its characteristic polynomial factors as

$$
\det(zI-H)=\det(zI-H_{11})(z-d).
$$

Thus $d$ is an eigenvalue and the others belong to the leading $(n-1)\times(n-1)$ block. There is no need to keep iterating on the isolated scalar. Removing it from the active eigenvalue problem is **deflation**. The coupling column $c$ need not vanish: a triangular Schur form is enough, and the matrix need not be normal.

An interior subdiagonal zero similarly splits the matrix into two triangularly coupled blocks whose spectra can be treated separately. A real conjugate eigenvalue pair may instead be isolated as a $2\times2$ block. Real arithmetic should not try to force the pair into two real diagonal entries.

## 2. Small is meaningful only relative to a scale

In floating-point arithmetic the coupling will rarely be exactly zero. A common conceptual test compares

$$
|h_{j+1,j}|\le\tau\bigl(|h_{jj}|+|h_{j+1,j+1}|\bigr),
$$

where $\tau$ is a small tolerance tied to working precision and the desired accuracy. Robust implementations use additional scale and safe-minimum safeguards when the diagonal scale is tiny. A bare test such as “less than $10^{-8}$” is not scale invariant.

Replacing the coupling $e=h_{j+1,j}$ by zero adds the rank-one perturbation

$$
E=-e\,e_{j+1}e_j^T,\qquad \|E\|_2=|e|.
$$

This supplies a direct backward-error interpretation: we solve a nearby split problem. For example, if the two adjacent diagonal magnitudes sum to $5$ and $\tau=10^{-6}$, a coupling of $3\times10^{-6}$ passes the threshold $5\times10^{-6}$; a coupling of $8\times10^{-6}$ does not.

Small backward perturbation does not guarantee an equally small forward change in every eigenvalue of a highly nonnormal matrix. The conditioning distinction remains important even at the final deflation decision.

## 3. The active-block algorithm

After Hessenberg reduction, set the active size $m=n$ and retain the accumulated orthogonal basis. Repeat the following process:

1. Inspect the bottom coupling of the active block. If it is sufficiently small, set it to zero, record the isolated eigenvalue, and reduce $m$ by one. Repeat this check if another coupling is already small.
2. Otherwise, choose a shift from the active trailing block, factor the shifted Hessenberg block using rotations, and reverse the factors with the shift restored.
3. Apply the same transformations to the rest of the matrix where needed, and accumulate them in the Schur basis if vectors are required.

For the scalar-deflation version, stop when $m=1$. Production real algorithms also recognise converged $2\times2$ blocks and use strategies for stalled iterations. An iteration cap should report unfinished work instead of labelling unconverged diagonal entries as eigenvalues.

Preserving the rest of the matrix matters if a full Schur factorisation is wanted. If $H=\begin{pmatrix}B&C\\0&D\end{pmatrix}$ and the active block uses $Q$, then the embedded similarity gives

$$
\begin{pmatrix}Q^T&0\\0&I\end{pmatrix}
H\begin{pmatrix}Q&0\\0&I\end{pmatrix}
=\begin{pmatrix}Q^TBQ&Q^TC\\0&D\end{pmatrix}.
$$

The inactive trailing block stays fixed, but its upper coupling transforms. Merely replacing $B$ and forgetting this update would break the recorded full similarity.

## 4. Why the overall cost is cubic

The Hessenberg reduction costs $O(n^3)$. One QR step on an active block of size $m$ costs $O(m^2)$. Well-designed shifted methods often need only a small number of steps per converged eigenvalue—two to four is a useful empirical illustration, not a uniform theorem for every input.

With a bounded typical count $c$ per deflation, the iterative work is proportional to

$$
c\sum_{m=2}^n m^2
=c\left(\frac{n(n+1)(2n+1)}6-1\right)=O(n^3).
$$

Together with preprocessing, this explains the usual cubic cost. An estimate such as roughly $25n^3$ floating-point operations is an illustrative engineering scale, not a fixed count for every matrix or implementation. Shift policy, convergence, arithmetic type and whether Schur vectors are accumulated affect the constant. Repeatedly computing dense cubic QR steps would instead lead to a quartic estimate under the same iteration-count assumption.

## 5. Read a convergence experiment

The demonstration uses one explicitly displayed real symmetric $5\times5$ Hessenberg matrix with a known spectrum. It compares unshifted QR with trailing-diagonal shifts under the same relative deflation tolerance. This real-spectrum example lets the simple scalar-deflation implementation complete without needing a real double-shift method.

Each coloured curve tracks one $|h_{i+1,i}|$ on a logarithmic scale. Falling subdiagonal magnitudes indicate decoupling, and deflated entries remain zero. A value below the plot floor is displayed at that floor and labelled as clipped; numerical zero is not the real number $10^{-16}$.

Shifts can change a convergence history from hundreds of iterations to a handful of sweeps on suitable examples. The exact counts depend on the chosen matrix, shift policy, tolerance and rounding. The app calculates its own counts rather than treating an illustrative plot as a universal benchmark. The active matrix and recorded shifts show what happened at any selected step.

Compare the full reconstruction residual $\|A-UTU^T\|_F/\|A\|_F$ as well as the diagonal entries. Before convergence the iterate is still a similar Hessenberg matrix, not a final triangular Schur factor. After deflation, a small reconstruction residual quantifies the total rounding and explicit splitting perturbations for this example.
