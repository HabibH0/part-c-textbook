## 1. A small entry change with a much larger spectral effect

Weyl's theorem controls singular values of every matrix and eigenvalues of Hermitian matrices under Hermitian perturbations. It does **not** say that eigenvalues of arbitrary nonsymmetric matrices have the same sensitivity.

You need characteristic polynomials, complex roots, spectral norms, and the distinction between eigenvalues and singular values. Consider the defective Jordan block

$$
J=\begin{pmatrix}1&1\\0&1\end{pmatrix}.
$$

Its characteristic polynomial is $(\lambda-1)^2$. It has two eigenvalues counted with multiplicity, both equal to $1$, but its eigenspace is only $\operatorname{span}(e_1)$. There is no eigenbasis.

Perturb its lower-left entry:

$$
J+E=\begin{pmatrix}1&1\\\varepsilon&1\end{pmatrix},\qquad E=\begin{pmatrix}0&0\\\varepsilon&0\end{pmatrix},\qquad \varepsilon>0.
$$

The perturbation has spectral norm $\varepsilon$: it sends $(x_1,x_2)$ to $(0,\varepsilon x_1)$, attaining that stretch at $e_1$. But

$$
\det(\lambda I-J-E)=(\lambda-1)^2-\varepsilon,
$$

so the two eigenvalues are $1+\sqrt\varepsilon$ and $1-\sqrt\varepsilon$. Each moves by $\sqrt\varepsilon$. The ratio of eigenvalue movement to matrix error is

$$
\frac{\sqrt\varepsilon}{\varepsilon}=\frac1{\sqrt\varepsilon},
$$

which grows without bound as $\varepsilon\to0$. At $\varepsilon=10^{-8}$, the movement is $10^{-4}$, an amplification factor of $10^4$.

This is fully consistent with Weyl: its general bound concerns **singular values**, not these nonsymmetric eigenvalues. The singular values of $J+E$ still move by at most $\varepsilon$.

## 2. A Jordan block of any size

For $n\ge2$, let $J_n$ have ones on the diagonal and on the first superdiagonal, with all other entries zero. Add $E=\varepsilon e_ne_1^T$, which places $\varepsilon$ in the bottom-left corner. Again $\|E\|_2=\varepsilon$.

Set $C=J_n+E-I$. For an eigenpair $Cx=zx$, the first $n-1$ equations are

$$
x_2=zx_1,\quad x_3=zx_2,\quad\ldots,\quad x_n=zx_{n-1}.
$$

The last is $\varepsilon x_1=zx_n$. If $x_1=0$, the recurrence forces all coordinates to be zero, which an eigenvector cannot be. Hence

$$
z^n=\varepsilon.
$$

Conversely, each root gives a nonzero eigenvector $(1,z,\ldots,z^{n-1})^T$. Therefore all eigenvalues are

$$
\lambda_k=1+\varepsilon^{1/n}\exp(2\pi\mathrm i k/n),\qquad k=0,\ldots,n-1.
$$

They lie on a circle centred at $1$ with radius $\varepsilon^{1/n}$. For this specific perturbation the radius is **exactly** that number, not merely a leading approximation. The characteristic polynomial is $(\lambda-1)^n-\varepsilon$. For positive $\varepsilon$, the roots are distinct; most need not be real even though all matrix entries are real.

The amplification factor is $\varepsilon^{1/n-1}$. Fixing a tiny $\varepsilon$ and increasing the block size can make the eigenvalue motion strikingly large. For $n=100$ and $\varepsilon=10^{-100}$,

$$
\varepsilon^{1/n}=10^{-1}=0.1.
$$

Thus a matrix perturbation of norm $10^{-100}$ moves every eigenvalue a distance $0.1$ from the original value $1$. This is an exact mathematical example; it does not assume that an arbitrary numerical implementation can resolve all entries or roots to unlimited precision.

The demonstration uses the explicit root formula to show this circle. It avoids confusing sensitivity of the mathematical problem with errors introduced by a polynomial-root algorithm.

## 3. What changes in the Jordan structure?

At $\varepsilon=0$, $J_n$ is one Jordan block of size $n$. At every $\varepsilon>0$ in this example, the eigenvalues are distinct, so $J_n+E$ is diagonalizable over $\mathbb C$ and all its Jordan blocks have size one.

An arbitrarily small nonzero perturbation can therefore change both the eigenvalues and the block-size pattern. Jordan form is a powerful exact classification under similarity, but its structure is not a robust numerical description of data with small unknown errors. Testing whether a nearly zero quantity is **exactly** zero is intrinsically fragile.

This does not mean all nonsymmetric matrices are badly conditioned, or that every perturbation of a Jordan block is equally damaging. It exhibits a family in which no fixed linear bound $C\|E\|$ can control the eigenvalue displacement near the defective matrix.

## 4. Optional, non-examinable extension: diagonalizable matrices

The behaviour is more controlled when $A$ is diagonalizable:

$$
A=X\Lambda X^{-1},\qquad\kappa_2(X)=\|X\|_2\|X^{-1}\|_2.
$$

The spectral condition number $\kappa_2(X)$ measures how strongly changing between eigenvector coordinates and ordinary coordinates can distort lengths. It is at least one. An orthonormal eigenbasis has condition number one; nearly dependent eigenvectors can make it large. It depends on the chosen scaling of the eigenvectors, so fix a particular eigenvector matrix when using the bound.

A precise form of the linear perturbation statement is **Bauer–Fike**: every eigenvalue $\mu$ of $A+E$ lies within

$$
\kappa_2(X)\|E\|_2
$$

of at least one eigenvalue of $A$. This is a proximity statement about the spectrum. It is not a claim that arbitrarily labelled eigenvalues match one-to-one under that same bound.

### Why the factor appears

If $\mu$ is already an eigenvalue of $A$, its distance is zero. Otherwise $\mu I-A$ is invertible. Choose a unit eigenvector $z$ of $A+E$. Rearranging gives

$$
z=(\mu I-A)^{-1}Ez.
$$

Hence $1\le\|(\mu I-A)^{-1}\|_2\|E\|_2$. Diagonalisation gives

$$
(\mu I-A)^{-1}=X(\mu I-\Lambda)^{-1}X^{-1}.
$$

The middle diagonal matrix has norm $1/\min_j|\mu-\lambda_j|$, so

$$
1\le\frac{\kappa_2(X)\|E\|_2}{\min_j|\mu-\lambda_j|}.
$$

Rearranging proves the bound. It explains the statement that a perturbation of size $\varepsilon$ leads to eigenvalue changes of order $c\varepsilon$, where $c$ depends on the eigenvector conditioning, in the diagonalizable setting.

For a fixed well-conditioned $X$, this is much better behaved than $\varepsilon^{1/n}$. But near a defective matrix, $X$ can be extremely ill conditioned. “Diagonalizable” alone does not imply numerically insensitive eigenvalues.

## 5. Separate the algorithm from the problem

A backward stable eigensolver may accurately compute the spectrum of a nearby matrix while the eigenvalues of the original nonsymmetric matrix remain sensitive. The algorithm can be doing its job even when some forward errors are large.

For a normal matrix, a unitary eigenvector matrix makes $\kappa_2(X)=1$, so Bauer–Fike gives spectral proximity without amplification. For Hermitian matrices and Hermitian perturbations, Weyl gives the stronger convenient comparison of the $i$th ordered real eigenvalues. These statements have different assumptions and different notions of matching.

In practice, first ask which spectral quantity is being computed, what structure the matrix and perturbation preserve, and whether the relevant condition number is moderate. The numerical reliability of an eigenvalue cannot be inferred merely from the number of digits printed by a program.
