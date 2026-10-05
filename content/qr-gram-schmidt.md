## 1. Orthogonal coordinates for a rectangular matrix

LU makes a square system easy to solve. For a tall matrix, an orthonormal basis of its column space is particularly useful: it separates the part of a vector that the matrix can represent from the part it cannot. This leads to **QR factorisation**.

Let $A\in\mathbb R^{m\times n}$ with $m\ge n$. A thin QR factorisation is

$$
A=QR,\qquad Q\in\mathbb R^{m\times n},\quad Q^TQ=I_n,
\qquad R\in\mathbb R^{n\times n}\text{ upper triangular}.
$$

The columns of $Q$ are orthonormal. When $m>n$, $Q$ is not a square orthogonal matrix: $QQ^T$ is a projection, not $I_m$. Multiplication by $Q$ preserves the length of an $n$-vector, but multiplication by $Q^T$ need not preserve the length of an arbitrary $m$-vector.

A thin factorisation with $n$ orthonormal columns requires $m\ge n$. A wide matrix has a different full-QR shape. Rank-deficient tall matrices still have QR factorisations, but the simplest Gram–Schmidt algorithm below assumes **full column rank**, so that every normalisation is legitimate.

QR has applications beyond least squares: orthogonalisation, eigenvalue and SVD algorithms, and optimisation on sets of orthonormal matrices. In the last application, taking the orthonormal factor of a nearby full-rank matrix can return a trial point to the set $Q^TQ=I$; this is an example of a manifold retraction.

## 2. Orthogonalise, then normalise

Write $A=(a_1,\ldots,a_n)$. We seek orthonormal vectors spanning the same successive column spaces. Start with

$$
r_{11}=\|a_1\|_2,\qquad q_1=a_1/r_{11}.
$$

For column two, remove its component in the direction already chosen:

$$
r_{12}=q_1^Ta_2,\qquad w_2=a_2-r_{12}q_1,
\qquad r_{22}=\|w_2\|_2,\qquad q_2=w_2/r_{22}.
$$

In general, classical Gram–Schmidt uses

$$
r_{ij}=q_i^Ta_j\quad(1\le i<j),\qquad
w_j=a_j-\sum_{i=1}^{j-1}r_{ij}q_i,
$$

$$
r_{jj}=\|w_j\|_2,\qquad q_j=w_j/r_{jj}.
$$

The inner products are computed against the original column $a_j$. Set $r_{ij}=0$ for $i>j$. Do not interpret $q_i^Ta_j$ for every unequal pair as an instruction to fill the lower triangle too.

Why is $w_j$ orthogonal to every earlier $q_k$? Using their orthonormality,

$$
q_k^Tw_j=q_k^Ta_j-\sum_{i<j}r_{ij}q_k^Tq_i
=q_k^Ta_j-r_{kj}=0.
$$

Full column rank ensures $w_j\ne0$: otherwise $a_j$ would be a linear combination of earlier columns. Dividing by its norm therefore produces a unit vector. Induction proves both orthonormality and equality of the successive spans.

## 3. The coefficients are a triangular factor

Rearrange the definition of $w_j$:

$$
a_j=\sum_{i=1}^{j-1}r_{ij}q_i+r_{jj}q_j.
$$

The first equations are $a_1=r_{11}q_1$ and $a_2=r_{12}q_1+r_{22}q_2$. Collecting all columns gives $A=QR$. The absence of $q_i$ with $i>j$ explains why $R$ is upper triangular. Its positive diagonal makes it nonsingular under the full-rank assumption.

For a concrete example take

$$
a_1=(3,4,0)^T,\qquad a_2=(3,4,5)^T.
$$

Then $r_{11}=5$, $q_1=(3/5,4/5,0)^T$, and $r_{12}=5$. Subtracting $5q_1$ leaves $w_2=(0,0,5)^T$, so $r_{22}=5$ and $q_2=(0,0,1)^T$. Hence

$$
Q=\begin{pmatrix}3/5&0\\4/5&0\\0&1\end{pmatrix},\qquad
R=\begin{pmatrix}5&5\\0&5\end{pmatrix}.
$$

Check both $Q^TQ=I_2$ and $QR=A$. The demonstration changes the component of $a_2$ parallel to $a_1$ independently of the component perpendicular to it.

## 4. Existence is not the same as stable computation

Classical Gram–Schmidt is an elegant exact-arithmetic construction, but it can lose orthogonality in floating-point arithmetic. When $a_j$ is almost in the span of earlier columns, its residual is obtained by subtracting nearly equal quantities. Rounding errors that were small relative to $a_j$ can be large relative to $w_j$; normalising that residual then amplifies them.

If the residual is exactly zero, the current column is dependent and this algorithm must not divide by its norm. If it is merely very small, exact rank and numerical rank are different questions. A fixed decimal threshold is not a universal rank test: the scale and accuracy of the input matter.

Modified Gram–Schmidt projects from the progressively updated residual and often behaves better; reorthogonalisation can help further. Those variants are distinct algorithms. For a generally reliable dense QR construction, the next lesson develops Householder transformations.

## 5. Triangular orthogonalisation and CholeskyQR

Gram–Schmidt builds orthogonal columns by subtracting earlier columns. Since $R$ is nonsingular, the result can be written $Q=AR^{-1}$. This viewpoint is called **triangular orthogonalisation**. Implementations use triangular solves rather than explicitly forming the inverse.

Another algorithm with that form is **CholeskyQR**:

1. Form the Gram matrix $G=A^TA$.
2. Compute its Cholesky factorisation $G=R^TR$.
3. Obtain $Q$ from $QR=A$ by a triangular solve.

In exact arithmetic, full column rank makes $G$ positive definite, and

$$
Q^TQ=R^{-T}A^TAR^{-1}=R^{-T}R^TRR^{-1}=I.
$$

The method can be very fast, but this single-pass form is not generally numerically stable. Forming $A^TA$ squares the spectral condition number, and rounding can destroy the small positive eigenvalues needed by Cholesky. The normal-equations lesson explains that mechanism. Fast matrix products alone do not establish reliable orthogonality.

Householder QR instead applies orthogonal maps to make the matrix triangular: **orthogonal triangularisation**. Its stable construction does not need pivoting merely to control rounding error. Column pivoting has a different purpose—revealing numerical rank—which we retain as an optional extension in the next lesson.
