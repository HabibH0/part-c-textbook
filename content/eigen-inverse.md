## 1. Change which eigenvalue dominates

The power method favours the eigenvalue of largest magnitude. To target an eigenvalue near a chosen shift $\mu$, apply the power idea to

$$
B=(A-\mu I)^{-1},
$$

assuming $\mu$ is not an eigenvalue. If $Av_i=\lambda_i v_i$, then

$$
(A-\mu I)v_i=(\lambda_i-\mu)v_i,\qquad
Bv_i=\frac1{\lambda_i-\mu}v_i.
$$

The eigenvectors stay the same. Eigenvalues closest to $\mu$ become largest in magnitude after this reciprocal transformation. With $\mu=0$, this is the ordinary inverse power method for the eigenvalue of smallest magnitude, assuming $A$ is invertible and the nearest magnitude is unique.

## 2. The algorithm uses a solve, not an explicit inverse

Start with a nonzero normalised vector. At each step:

1. Solve $(A-\mu I)y_{k+1}=x_k$.
2. Set $x_{k+1}=y_{k+1}/\|y_{k+1}\|_2$.
3. Estimate the original eigenvalue with $\rho(x_{k+1})=x_{k+1}^*Ax_{k+1}$, and measure its residual against $A$.

For a real matrix and nonreal $\mu$, the shifted solve and iterates generally become complex. The conjugate transpose is then essential. The demonstration uses real shifts and a real symmetric example so that the geometry remains easy to inspect.

If $A-\mu I$ is singular, the stated inverse iteration is undefined. Do not silently divide by zero. If the current vector already has a sufficiently small eigenpair residual, it can be accepted before attempting another solve. Otherwise, change the shift or use a method designed to handle that situation.

## 3. The convergence factor

Suppose $A$ is diagonalizable and order the eigenvalues by distance from the shift:

$$
0<|\lambda_{\sigma(1)}-\mu|<|\lambda_{\sigma(2)}-\mu|
\le\cdots\le|\lambda_{\sigma(n)}-\mu|.
$$

Expand the initial vector in the eigenbasis and require a nonzero coefficient of $v_{\sigma(1)}$. Repeated inverse application multiplies each coefficient by $(\lambda_i-\mu)^{-k}$. Relative to the wanted coefficient, the $i$th one therefore contains

$$
\left(\frac{\lambda_{\sigma(1)}-\mu}{\lambda_i-\mu}\right)^k.
$$

The asymptotic directional convergence factor is

$$
q_\mu=\frac{|\lambda_{\sigma(1)}-\mu|}{|\lambda_{\sigma(2)}-\mu|}<1.
$$

A shift close to one isolated eigenvalue makes this ratio small. A poor shift need not accelerate anything, and equal closest distances remove the unique-dominance guarantee. Sign and phase ambiguities are the same as for ordinary power iteration.

### Worked example

Let $A=\operatorname{diag}(1,2,5)$ and $\mu=1.8$. The inverse-transformed eigenvalues are $-1.25$, $5$, and $0.3125$. Thus the eigenvalue $2$ is targeted, with factor $0.2/0.8=1/4$.

Starting with equal components, the first unnormalised solve gives a vector proportional to $(-1.25,5,0.3125)^T$. Its normalisation is proportional to $(-4,16,1)^T$, with norm $\sqrt{273}$. The Rayleigh quotient is

$$
\rho=\frac{1\cdot16+2\cdot256+5\cdot1}{273}=\frac{533}{273}.
$$

At $\mu=1.5$, eigenvalues $1$ and $2$ are equally close, so the simple theorem does not select between them. At $\mu=2$, the shifted matrix is singular.

## 4. Accuracy and cost

A shift extremely close to an eigenvalue makes the shifted matrix ill-conditioned. The solve can be backward stable while the unnormalised vector is sensitive. Often its component in the desired direction is greatly magnified, and normalisation gives a useful eigenvector estimate. That mechanism is not a guarantee for every problem: monitor the original residual and handle failed or nearly singular solves explicitly.

A dense power step costs $O(n^2)$. Factoring a general dense shifted matrix costs $O(n^3)$, with triangular substitution costing $O(n^2)$ afterwards. For a **fixed shift**, factor $A-\mu I$ once and reuse those factors at every step. The total for $k$ steps is then $O(n^3+kn^2)$, rather than refactoring unnecessarily each time.

If the shift changes at every iteration, a new factorisation is normally needed, so each dense step can cost $O(n^3)$. Sparse and structured systems can have different costs. The improved convergence trades cheaper repeated multiplications for more expensive solves, and the best choice depends on how many iterations are saved.

## 5. Optional extension: Rayleigh quotient iteration

Choose the shift adaptively from the current vector:

$$
\mu_k=\rho(x_k),\qquad
(A-\mu_k I)y_{k+1}=x_k,\qquad
x_{k+1}=y_{k+1}/\|y_{k+1}\|_2.
$$

This is **Rayleigh quotient iteration** (RQI). Under the usual local assumptions of a simple isolated eigenpair, a sufficiently good starting direction and successful shifted solves, the general nonsymmetric case has quadratic local convergence. For a symmetric or Hermitian matrix, the local convergence is cubic. These are local rates, not global promises: an arbitrary start can converge elsewhere, encounter a singular shift, or fail to converge.

### Why symmetry improves the order

Near a simple symmetric eigenvector, let $\theta_k$ measure the angle to the eigenvector line. The Rayleigh-quotient calculation from the power-method lesson gives $|\mu_k-\lambda|=O(\theta_k^2)$. The other eigenvalues remain separated from $\mu_k$ by a nonzero gap. In the shifted solve, the ratio of unwanted to wanted components is reduced by a factor of order $|\mu_k-\lambda|$, so

$$
\theta_{k+1}=O(\theta_k\,|\mu_k-\lambda|)=O(\theta_k^3).
$$

For a generic nonsymmetric simple eigenpair, the quotient shift error is generally first order in the directional error, giving the corresponding quadratic mechanism. Constants can depend strongly on eigenvector conditioning and spectral separation.

For normalised vectors close to a simple eigenpair with a fixed gap, residual size is locally comparable to directional error. Thus the local statements can also be expressed as $\|r_{k+1}\|=O(\|r_k\|^2)$ in the general case and $O(\|r_k\|^3)$ in the symmetric case, under these qualifications.

At an exact eigenvector, the Rayleigh shift is exactly the eigenvalue and the shifted matrix is singular. The correct action is to recognise convergence from the residual and stop, not attempt another inverse. In floating-point arithmetic rapid convergence eventually reaches a rounding floor, beyond which the asymptotic real-arithmetic rate is no longer observable.
