## 1. Repeated multiplication selects a direction

The **power method** seeks one dominant eigenpair, not the whole spectrum. Start with a nonzero vector $x_0$ and normalise it. Repeat

$$
y_{k+1}=Ax_k,\qquad x_{k+1}=\frac{y_{k+1}}{\|y_{k+1}\|_2}.
$$

If $y_{k+1}=0$, this step cannot be normalised: the starting direction or current iterate lies in the nullspace. Handle that case explicitly instead of dividing by zero. A random start is often used to avoid missing a desired component, but a particular specified start may still be unsuitable.

For a unit real vector the **Rayleigh quotient** is $\rho(x)=x^TAx$; for a general nonzero complex vector it is

$$
\rho(x)=\frac{x^*Ax}{x^*x}.
$$

If $x$ is an exact eigenvector, this quotient equals its eigenvalue. After each step, evaluate $\widehat\lambda_k=\rho(x_k)$ and the residual $r_k=Ax_k-\widehat\lambda_kx_k$.

Normalising at every step prevents straightforward powers from becoming extremely large or small. In exact arithmetic it changes the scale, not the direction: $x_k$ is parallel to $A^kx_0$ whenever all the intervening products are nonzero. An individual matrix–vector product can still overflow for extreme data; normalisation is not unlimited-range arithmetic.

## 2. The convergence proof

Assume $A$ is diagonalizable with an eigenbasis $v_1,\ldots,v_n$, and order eigenvalues so that

$$
|\lambda_1|>|\lambda_2|\ge\cdots\ge|\lambda_n|.
$$

The crucial strict gap is between the largest and second-largest magnitudes; lower magnitudes may be equal. Expand $x_0=\sum_i c_iv_i$ and require $c_1\ne0$. Then

$$
A^kx_0=\sum_i c_i\lambda_i^kv_i
=\lambda_1^k\left(c_1v_1+\sum_{i=2}^n c_i\left(\frac{\lambda_i}{\lambda_1}\right)^kv_i\right).
$$

Let $q=|\lambda_2/\lambda_1|<1$. The trailing sum is bounded by a constant times $q^k$; after dividing by the leading component, the direction approaches the line through $v_1$ geometrically. Constants depend on the coefficients and conditioning of the eigenbasis. A very small $c_1$ or a poorly conditioned basis can delay the asymptotic behaviour.

This is **linear convergence** in numerical-analysis terminology: once close enough, the error shrinks by approximately a fixed factor per step. It does not mean the error is a straight line as a function of the iteration number.

If $\lambda_1<0$, real normalised vectors may alternate signs rather than converge to one signed vector. With complex eigenvalues, a phase can rotate. The meaningful convergence is to an eigendirection, up to sign or phase. The Rayleigh quotient is unaffected by that ambiguity.

## 3. A worked iteration and an exact error formula

Take $A=\operatorname{diag}(3,1)$ and $x_0=(1,1)^T/\sqrt2$. After $k$ steps,

$$
x_k=\frac{(3^k,1)^T}{\sqrt{9^k+1}}.
$$

The ratio of unwanted to wanted components is $3^{-k}$, so the direction converges with factor $1/3$. The eigenvalue estimate is

$$
\rho(x_k)=\frac{3\cdot9^k+1}{9^k+1},\qquad
3-\rho(x_k)=\frac{2}{9^k+1}.
$$

For this symmetric example the Rayleigh quotient error decreases like the square of the directional error. More generally, if a unit vector near a symmetric eigenvector is $x=\cos\theta\,v+\sin\theta\,w$, with $w\perp v$, then

$$
x^TAx-\lambda=\sin^2\theta\,(w^TAw-\lambda).
$$

The cross terms vanish because $Av=\lambda v$ and $A=A^T$. Do not assume this quadratic Rayleigh-quotient accuracy for every nonnormal matrix.

## 4. Cases where the simple conclusion fails

If $c_1=0$, exact arithmetic never creates a missing dominant component: $\operatorname{diag}(3,1)$ started at $e_2$ stays at $e_2$. A random vector drawn from a continuous distribution avoids this exact subspace with probability one, but that does not quantify how large its useful component is.

If dominant magnitudes tie, the power method need not select one eigenvector. For $A=\operatorname{diag}(3,-3)$ and a start with both components nonzero, the relative sign alternates forever. A real rotation can keep rotating a direction. Repeated equal eigenvalues present a different case: the iterate can stay in their common eigenspace without selecting a unique basis vector.

If the ratio $q$ is close to one, convergence can be slow. Reducing a trailing component by a factor $\tau$ takes approximately $k\ge\log(\tau)/\log(q)$ steps, ignoring the initial coefficient factor. Defective matrices need a different analysis, potentially involving polynomial factors in $k$; the diagonalizable proof does not apply unchanged.

## 5. Residuals, cost and what is being approximated

For unit $x$, the residual $r=Ax-\rho x$ vanishes exactly at an eigenpair. A scale-aware measure is

$$
\frac{\|r\|_2}{\|A\|_2+|\rho|}
$$

when the denominator is nonzero. The perturbation $E=-rx^*$ satisfies $(A+E)x=\rho x$ and $\|E\|_2=\|r\|_2$. Thus a small residual gives an unstructured nearby-matrix interpretation. It does not certify that this is the *dominant* eigenvalue or that the eigenvector is insensitive.

A dense matrix–vector product costs $O(n^2)$; sparse storage can make it proportional to the number of nonzeros. Normalisation and a quotient cost only vector operations and another application of $A$ if needed. Avoid explicitly forming $A^k$.

## 6. The bridge to broader eigenvalue algorithms

If $A^k=Q_kR_k$, the first column of $Q_k$ is, up to a sign or phase convention, the normalisation of $A^ke_1$, provided that first column is nonzero. Under the same dominance and nonzero-component assumptions it approaches the dominant eigendirection. This observation links powers and QR factorisation.

Multiplying repeatedly also generates the Krylov sequence $x_0,Ax_0,A^2x_0,\ldots$. Arnoldi and, for symmetric or Hermitian problems, Lanczos exploit such spaces. The QR eigenvalue algorithm develops related ideas into a method for the whole spectrum. Those methods go beyond the single-vector power method presented here.
