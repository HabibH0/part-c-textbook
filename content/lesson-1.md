## The question: why does so much mathematics become a matrix problem?

Suppose you want to fit a model to data, compute a physical state, or minimise a function with a million variables. The original problem may be nonlinear and complicated. Yet a useful computational step often comes down to solving a linear system, finding an eigenvector, or compressing a matrix. Numerical linear algebra (NLA) studies how to perform those steps **accurately and efficiently on a computer**.

Exact algebra tells us what a solution is. Numerical linear algebra asks how to obtain a useful approximation, how much work that takes, and whether small errors in the data or arithmetic will matter. Those three questions—**accuracy, cost, and sensitivity**—will recur throughout this course.

### Before you begin

You should be able to multiply a matrix by a vector, solve a small system of simultaneous equations, and recognise a linear combination. If these are rusty, use the worked examples below before the practice set. No previous course in numerical analysis is assumed.

By the end, you should be able to formulate the main NLA problems, derive the linear system inside a Newton step, and move confidently between the equivalent meanings of an invertible square matrix.

## 1. Two central problems, and a third that deserves its own place

### Linear systems

Given $A\in\mathbb R^{m\times n}$ and $b\in\mathbb R^m$, we seek $x\in\mathbb R^n$ satisfying

$$Ax=b.$$

The dimensions tell a story: $A$ takes an input with $n$ coordinates and returns an output with $m$ coordinates. The equation asks whether the desired output $b$ can be produced, and, if so, by which input.

- When $m=n$, a nonsingular matrix gives exactly one solution for every $b$.
- When $m>n$, there are more equations than unknowns. There may be no exact solution. Later, **least squares** will choose $x$ to make $Ax-b$ as small as possible.
- When $m<n$, there are fewer equations than unknowns. A consistent system cannot have a unique solution: a nonzero null vector can be added to any solution. The course returns briefly to such problems later.

Do not infer existence or uniqueness from shape alone. Even a square matrix can be singular, and a tall matrix can have dependent columns.

### Eigenvalue problems

Given a **square** matrix $A\in\mathbb R^{n\times n}$, seek a scalar $\lambda$ and a **nonzero** vector $x$ such that

$$Ax=\lambda x.$$

The pair $(\lambda,x)$ is an eigenpair. The output lies along the same one-dimensional direction as the input; the factor $\lambda$ describes the action in that direction. We exclude $x=0$ because it satisfies the equation for every scalar and would tell us nothing.

A real matrix may require complex $\lambda$ and complex $x$. For example, a real rotation through $90^\circ$ has eigenvalues $i$ and $-i$, and no real eigenvector. Unless stated otherwise, eigenvalues are considered over $\mathbb C$. Rectangular eigenvalue generalisations exist but are outside this course.

### Singular value decomposition

The **SVD** is a factorisation of a matrix into orthogonal or unitary directions and nonnegative stretching factors. Unlike the usual eigenvalue problem, it applies to rectangular matrices too. It is closely related to eigenvalues, but important enough to count as a third main problem. Its full construction, proofs, and applications begin in Chapter 2. We introduce its notation here because the review already uses singular values.

## 2. A nonlinear problem with a linear problem inside it

Suppose we want to minimise a differentiable real-valued function $f:\mathbb R^n\to\mathbb R$. An interior differentiable local minimiser must satisfy

$$\nabla f(x_*)=0.$$

Write $F(x)=\nabla f(x)$. We now have a nonlinear system $F(x)=0$. A zero of the gradient is a **critical point**, not automatically a minimum: it might be a maximum or a saddle point.

Newton's method replaces the nonlinear function near the current iterate $x^{(i)}$ by its first-order approximation:

$$F(x^{(i)}+s)\approx F(x^{(i)})+J(x^{(i)})s,$$

where the Jacobian is

$$J(x)_{jk}=\frac{\partial F_j}{\partial x_k}(x).$$

Setting the linear approximation to zero gives $J(x^{(i)})s=-F(x^{(i)})$. Equivalently, solve for $y=-s$ and update:

$$J(x^{(i)})y=F(x^{(i)}),\qquad x^{(i+1)}=x^{(i)}-y.$$

Thus a Newton step consists of:

1. Start from a current guess $x^{(i)}$.
2. Evaluate $F$ and its Jacobian **at this current guess**.
3. Solve a linear system for $y$.
4. Subtract $y$, then repeat until an appropriate stopping test is met.

The expression $J^{-1}F$ describes the mathematics when $J$ is invertible; it is **not an instruction to form the inverse**. A linear solver computes the required vector directly. For $F=\nabla f$ with $f$ twice differentiable, $J$ is the Hessian. Newton's method needs suitable conditions to converge, and a singular Jacobian can prevent this step; it is not a universal solution to optimisation.

### Worked example: one Newton step

Let

$$F(u,v)=\begin{pmatrix}u^2+v-3\\u+v^2-3\end{pmatrix},\qquad (u^{(0)},v^{(0)})=(1,1).$$

Then $F(1,1)=(-1,-1)^T$ and

$$J(1,1)=\begin{pmatrix}2&1\\1&2\end{pmatrix}.$$

Solve $2y_1+y_2=-1$ and $y_1+2y_2=-1$. Subtraction gives $y_1=y_2$, so $y=(-1/3,-1/3)^T$. The next iterate is $(4/3,4/3)^T$. Substitution gives a new residual $(1/9,1/9)^T$: improved, but not zero. The step solved the **linear approximation** exactly, not the original nonlinear problem.

### Other places these problems appear

Eigenvectors appear in PageRank and in discretised versions of the Schrödinger equation in physics and chemistry. Some nonconvex optimisation problems can be reformulated as eigenvalue problems. Principal component analysis (PCA) uses directions of variation in data and is closely connected to the SVD and compression. Differential equations, regression, data analysis, and machine learning repeatedly produce linear algebra problems.

The point is not that every problem is linear. It is that linear problems are well understood, reliable algorithms are available, and reducing a difficult problem to a sequence of linear ones can make large computations possible.

## 3. Mathematical language

Matrices use capital letters ($A,B,Q$), vectors usually use lower-case letters ($x,b$), and scalars use lower-case or Greek letters. $I_n$ is the $n\times n$ identity; we write $I$ when its size is clear. $Q$ normally denotes an orthogonal matrix or one with orthonormal columns; $L$ and $U$ often denote lower and upper triangular matrices.

For $A=(A_{ij})$, the transpose satisfies $(A^T)_{ij}=A_{ji}$ and the conjugate transpose satisfies $(A^*)_{ij}=\overline{A_{ji}}$. For real matrices they coincide. Complex inner-product arguments usually require $A^*$ where a real argument uses $A^T$.

We write $\lambda(A)$ for the eigenvalues and $\sigma(A)$ for the singular values. When eigenvalues have a natural real ordering, we use $\lambda_1\ge\lambda_2\ge\cdots$; arbitrary complex eigenvalues do not have this ordering. Singular values are always ordered $\sigma_1\ge\sigma_2\ge\cdots\ge0$. $\operatorname{diag}(a_1,\ldots,a_n)$ forms a diagonal matrix; applied to a matrix, $\operatorname{diag}(A)$ can denote its diagonal entries. Context distinguishes these uses.

$\operatorname{span}(A)$ means the column space, the set of vectors $Ax$. For symmetric (or complex Hermitian) matrices, $A\succ0$ means positive definite and $A\succeq0$ positive semidefinite. Also $A\succ B$ means $A-B\succ0$, not that every entry of $A$ exceeds the corresponding entry of $B$.

Common abbreviations include alg (algorithm), eigval (eigenvalue), eigvec (eigenvector), singval (singular value), and singvec (singular vector); “iff” means “if and only if”.

The course works mainly over $\mathbb R$ and $\mathbb C$, not finite fields. Determinants are useful conceptually but play a comparatively small computational role. Most real arguments extend by replacing transposes with conjugate transposes. Schur forms, $LDL^T$ factorisations, and real matrices with complex eigenvalues need extra care later.

## 4. Warm-up: what does nonsingular really mean?

Before reading the list, try to write down five different statements equivalent to invertibility. Think about solving equations, independent vectors, and a linear map.

For a **square** matrix $A\in\mathbb R^{n\times n}$ (or $\mathbb C^{n\times n}$), all the following are equivalent:

1. $A$ is nonsingular.
2. $A^{-1}$ exists.
3. The map $x\mapsto Ax$ is a bijection.
4. All $n$ eigenvalues, counted with algebraic multiplicity, are nonzero.
5. All $n$ singular values are positive.
6. $\operatorname{rank}(A)=n$.
7. The $n$ rows are linearly independent.
8. The $n$ columns are linearly independent.
9. $Ax=b$ has a solution for every $b$ in the codomain.
10. $Ax=0$ has no nonzero solution.
11. $A^Tx=0$ has no nonzero solution (equivalently, use $A^*$).
12. $A^*A$ is positive definite, not merely positive semidefinite.
13. $\det(A)\ne0$.
14. There is a square matrix $B$ such that $BA=I$; this also implies $AB=I$.

Statement 9 only mentions existence, but for a square matrix existence for every right-hand side already forces uniqueness. This relies on equal input and output dimensions.

### Why these statements belong together

**Columns, null vectors, rank, and bijections.** The equation $Ax=0$ says that the columns of $A$, combined with coefficients $x_j$, sum to zero. Only the trivial combination is possible exactly when the columns are independent. Then rank is $n$. By rank–nullity, an injective map between two $n$-dimensional spaces is also surjective, hence bijective. Its inverse map is represented by $A^{-1}$. Row rank equals column rank, giving the row and transpose versions.

**Eigenvalues and determinant.** A zero eigenvalue is precisely a nonzero vector in the null space. Also the product of the eigenvalues is $\det(A)$, so the determinant is nonzero exactly when no eigenvalue is zero.

**Positive definiteness and singular values.** For every vector $x$,

$$x^*A^*Ax=(Ax)^*(Ax)=\|Ax\|_2^2.$$

It is always nonnegative. It is strictly positive for every nonzero $x$ exactly when $A$ has no nonzero null vector. The singular values are the nonnegative square roots of the eigenvalues of $A^*A$ (for square $A$), so they are all positive in exactly this case. Chapter 2 develops this connection fully.

**A one-sided inverse.** If $BA=I$ and $Ax=0$, then $x=BAx=0$. Thus $A$ is injective and therefore invertible. Multiplying $BA=I$ by $A^{-1}$ gives $B=A^{-1}$, hence $AB=I$. This proof explains why being square is essential.

### Worked example: one observation, many consequences

For $A=\begin{pmatrix}1&2\\2&4\end{pmatrix}$, the second column is twice the first. Hence $x=(-2,1)^T$ is a nonzero null vector. Without calculating an inverse or every eigenvalue, we know that $A$ is singular, its rank is below two, its determinant is zero, it has a zero eigenvalue and singular value, and $A^TA$ is not positive definite.

Its range consists of multiples of $(1,2)^T$. Thus $Ax=(1,0)^T$ has no solution, whereas $Ax=(1,2)^T$ has infinitely many: $(1,0)^T+t(-2,1)^T$.

### Complete the next example

Let $A_t=\begin{pmatrix}1&t\\t&1\end{pmatrix}$. Its eigenvectors $(1,1)^T$ and $(1,-1)^T$ have eigenvalues $1+t$ and $1-t$. Use those two values to predict when the matrix is invertible, positive definite, or singular. Then test your prediction in the explorer.

## What to carry forward

A linear solve asks for an input that produces a prescribed output. An eigenproblem asks for directions preserved by a square matrix. Invertibility is one idea with many equivalent algebraic and geometric expressions. These equivalences are powerful because you can choose whichever is easiest to check in a particular problem.
