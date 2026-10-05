## 1. Why preprocessing changes the cost

A dense QR factorisation costs $O(n^3)$. Even if successful shifting leads to only $O(n)$ full-size iterations overall, a naive dense implementation would cost $O(n^4)$. To reach cubic overall work, first reduce the matrix to a shape on which a QR step is cheaper.

An **upper Hessenberg matrix** $H$ satisfies

$$
h_{ij}=0\quad\text{whenever }i>j+1.
$$

It is one subdiagonal away from triangular. For a five-by-five matrix the allowed pattern is

$$
\begin{pmatrix}
*&*&*&*&*\\
*&*&*&*&*\\
0&*&*&*&*\\
0&0&*&*&*\\
0&0&0&*&*
\end{pmatrix}.
$$

The remaining subdiagonal entries are exactly the couplings whose disappearance will split off eigenvalues or blocks. Asterisks mean entries that may be nonzero, not entries forced to be nonzero.

## 2. Use two-sided Householder transformations

To clear entries $a_{31},\ldots,a_{n1}$, apply a Householder reflector to the tail $(a_{21},\ldots,a_{n1})^T$. Embed it in the full space as

$$
F_1=I-2v_1v_1^T,\qquad v_1=(0,*,\ldots,*)^T,\qquad \|v_1\|_2=1.
$$

Left multiplication by $F_1$ clears those entries. But $F_1A$ alone is not a similarity transformation and need not preserve eigenvalues. Also multiply on the right, obtaining $F_1AF_1=F_1^TAF_1$. Because $F_1e_1=e_1$, the right multiplication leaves the newly cleared first column unchanged.

At the next stage choose $v_2=(0,0,*,\ldots,*)^T$ to clear entries below position $(3,2)$. Then

$$
A^{(2)}=F_2F_1AF_1F_2.
$$

Continue for $j=1,\ldots,n-2$, with $v_j$ having its first $j$ entries zero. The resulting Hessenberg matrix is

$$
H=F_{n-2}\cdots F_1AF_1\cdots F_{n-2}=V^TAV,\qquad
V=F_1\cdots F_{n-2}.
$$

Every stage is an orthogonal similarity, so it preserves the eigenvalues in exact arithmetic. A zero active tail requires no reflector. Practical reflector construction uses the stable target-sign choice from Householder QR, avoiding cancellation.

## 3. Why earlier zeros survive

At stage $j$, the reflector acts only on rows and columns $j+1,\ldots,n$. Earlier column $\ell<j$ already has zeros below row $\ell+1$, so its entries in those active rows are all zero. Left multiplication only mixes zeros there.

Right multiplication leaves columns $1,\ldots,j$ unchanged because the reflector equals the identity on their coordinate vectors. Hence it cannot spoil the just-cleared column or any earlier one. Later stages preserve the same structure inductively.

For a $5\times5$ input, three stages clear respectively $(3,1),(4,1),(5,1)$; then $(4,2),(5,2)$; then $(5,3)$. The demonstration shows each left multiplication and the matching right multiplication separately, along with the accumulated orthogonal basis. It is the completed pair that provides similarity.

Applying reflectors in compact form uses rank-one updates rather than forming a dense reflector for every operation. Summing the shrinking two-sided updates costs $O(n^3)$ once. Accumulating $V$ explicitly costs additional work of the same order if Schur vectors are wanted.

## 4. Hessenberg QR uses adjacent Givens rotations

For an upper Hessenberg $H$, each column contains only one possible nonzero entry below the diagonal. Adjacent rotations $G_1,\ldots,G_{n-1}$ eliminate these entries in order:

$$
G_{n-1}\cdots G_1(H-sI)=R,\qquad
Q=G_1^T\cdots G_{n-1}^T.
$$

There are $n-1$ rotations, each updating two rows across $O(n)$ entries. The factorisation therefore costs $O(n^2)$ rather than $O(n^3)$. Forming the next iterate $RQ+sI$ also uses the stored rotations: right multiplication by each $G_j^T$ updates just two columns, again costing $O(n^2)$ overall.

Explicitly multiplying two dense factors with a generic cubic matrix product would discard this benefit. The stored local transformations are part of the efficient algorithm, not merely a proof device.

## 5. Prove that the shape is preserved

The shifted matrix $H-sI$ remains Hessenberg. The product $Q=G_1^T\cdots G_{n-1}^T$ is also upper Hessenberg: successive right rotations mix adjacent columns and create at most the first subdiagonal. Equivalently, for nonsingular $R$, $Q=(H-sI)R^{-1}$ has this structure because right multiplication by an upper triangular matrix preserves the Hessenberg zero pattern. The rotation construction also covers singular cases.

Now examine $(RQ)_{ij}=\sum_\ell r_{i\ell}q_{\ell j}$ with $i>j+1$. Triangularity permits only $\ell\ge i$, but then $\ell>j+1$ and $q_{\ell j}=0$. Every term vanishes. Thus $RQ$ is Hessenberg, and adding $sI$ leaves that structure unchanged.

Consequently the preprocessing is performed only once. Every later QR step retains the cheap form. If preprocessing gives $H=V^TAV$ and the iteration accumulates $U$, the Schur basis for the original input is $VU$, not just $U$.

For symmetric inputs, a symmetric Hessenberg matrix is tridiagonal. That additional structure leads to further improvements, developed in the next chapter; the general Hessenberg argument here applies without symmetry.
