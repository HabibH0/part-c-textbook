## 1. Why exact algebra is not the whole story

A numerical algorithm executes finitely many operations on finitely stored numbers. Its algebraic formula can be correct while its computed answer differs from the exact answer. To understand that difference we must distinguish rounding in the calculation from sensitivity already present in the problem.

Consider

$$
U=\frac1{\sqrt2}\begin{pmatrix}1&1\\1&-1\end{pmatrix},\qquad
\Sigma=\begin{pmatrix}1&0\\0&10^{-15}\end{pmatrix},\qquad A=U\Sigma,\qquad b=A\begin{pmatrix}1\\1\end{pmatrix}.
$$

In exact arithmetic the solution is $(1,1)^T$. A double-precision LU solve can instead produce something like $(1.0000,0.94206)^T$. The last digits depend on how the data and operations are evaluated; this particular output is illustrative, not a universal prediction.

The two components of $b$ differ by only about $10^{-15}$. Recovering the second coordinate requires resolving that tiny difference and dividing by $10^{-15}$. Small changes in stored data can therefore cause a visible change in the answer. This does **not** by itself establish that LU failed. We will return to this example after developing conditioning and backward error.

## 2. Finite binary numbers

Binary floating-point numbers store a sign, a finite significand, and an exponent. A normal nonzero number has the form

$$
\pm(1.b_1b_2\cdots b_{p-1})_2\,2^e.
$$

With $p$ significant binary digits, the spacing in $[1,2)$ is $2^{1-p}$. Spacing doubles when the exponent increases by one. There is consequently no single fixed *absolute* rounding unit for all numbers.

IEEE binary64, commonly called double precision, has $p=53$. Under rounding to nearest, its **unit roundoff** is

$$
u=2^{-53}\approx1.11\times10^{-16}.
$$

The gap from $1$ to the next larger binary64 number is $2^{-52}=2u$. Some software calls this gap “machine epsilon”; other texts use “machine precision” for $u$. Keep the convention explicit rather than treating the two constants as identical.

Integers within the significand's range and fractions such as $1/2$ are exactly representable. But $1/3$ has a repeating binary expansion, and irrational numbers such as $\sqrt2$ cannot be stored exactly. Input conversion already introduces error, before an algorithm starts.

### A small arithmetic system

With $p=4$, consecutive numbers near $1$ include $1$, $1.125$, $1.25$, and $1.375$. Rounding $1.2$ to nearest gives $1.25$, with absolute error $0.05$ and relative error $0.05/1.2=1/24$. At a halfway point, the usual tie rule chooses the value whose last retained binary digit is even. For example, $1.0625$ rounds to $1$.

## 3. A model for each operation

Write $\operatorname{fl}(z)$ for a computed or rounded version of $z$. For a basic arithmetic operation on floating-point inputs, the standard model is

$$
\operatorname{fl}(a\mathbin\circ b)=(a\mathbin\circ b)(1+\delta),\qquad |\delta|\le u,
\qquad \circ\in\{+,-,\times,/\}.
$$

This relative bound applies in the normal range, excluding overflow and problematic underflow; division also requires a nonzero divisor. Subnormal results require an absolute-error qualification. We will assume those exceptional ranges are avoided unless stated otherwise.

In absolute form,

$$
|\operatorname{fl}(a+b)-(a+b)|\le u|a+b|\le 2u\max(|a|,|b|),
\qquad
|\operatorname{fl}(ab)-ab|\le u|ab|.
$$

The factor $2$ in the addition estimate matters if constants are being tracked. Later, an $O(u)$ notation will absorb such small constants and moderate dimension factors. Each operation has its own rounding error; there is no one common $\delta$ for the entire program.

Cancellation is subtle. Subtracting two already rounded, nearly equal numbers can even be exact as an operation, yet expose errors inherited from those numbers. The small remainder may then have a large relative error.

## 4. Two warnings from scalar arithmetic

Although $(\sqrt2)^2-2=0$ mathematically, a usual binary64 evaluation of

$$
\bigl(\operatorname{fl}(\sqrt2)^2-2\bigr)10^{15}
$$

gives approximately $0.4441$. The rounded square is about $2+4.44\times10^{-16}$. Subtraction exposes that error, and multiplication by $10^{15}$ makes it visible. A relative error measured against the exact final answer zero is undefined; use absolute error here.

The harmonic series provides a different warning. Its exact partial sums $H_N=\sum_{n=1}^N1/n$ grow without bound. A naive floating-point accumulation from small indices to large indices can eventually stop changing. If $1/n$ is less than half the spacing at the current sum, adding it rounds back to that sum. Subsequent terms are still smaller, so the stagnation persists.

Values around $30$ are sometimes used to illustrate finite-precision harmonic summation, but there is no universal floating-point sum of this infinite series. The stopping value depends on precision, order and implementation. Reaching binary64 stagnation by a literal loop would require an enormous computation. The demonstration uses a deliberately small binary precision so the same mechanism is visible quickly, and labels that simulation separately from actual binary64 arithmetic.

Changing the order, or using compensated summation, can substantially improve finite sums. It does not turn finite storage into exact arithmetic or make an infinite computation possible.

## 5. Notation for the rest of the chapter

A hat marks a computed quantity, such as $\widehat x$. We use $\varepsilon=O(u)$ to absorb constants such as $10$, $m+n$, or $mn$, assuming those dimension factors times $u$ remain small. Thus $\|\Delta A\|\le\varepsilon\|A\|$ means a perturbation small **relative to the scale of $A$**.

Finite-dimensional norms are equivalent, so broad qualitative $O(u)$ statements can hide norm-dependent constants. This does not make all norms numerically interchangeable, particularly as dimensions grow. When a sharp condition number or error bound is needed, we will specify the norm, usually the Euclidean vector norm and spectral matrix norm.
