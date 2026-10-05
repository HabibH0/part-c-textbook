## 1. A problem and an algorithm are different objects

A **problem** is a map $y=f(x)$. Its conditioning measures how much the exact output changes when its input changes. An **algorithm** is a procedure for approximating that map; its stability describes how rounding affects its output.

Say “this problem is ill-conditioned” and “this algorithm is backward stable”. Calling an algorithm ill-conditioned, or a problem backward stable, mixes the two questions. A stable method can return an inaccurate answer to a sensitive problem; a poor method can spoil a well-conditioned one.

## 2. Absolute and relative conditioning

At an input $x$, the local absolute condition number is

$$
\kappa_{\rm abs}(f,x)=\lim_{h\downarrow0}\sup_{0<\|\delta x\|\le h}
\frac{\|f(x+\delta x)-f(x)\|}{\|\delta x\|}.
$$

If $f$ is differentiable, $f(x+\delta x)=f(x)+Df(x)\delta x+o(\|\delta x\|)$. Taking the largest amplification over directions gives $\kappa_{\rm abs}=\|Df(x)\|$. For a scalar function this is $|f'(x)|$.

When $x\ne0$ and $f(x)\ne0$, the corresponding relative condition number is

$$
\kappa_{\rm rel}(f,x)=\kappa_{\rm abs}(f,x)\frac{\|x\|}{\|f(x)\|}.
$$

It compares relative output change with relative input change. If the input or output is zero, the usual relative definition needs modification; absolute error remains meaningful.

For $f(x)=x^2$ at nonzero $x$, $\kappa_{\rm abs}=2|x|$ but $\kappa_{\rm rel}=2$. In contrast, for $f(x)=x-1$, $\kappa_{\rm abs}=1$ while

$$
\kappa_{\rm rel}=\frac{|x|}{|x-1|}.
$$

Near $x=1$ the output is relatively sensitive, even though its absolute sensitivity is modest. At $x=1.001$, the relative condition number is $1001$. A change of $10^{-6}$ in the input changes the output $0.001$ by $0.1\%$.

## 3. Forward error and backward error

Given a computed answer $\widehat y$, its **forward error** compares it directly with $f(x)$:

$$
\|\widehat y-f(x)\|,\qquad
\frac{\|\widehat y-f(x)\|}{\|f(x)\|}.
$$

The **backward error** asks for the smallest input change that explains the answer exactly:

$$
\eta=\inf\left\{\frac{\|\Delta x\|}{\|x\|}:\widehat y=f(x+\Delta x)\right\}.
$$

The perturbation must respect the declared input domain and any structure required by the definition. If no such input exists, exact backward interpretation fails. For several inputs, specify how they are scaled and which may change.

An algorithm is **backward stable** if its output always has such an interpretation with $\eta=O(u)$, under its stated assumptions. One small measured error for one input is evidence about that calculation, not a proof about every input.

### A worked backward interpretation

For $f(x)=x^2$, input $x=2$ and output $\widehat y=4.0401$, the nearby positive input is $2.01$ because $(2.01)^2=4.0401$. The relative backward error is $0.01/2=0.005$; the relative forward error is $0.0401/4=0.010025$. Their ratio is close to the condition number $2$. This pedagogical perturbation is much larger than binary64 roundoff; it illustrates the definitions, not a claim of machine-precision stability.

## 4. Why backward stability is a useful target

The ideal of relative forward error $O(u)$ is often unattainable. Data can already have been rounded when stored, and the underlying physical or measured input $x_*$ may be known less accurately still. If $x+\Delta x$ differs from the stored input by no more than its existing uncertainty, then $f(x+\Delta x)$ is a reasonable answer consistent with that uncertainty.

This is not a guarantee that it is closer to the unknown true answer $f(x_*)$. It says the algorithm has introduced little additional input uncertainty. A sensitive problem can amplify even that small uncertainty substantially.

Combining the definitions gives the local rule

$$
\widehat y=f(x+\Delta x)
\quad\Longrightarrow\quad
\|\widehat y-f(x)\|\lesssim\kappa_{\rm abs}\|\Delta x\|.
$$

In relative form, a backward error $\eta$ typically yields a forward error of order $\kappa_{\rm rel}\eta$. In particular, backward stability plus good conditioning gives high accuracy. When $\kappa u$ is large, a backward stable answer need not be accurate.

The symbol $\lesssim$ is deliberate: conditioning is a local, infinitesimal concept. A finite perturbation may cross a singularity or leave the region where the derivative is representative. A rigorous finite bound needs additional information; the next lesson supplies one for linear systems.

## 5. Forward and mixed stability

An algorithm is called **forward stable** here when its relative error is $O(\kappa_{\rm rel}u)$: the accuracy is of the order expected from a backward stable method. The phrase is also sometimes used informally for merely “small forward error”. We use the condition-aware definition, because full relative precision is often impossible.

Forward stability alone does not prove that the result is the exact image of one nearby admissible input. The inverse interpretation required for backward stability is a stronger, different demand.

**Mixed forward–backward stability** allows a small adjustment on each side:

$$
\widehat y+\Delta y=f(x+\Delta x),\qquad
\|\Delta x\|\le\varepsilon\|x\|,\quad
\|\Delta y\|\le\varepsilon\|\widehat y\|.
$$

The output is close to the exact answer for a nearby input, without necessarily being that exact answer itself. This is useful for computed factors that are nearly, but not exactly, orthogonal. Always state which of forward, backward or mixed stability a conclusion establishes.
