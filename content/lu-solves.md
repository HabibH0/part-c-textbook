## 1. Solve in the order dictated by the product

Once $A=LU$ is available, introduce the intermediate vector $y=Ux$. Then solve

$$
Ly=b,\qquad Ux=y.
$$

The order matters: the first solve finds $y$, and the second uses it to find $x$. Checking the chain gives $Ax=LUx=Ly=b$. You do not form $L^{-1}$, $U^{-1}$, or $A^{-1}$ explicitly.

This lesson assumes nonsingular triangular factors. The key skill is to identify which unknowns are already known in each row equation.

## 2. Forward substitution

For a lower triangular system $Ly=b$, row $i$ contains only $y_1,\ldots,y_i$:

$$
l_{i1}y_1+\cdots+l_{i,i-1}y_{i-1}+l_{ii}y_i=b_i.
$$

Start at the top. Once the earlier entries are known,

$$
y_i=\frac{b_i-\sum_{j=1}^{i-1}l_{ij}y_j}{l_{ii}},\qquad i=1,\ldots,n.
$$

An empty sum is zero, so $y_1=b_1/l_{11}$. In the unit lower triangular convention, $l_{ii}=1$ and no diagonal division is required. Each computed entry is immediately available to the next rows. A zero diagonal entry means this nonsingular triangular-solve algorithm cannot be used as written; it is not permission to divide by zero.

## 3. Back substitution

For the upper triangular system $Ux=y$, row $i$ involves $x_i,\ldots,x_n$. Start at the bottom:

$$
x_i=\frac{y_i-\sum_{j=i+1}^{n}u_{ij}x_j}{u_{ii}},\qquad i=n,n-1,\ldots,1.
$$

In particular, $x_n=y_n/u_{nn}$. Attempting to start with the top row would require unknown values from later rows. The triangular pattern determines the direction of substitution.

## 4. Work through a full solve

Use the factors from the previous lesson and the right-hand side $b=(5,13,31)^T$:

$$
L=\begin{pmatrix}1&0&0\\2&1&0\\4&3&1\end{pmatrix},\qquad
U=\begin{pmatrix}2&1&1\\0&1&1\\0&0&2\end{pmatrix}.
$$

Forward substitution gives

$$
y_1=5,\qquad y_2=13-2(5)=3,\qquad
y_3=31-4(5)-3(3)=2.
$$

Then back substitution gives

$$
x_3=2/2=1,\qquad x_2=3-1=2,\qquad
x_1=(5-2-1)/2=1.
$$

Thus $x=(1,2,1)^T$. Verify in the original matrix, not just in an intermediate equation:

$$
\begin{pmatrix}2&1&1\\4&3&3\\8&7&9\end{pmatrix}
\begin{pmatrix}1\\2\\1\end{pmatrix}
=\begin{pmatrix}5\\13\\31\end{pmatrix}.
$$

The demonstration reveals these six row equations in their execution order. Changing the right-hand side changes $y$ and $x$, while $L$ and $U$ remain reusable.

## 5. Why repeated solves are cheap

In forward substitution, row $i$ uses $i-1$ multiplications and $i-1$ subtractions, followed by a division if the diagonal is not one. A general triangular solve therefore costs

$$
2\sum_{i=1}^n(i-1)+n=n^2
$$

flops with this counting convention. A unit lower triangular solve saves the $n$ divisions. Back substitution has the same leading cost. Two triangular solves cost about $2n^2$ flops, compared with $\tfrac23n^3$ for factorisation.

For $k$ right-hand sides with the same matrix,

$$
AX=B,\qquad B=(b_1,\ldots,b_k),
$$

factor once and solve $LY=B$, then $UX=Y$. The total cost is

$$
\frac23n^3+O(kn^2),
$$

or approximately $\tfrac23n^3+2kn^2$ if we retain the leading solve term. Refactorising separately for every column would instead spend $O(kn^3)$. Reuse is valid only while **the matrix stays the same**. Changing $b$ is cheap; changing $A$ generally requires new factors or a justified update algorithm.

For example, when $n=100$ and $k=10$, the leading estimates are $866{,}667$ flops with reuse and $6{,}866{,}667$ with ten separate factorisations and solves. These are arithmetic estimates, not elapsed times; memory access, hardware, and implementation affect measured speed.

## 6. Triangular solves and backward stability

The standard substitution algorithms are backward stable under the usual floating-point model, provided exceptional overflow or underflow does not invalidate that model. For the computed forward result $\widehat y$, this means

$$
(L+\Delta L)\widehat y=b,
$$

with a small perturbation to the triangular coefficients. More precisely, a standard componentwise statement has the form

$$
|\Delta L|\le\gamma_n|L|,\qquad
\gamma_n=\frac{nu}{1-nu},\quad nu<1,
$$

where $u$ is unit roundoff and absolute values and inequalities are entrywise. An analogous result holds for back substitution with $U$. The interpretation is useful even without deriving this bound: the computed vector exactly solves a slightly changed triangular system.

This is not a guarantee of a small forward error for every input. If the triangular system is ill conditioned, a tiny change to its coefficients may change its solution substantially. A very small nonzero diagonal entry is permitted mathematically, but it can be associated with sensitivity or with very large intermediates.

Nor does stable substitution alone prove that the entire LU solve is stable relative to the original $A$. The accuracy of the factors matters as well; large elimination growth can cause trouble. The next lesson separates that issue from the zero-pivot problem.

## 7. Check a computed solution

The **residual** of an approximate solution $\widehat x$ is

$$
r=b-A\widehat x.
$$

A zero residual in exact arithmetic verifies the equation. A small residual says that $\widehat x$ satisfies nearby data: $A\widehat x=b-r$. For nonsingular $A$ and exact solution $x$,

$$
x-\widehat x=A^{-1}r.
$$

Thus a small residual can coexist with a large solution error when $A^{-1}$ strongly amplifies that residual. For $A=\operatorname{diag}(1,10^{-6})$, changing the second component of a solution by $1$ changes its residual by only $10^{-6}$ in that component. Always distinguish equation satisfaction, backward error, and forward accuracy.

A useful scale-aware diagnostic is $\|r\|/(\|A\|\|\widehat x\|+\|b\|)$ when the denominator is nonzero. It makes a residual interpretable relative to the sizes of the input and computed answer, but still does not remove the need to consider conditioning.
