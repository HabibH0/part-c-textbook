## 1. Replace one difficult problem by simpler ones

Solving $Ax=b$ is a central task in numerical linear algebra. A direct method builds a solution in a finite sequence of arithmetic operations, rather than repeatedly improving an initial guess. Its organising idea is **factorisation**: write a complicated matrix as a product of matrices whose systems are easy to solve.

Factorisation-based direct methods have been recognised among the twentieth century's top ten algorithms. Optimised implementations can solve modest dense problems, such as a $100\times100$ system or eigenvalue problem, on a sub-millisecond scale on suitable hardware. That is an illustration of what implementation can achieve, not a timing guarantee for every computer or program. Our task is to understand the mathematical operations behind that speed.

This lesson uses matrix multiplication, outer products, and triangular matrices. We work with square real matrices; the LU construction also works over $\mathbb C$ without inserting conjugates into the product.

An **LU factorisation** has the form

$$
A=LU,
$$

where $L$ is lower triangular and $U$ is upper triangular. We choose the **unit lower triangular** convention $l_{ii}=1$. This removes the freedom to rescale a column of $L$ and the corresponding row of $U$. It does not require the diagonal of $U$ to be one.

Rather than beginning with a list of row operations, we will build $A$ as a sum of structured rank-one terms. The two viewpoints describe the same elimination process.

## 2. Match the first row and column with one outer product

Partition the matrix as

$$
A=\begin{pmatrix}a&r^T\\c&B\end{pmatrix},\qquad a\ne0.
$$

Here $a$ is one number, $r$ and $c$ have $n-1$ entries, and $B$ is $(n-1)\times(n-1)$. Choose

$$
\ell_1=\begin{pmatrix}1\\c/a\end{pmatrix},\qquad
u_1^T=\begin{pmatrix}a&r^T\end{pmatrix}.
$$

Their product reproduces the entire first row and first column:

$$
\ell_1u_1^T=\begin{pmatrix}a&r^T\\c&cr^T/a\end{pmatrix}.
$$

Subtract it to obtain

$$
A=\ell_1u_1^T+
\begin{pmatrix}0&0\\0&S\end{pmatrix},\qquad
S=B-\frac{cr^T}{a}.
$$

The remaining matrix $S$ is the **Schur complement** of the first pivot $a$. The surrounding zero row and column matter: the residual is still an $n\times n$ matrix, with work confined to its trailing block.

In entries, $(\ell_1)_i=A_{i1}/a$ and $(u_1)_j=A_{1j}$, so

$$
S_{ij}=A_{i+1,j+1}-\frac{A_{i+1,1}A_{1,j+1}}a.
$$

This is exactly the update made by subtracting $(A_{i1}/a)$ times row 1 from row $i$. The multiplier is stored in $L$; the pivot row belongs to $U$.

## 3. Repeat on the trailing block

Apply the same construction to $S$. Pad its new column and row with a leading zero to obtain $\ell_2$ and $u_2^T$. Their product leaves the already matched first row and column untouched. After $k$ steps,

$$
A=\sum_{j=1}^k\ell_j u_j^T+
\begin{pmatrix}0_{k\times k}&0\\0&S_k\end{pmatrix}.
$$

Every $\ell_j$ has zeros above position $j$ and a one in position $j$. Every $u_j^T$ has zeros before position $j$. After $n$ successful steps the residual is zero, and

$$
A=\sum_{j=1}^n\ell_j u_j^T
=\begin{pmatrix}\ell_1&\cdots&\ell_n\end{pmatrix}
\begin{pmatrix}u_1^T\\\vdots\\u_n^T\end{pmatrix}=LU.
$$

The zero patterns make $L$ lower triangular and $U$ upper triangular. For nonzero pivots, each summand has rank one. Keeping only the first $k$ terms gives rank at most $k$, but does **not** automatically give an optimal low-rank approximation: these terms are chosen by elimination, not by singular-value ordering.

An equivalent in-place algorithm starts with $U=A$ and $L=I$. For $k=1,\ldots,n-1$, assuming $u_{kk}\ne0$:

1. For each $i>k$, store $l_{ik}=u_{ik}/u_{kk}$.
2. For each $j>k$, replace $u_{ij}$ by $u_{ij}-l_{ik}u_{kj}$.
3. Set $u_{ik}=0$.

At later steps the pivot and multipliers come from the **updated** matrix, not from the original entries. Overwriting the lower triangle of a working array with the multipliers is a common storage scheme; the diagonal ones of $L$ need not be stored.

## 4. A complete three-by-three example

Take

$$
A=\begin{pmatrix}2&1&1\\4&3&3\\8&7&9\end{pmatrix}.
$$

The first pivot is $2$, giving

$$
\ell_1=(1,2,4)^T,\quad u_1^T=(2,1,1),\quad
A-\ell_1u_1^T=\begin{pmatrix}0&0&0\\0&1&1\\0&3&5\end{pmatrix}.
$$

The second pivot is now $1$, and its multiplier is $3/1=3$. Thus

$$
\ell_2=(0,1,3)^T,\quad u_2^T=(0,1,1),\quad
A-\ell_1u_1^T-\ell_2u_2^T=\begin{pmatrix}0&0&0\\0&0&0\\0&0&2\end{pmatrix}.
$$

Finally $\ell_3=(0,0,1)^T$ and $u_3^T=(0,0,2)$. The factors are

$$
L=\begin{pmatrix}1&0&0\\2&1&0\\4&3&1\end{pmatrix},\qquad
U=\begin{pmatrix}2&1&1\\0&1&1\\0&0&2\end{pmatrix}.
$$

For instance the last row of $LU$ is $4(2,1,1)+3(0,1,1)+(0,0,2)=(8,7,9)$. The demonstration displays each outer product and its residual so that the triangular structure can be followed one step at a time.

## 5. Existence, uniqueness, and cost

The construction requires nonzero pivots. Nonsingularity of $A$ alone does not ensure that this particular ordering works; pivoting will address that obstruction. For a nonsingular matrix, unpivoted unit-diagonal LU exists exactly when every leading principal submatrix is nonsingular. The determinant of the leading $k\times k$ block, once factored, is $u_{11}\cdots u_{kk}$. Conversely, if all those determinants are nonzero, each successive pivot is the ratio of two successive leading determinants (taking the size-zero determinant as one). No pivot vanishes, so the construction can proceed.

When the nonsingular factorisation exists it is unique under our convention. If $LU=\widetilde L\widetilde U$, then

$$
\widetilde L^{-1}L=\widetilde U U^{-1}.
$$

The left side is unit lower triangular and the right side upper triangular. A matrix of both types is diagonal, and its diagonal here is all ones. Both sides are therefore $I$ and the factors agree.

At step $k$, the trailing square has $(n-k)^2$ entries. Each update uses a multiplication and subtraction, or two flops. The divisions contribute only quadratic work. Hence the leading cost is

$$
2\sum_{k=1}^{n-1}(n-k)^2=\frac{(n-1)n(2n-1)}3
=\frac23n^3+O(n^2).
$$

This cubic setup cost buys a reusable pair of triangular factors. The next lesson explains how to use them for one right-hand side or many.
