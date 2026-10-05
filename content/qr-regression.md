## 1. Fit a model from sampled values

Suppose a function $f:[-1,1]\to\mathbb R$ can be sampled even when its formula is unavailable. We want a simple polynomial model

$$
p(t)=\sum_{j=0}^{d}c_jt^j.
$$

A degree-at-most-$d$ polynomial has **$d+1$ coefficients**, including the constant term. Keep that count distinct from the number of observations $m$. Sampling at $z_1,\ldots,z_m$ gives the linear model

$$
Ac\approx y,\qquad A_{ij}=z_i^{j-1},\qquad y_i=f(z_i),
$$

where $A$ is the $m\times(d+1)$ **Vandermonde matrix**:

$$
A=\begin{pmatrix}
1&z_1&\cdots&z_1^d\\
1&z_2&\cdots&z_2^d\\
\vdots&\vdots&&\vdots\\
1&z_m&\cdots&z_m^d
\end{pmatrix}.
$$

This is linear least squares in the coefficients even though the model is nonlinear in the input variable $t$. Regression of this kind appears in statistics, data analysis, numerical analysis and approximation theory.

## 2. From samples to coefficients

Choose the degree and sample locations, build $A$ and $y$, compute a thin Householder QR $A=QR$, and solve

$$
Rc=Q^Ty.
$$

The fitted sample vector is $Ac$. Evaluate the polynomial at a new point by Horner's rule, nesting multiplications rather than repeatedly computing every power. For example, a quadratic is $c_0+t(c_1+tc_2)$.

If there are at least $d+1$ distinct sample locations, $A$ has full column rank. To prove this, suppose $Ac=0$. The polynomial with coefficients $c$ has at least $d+1$ distinct roots. A nonzero polynomial of degree at most $d$ has at most $d$ roots, so it must be identically zero and $c=0$.

Distinctness matters. Repeating the same point adds equations but does not necessarily add an independent direction. Counting rows alone is not enough to prove full rank. And full exact rank does not imply good numerical conditioning: high powers at poorly distributed nodes can make monomial columns nearly dependent.

## 3. Interpolation and oversampled regression

When $m=d+1$ and the nodes are distinct, the square system has one polynomial passing through every sample. This is **interpolation**: the training residual is zero in exact arithmetic. A small or zero sample residual does not guarantee a good fit between sample locations.

When $m>d+1$, an exact fit generally cannot satisfy every sample. Least squares chooses the polynomial with the smallest sum of squared sample errors. It sacrifices exact agreement at individual points to improve agreement across the set. More observations also give a way to average measurement noise, under appropriate sampling and noise assumptions.

For a small worked example, fit a line to $z=(-1,0,1)$ and values $y=(1,0,1)$. Then

$$
A=\begin{pmatrix}1&-1\\1&0\\1&1\end{pmatrix},\qquad
A^TA=\begin{pmatrix}3&0\\0&2\end{pmatrix},\quad A^Ty=(2,0)^T.
$$

Thus $c=(2/3,0)^T$: the best line is the constant $2/3$. Its residual is $(1/3,-2/3,1/3)^T$ and the residual squared norm is $2/3$. A quadratic can interpolate these same data exactly with $p(t)=t^2$. Different model dimensions answer different approximation questions.

## 4. The degree-ten experiment

Consider the target

$$
f(t)=1+\sin(10t)e^t,\qquad -1\le t\le1.
$$

Imagine that only its sampled values are available to the fitting algorithm. We retain the formula to evaluate the quality of the resulting approximation on a separate dense grid.

First take **11 equally spaced samples** and a degree-ten polynomial. There are 11 unknown coefficients, so the fit interpolates. It matches the sample values but can deviate substantially between them, especially near the ends of the interval.

Now keep the degree at ten but use **100 equally spaced samples**. The $100\times11$ least-squares system constrains the same model over many more locations. For this example, the between-sample behaviour improves substantially. The model has not gained coefficients; the information used to choose them has increased.

The demonstration computes both fits with actual Householder QR. It displays the function, fitted curve, sample locations, the sample residual, and an independently sampled error on a dense evaluation grid. The dense-grid maximum is an estimate, not a certified continuous supremum. A zero training residual and a substantial evaluation error can appear simultaneously without any contradiction.

Changing the degree explores another tradeoff. Increasing it expands the exact-arithmetic model space, so the best training residual cannot increase when the samples are fixed. Yet between-sample error, coefficient sensitivity and numerical conditioning need not improve monotonically. Conversely, adding samples while fixing the degree changes the objective; it is not a universal guarantee of improvement for every function, node set or error metric.

## 5. Optional, non-examinable extension: why the node pattern matters

Interpolation has the Lagrange representation

$$
p(t)=\sum_{i=1}^m y_i\ell_i(t),\qquad
\ell_i(z_j)=\begin{cases}1&i=j,\\0&i\ne j.\end{cases}
$$

Perturb the sample values by $\delta y_i$. Then

$$
|\delta p(t)|\le\left(\sum_i|\ell_i(t)|\right)\max_i|\delta y_i|.
$$

The **Lebesgue constant** is

$$
\Lambda_m=\max_{t\in[-1,1]}\sum_i|\ell_i(t)|.
$$

It bounds how much the interpolation map can amplify sample errors. High-degree interpolation at equally spaced nodes can have a very large Lebesgue constant, helping explain oscillations and sensitivity. The issue is a property of the approximation problem as well as of the algorithm used to solve for coefficients.

For any degree-at-most-$d$ polynomial $q$ and the interpolation operator $I$ on $d+1$ nodes, $Iq=q$. Hence

$$
\|f-If\|_\infty
\le\|f-q\|_\infty+\|I(q-f)\|_\infty
\le(1+\Lambda_{d+1})\|f-q\|_\infty.
$$

Taking the infimum over $q$ relates interpolation error to the best possible degree-$d$ approximation. A large constant makes the guarantee weak even when a good polynomial exists. This is not the same as a proof that any arbitrary oversampling scheme must improve every fit; it identifies one mechanism behind the observed phenomenon.

## 6. Interpreting a regression result

Distinguish three sources of difficulty: the chosen model may approximate the function poorly; the sampling pattern may leave important behaviour unconstrained; and the resulting linear algebra may be ill conditioned or computed inaccurately. A backward-stable QR solve addresses the last algorithmic issue, not all three at once.

Monomial coefficients can be sensitive while predictions on part of the interval remain useful. Scaling the interval and using a better-conditioned polynomial basis can help. Predictions outside the sampled interval are extrapolations and need separate justification. The next chapter studies how rounding, conditioning and algorithmic stability combine to determine what a computed answer means.
