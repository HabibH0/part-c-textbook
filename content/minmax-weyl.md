## 1. What changes when the matrix changes?

Measurements, rounding, and approximations can replace $A$ by $A+E$. A perturbation bound asks how far a quantity of interest can move in response to the matrix error $E$.

The inequality in this lesson is named for Hermann Weyl, a prominent twentieth-century mathematician.

You need the spectral norm, Courant–Fischer, and the triangle inequality. Put $\delta=\|E\|_2$. The action bound says $\|Ex\|_2\le\delta\|x\|_2$ for every $x$.

**Weyl's singular-value inequality** states that for any two matrices $A,E$ of the same shape,

$$
|\sigma_i(A+E)-\sigma_i(A)|\le\delta,\qquad 1\le i\le\min(m,n).
$$

Each spectrum is sorted in descending order before matching the $i$th values. Equivalently,

$$
\sigma_i(A+E)\in[\sigma_i(A)-\delta,\ \sigma_i(A)+\delta].
$$

Since singular values are nonnegative, an interval's lower endpoint can be sharpened to $\max(0,\sigma_i(A)-\delta)$. The theorem holds whether or not $A$ is symmetric, square, or full rank.

## 2. Derivation from the min–max principle

For every nonzero $x$, the triangle inequality gives

$$
\|(A+E)x\|_2\le\|Ax\|_2+\|Ex\|_2.
$$

Applying it again to $Ax=(A+E)x-Ex$ supplies the reverse bound. Dividing by $\|x\|_2$ yields the uniform sandwich

$$
g_A(x)-\delta\le g_{A+E}(x)\le g_A(x)+\delta.
$$

“Uniform” means the same $\delta$ works for every vector. For a **fixed** subspace $S$, taking minima preserves these inequalities:

$$
\min_S g_A-\delta\le\min_S g_{A+E}\le\min_S g_A+\delta.
$$

The minima are over nonzero vectors in $S$. The step is valid even when the minimising vectors differ. For example, to prove the upper inequality, evaluate $g_{A+E}$ at a minimiser of $g_A$; to prove the lower one, every vector's value is bounded below by $\min_S g_A-\delta$.

Now maximise over all subspaces of dimension $i$ and use Courant–Fischer:

$$
\sigma_i(A)-\delta\le\sigma_i(A+E)\le\sigma_i(A)+\delta.
$$

This proves the result for tall matrices. For wide matrices apply it to the adjoints, which have the same nonzero singular values and spectral norm, or use the zero-padded input-space formulation. No differentiability, distinctness, or eigenvector tracking is required.

### The spectral-norm special case

At $i=1$, $\sigma_1(A)=\|A\|_2$, so

$$
\|A\|_2-\|E\|_2\le\|A+E\|_2\le\|A\|_2+\|E\|_2.
$$

The upper inequality is the matrix-norm triangle inequality; the lower follows by reversing its roles. If the lower expression is negative, it remains a valid but uninformative bound.

## 3. Hermitian eigenvalues need Hermitian perturbations

If **both $H$ and $E$ are Hermitian**, then $H+E$ is Hermitian and its real ordered eigenvalues satisfy

$$
|\lambda_i(H+E)-\lambda_i(H)|\le\|E\|_2.
$$

In the real case, require both matrices to be symmetric. Symmetry of $H$ alone is not enough to apply this ordered-real-eigenvalue statement to an arbitrary nonsymmetric perturbation.

For a unit vector, Cauchy–Schwarz and the action bound give

$$
|x^*Ex|\le\|x\|_2\|Ex\|_2\le\delta.
$$

Consequently $\rho_H(x)-\delta\le\rho_{H+E}(x)\le\rho_H(x)+\delta$. Take the same inner minima and outer maxima as in the eigenvalue form of Courant–Fischer. This proves the eigenvalue inequality. Unlike the singular-value intervals, eigenvalue intervals may extend below zero without any clipping.

### A bound can be attained

If $E=tI$ with real $t$, then every eigenvalue changes by exactly $t$, while $\|E\|_2=|t|$. Thus the constant one cannot be reduced. For positive diagonal $A$ and a sufficiently small common shift that preserves nonnegativity, its singular values also shift by $t$ and attain the bound.

Not every perturbation is this severe. For

$$
H=\begin{pmatrix}4&0\\0&1\end{pmatrix},\qquad E=\begin{pmatrix}0&t\\t&0\end{pmatrix},
$$

we have $\|E\|_2=|t|$ and

$$
\lambda_{1,2}(H+E)=\frac{5\pm\sqrt{9+4t^2}}2.
$$

Both absolute shifts are $(\sqrt{9+4t^2}-3)/2\le|t|$. This family illustrates a worst-case guarantee rather than an equality for all inputs. The demonstration compares it with the common-shift example.

## 4. What “well conditioned” means here

Weyl's bound gives absolute sensitivity at most one: an input error of spectral norm $\delta$ changes each singular value, or each ordered Hermitian eigenvalue under a Hermitian perturbation, by at most $\delta$.

Relative accuracy is a different question. If $\sigma_i>0$, then

$$
\frac{|\sigma_i(A+E)-\sigma_i(A)|}{\sigma_i(A)}\le\frac{\delta}{\sigma_i(A)}.
$$

If the matrix error is relative, $\delta\le\eta\|A\|_2$, the right side becomes $\eta\sigma_1/\sigma_i$. A very small singular value can therefore have poor relative accuracy even though its **absolute** error is small. A zero value has no relative-error ratio. The same distinction applies to eigenvalues near zero, using $|\lambda_i|$ in the denominator.

For example, with $A=\operatorname{diag}(1,10^{-8})$ and $E=\operatorname{diag}(0,10^{-8})$, the smaller singular value doubles. Its absolute error is only $10^{-8}$, exactly the perturbation norm, but its relative error is $100\%$.

## 5. Backward stability and useful guarantees

A **backward stable** algorithm returns an exact answer for a nearby matrix $A+E$, where $\|E\|$ is small compared with the input scale. The precise rounding-error bound depends on the algorithm and dimensions; a typical model is $\|E\|_2\le c u\|A\|_2$, with unit roundoff $u$ and a moderate problem-dependent factor $c$.

Combining that model with Weyl gives

$$
|\widehat\sigma_i-\sigma_i(A)|\le c u\|A\|_2.
$$

For a symmetric or Hermitian eigensolver, the analogous argument requires the nearby perturbation to preserve that structure. It gives errors small on the **matrix scale**, not a promise of full relative accuracy for every tiny eigenvalue. Backward stability describes the algorithm; conditioning describes how sensitive the mathematical problem is. Both are needed to interpret a computed result.

### Full rank and positive definiteness

For $m\ge n$, if $\sigma_n(A)>\delta$, then $\sigma_n(A+E)>0$, so full column rank survives every such perturbation. If $\sigma_n(A)\le\delta$, the inequality no longer guarantees survival. It does not say that every permitted perturbation makes the matrix singular.

Likewise, if a Hermitian $H$ has $\lambda_n(H)>\delta$ and $E$ is Hermitian, then $H+E$ remains positive definite. Equality of the bound with the smallest eigenvalue may permit a zero eigenvalue, so use a strict inequality for a strict-positivity guarantee.

Weyl's theorem controls spectral **values**, not a particular choice of singular vectors or eigenvectors. Within a repeated eigenspace, a basis can change drastically without any change in the eigenvalues. Vector sensitivity requires additional information, especially spectral gaps.
