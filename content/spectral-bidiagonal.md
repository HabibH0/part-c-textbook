## 1. Compute singular values without squaring the problem

For $A\in\mathbb R^{m\times n}$, the identity $A^TA=V\Sigma^T\Sigma V^T$ connects its SVD to a symmetric eigenproblem. It is a valid algebraic construction, but an explicit Gram matrix can lose information about small singular values.

For full column rank, $\kappa_2(A^TA)=\kappa_2(A)^2$. More concretely, rounding in $A^TA$ has a scale related to $u\|A\|_2^2$, where $u$ is unit roundoff. A squared singular value much smaller than that scale can be overwhelmed. Taking its square root later cannot recover the lost information.

Consider

$$
A_\epsilon=\begin{pmatrix}1&1\\\epsilon&0\\0&\epsilon\end{pmatrix},
\qquad
A_\epsilon^TA_\epsilon=
\begin{pmatrix}1+\epsilon^2&1\\1&1+\epsilon^2\end{pmatrix}.
$$

The Gram eigenvalues are $2+\epsilon^2$ and $\epsilon^2$, so the singular values are $\sqrt{2+\epsilon^2}$ and $|\epsilon|$. When floating-point addition rounds $1+\epsilon^2$ to 1, the explicitly formed Gram matrix becomes rank one, despite the original matrix retaining its nonzero small entries. The explorer shows that actual rounding event.

## 2. Independent left and right transformations

An eigenvalue similarity must use matching inverse transformations. An SVD has a different freedom: its left and right singular vectors need not be equal. We can apply **different** orthogonal transformations to rows and columns:

$$
B=L^TAR,\qquad A=LBR^T,
$$

where $L$ is $m\times m$ orthogonal and $R$ is $n\times n$ orthogonal. Then

$$
B^TB=R^TA^TLL^TAR=R^TA^TAR,
$$

so $A$ and $B$ have the same singular values, including multiplicities and zeros. Such transformations do not generally preserve eigenvalues of square $A$; that is not the goal.

The **Golub–Kahan bidiagonalisation** process chooses Householder reflectors so $B$ has only a diagonal and a first superdiagonal. Assume $m\ge n$. For a five-by-four input the target is

$$
B=\begin{pmatrix}
d_1&e_1&0&0\\
0&d_2&e_2&0\\
0&0&d_3&e_3\\
0&0&0&d_4\\
0&0&0&0
\end{pmatrix}.
$$

The entries $d_i,e_i$ can have either sign; they are not already singular values. For $m<n$, apply the corresponding construction to $A^T$ and transpose back, exchanging the roles of the left and right factors.

## 3. Follow every elimination stage

First choose a left reflector $H_{L,1}$ to transform the entire first column to a multiple of the first coordinate vector. It clears rows 2 through $m$ of that column. Next choose a right reflector $H_{R,1}$, fixing coordinate 1, to clear entries in columns 3 through $n$ of the first row. It leaves the first column unchanged.

At stage 2, the left reflector acts only in rows 2 through $m$. Earlier column tails are already zero, so they stay zero, and the first row is untouched. The right reflector then acts only in columns 3 through $n$, leaving the first two columns unchanged and preserving the first row's zeros.

Continue this alternating process. For a five-by-four example the meaningful stages are

$$
H_{L,1},\ H_{R,1},\ H_{L,2},\ H_{R,2},\
H_{L,3},\ H_{L,4}.
$$

After the second right reflector, the third row has only one possible entry to the right of its diagonal, so no further right elimination is needed. The final left reflector clears the fifth entry in column 4. Already-zero tails require no work; stable reflector signs avoid cancellation.

With

$$
L=H_{L,1}\cdots H_{L,n},\qquad
R=H_{R,1}\cdots H_{R,n-2},
$$

we have

$$
B=H_{L,n}\cdots H_{L,1}A
H_{R,1}\cdots H_{R,n-2}=L^TAR.
$$

These products explain factor accumulation, not a requirement to form every dense reflector. Compact rank-one updates preserve the arithmetic advantage. The demonstration displays each left or right operation separately, the remaining zero pattern, and the reconstruction residual.

Orthogonal reduction is normwise backward stable: the computed result can be interpreted through a small perturbation to $A$. This is not an unconditional relative-error guarantee for every tiny singular value. It avoids the unnecessary information loss of explicitly squaring the original matrix.

## 4. Finish the smaller structured problem

Write the square active bidiagonal block as diagonal $d_i$ and superdiagonal $e_i$. Its Gram matrix is symmetric tridiagonal:

$$
(B^TB)_{ii}=d_i^2+e_{i-1}^2,\qquad
(B^TB)_{i,i+1}=d_i e_i,\qquad e_0=0.
$$

For $B=\begin{pmatrix}3&4\\0&2\end{pmatrix}$, this gives
$B^TB=\begin{pmatrix}9&12\\12&20\end{pmatrix}$. Its eigenvalues are $(29\pm\sqrt{697})/2$; their nonnegative square roots are the singular values.

Mathematically, symmetric QR on $B^TB$ explains a route to the answer. Numerically, bidiagonal SVD iterations carry out the corresponding transformations on $B$ itself, without explicitly squaring it. That distinction preserves the purpose of bidiagonalisation.

If the completed bidiagonal SVD is $B=U_B\Sigma V_B^T$, substitute into $A=LBR^T$:

$$
A=(LU_B)\Sigma(RV_B)^T.
$$

Both families of transformations must be accumulated when vectors are requested. Zero singular values require orthonormal nullspace completion rather than division by zero.

Two important alternatives are bidiagonal **divide-and-conquer**, associated with Gu and Eisenstat, and **dqds**, the differential quotient-difference algorithm with shifts associated with Fernando and Parlett. Divide-and-conquer is useful for assembling singular vectors as well as values; dqds is chiefly a singular-value method, so requesting vectors changes the computational task. Both are retained here as optional algorithmic context.

## 5. Interpret the work estimates

For tall or square dense input, a useful scale is approximately $4mn^2$ flops for the singular values and about $20mn^2$ when singular vectors are also computed. Another common square-like accounting gives $\frac83mn^2$ for values and an additional approximately $20mn^2$ for vectors. They are illustrative estimates with different accounting conventions.

The basic dense bidiagonal reduction has leading count $4mn^2-\frac43n^3$; at $m=n$ this becomes $\frac83n^3$, explaining the smaller square-case coefficient. For very tall matrices a preliminary thin QR can change the preferred route. Full $m\times m$ left-vector output also has substantial storage and formation costs beyond a thin SVD. Always specify dimensions, output shapes and whether a quoted vector cost is additional or total.
