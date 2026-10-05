## 1. A local orthogonal transformation

A Householder reflector acts on a whole active tail. When a matrix has useful zeros, a more local operation can avoid unnecessary work. A **Givens rotation** acts on two coordinates:

$$
G=\begin{pmatrix}c&s\\-s&c\end{pmatrix},\qquad c^2+s^2=1.
$$

Its columns are orthonormal, so $G^TG=I$. It preserves lengths and has determinant one. With $c=\cos\theta$, $s=\sin\theta$, this convention rotates a column vector through angle $-\theta$.

Unlike a Householder reflector, a general Givens rotation is **not symmetric**. Its inverse is $G^T$, not $G$. For $c=0,s=1$, applying $G$ twice gives $-I$, which makes that distinction unmistakable.

## 2. Zero one component

To send $(a,b)^T$ to $(r,0)^T$, take

$$
r=\sqrt{a^2+b^2},\qquad c=a/r,\quad s=b/r,
$$

provided $(a,b)\ne(0,0)$. Then

$$
G\begin{pmatrix}a\\b\end{pmatrix}
=\begin{pmatrix}(a^2+b^2)/r\\(-ba+ab)/r\end{pmatrix}
=\begin{pmatrix}r\\0\end{pmatrix}.
$$

If both entries are zero, choose $c=1,s=0$. In numerical code a scaled hypotenuse routine avoids squaring very large or tiny numbers directly.

For $(a,b)=(3,4)$, choose $c=3/5,s=4/5$, giving $(5,0)$. The same rotation acts on every other column in those two rows. If the corresponding entries of another column are $(1,2)$, they become $(11/5,2/5)$. Zeroing one selected entry does not mean the rest of the two rows remain unchanged.

## 3. Embed the rotation in a larger matrix

To act on rows $i,j$, use the identity except for the submatrix at rows and columns $i,j$:

$$
G_{ii}=G_{jj}=c,\qquad G_{ij}=s,\qquad G_{ji}=-s.
$$

The indices need not be neighbours. Left multiplication changes just these two rows. Applied to their old row vectors $r_i,r_j$, the new rows are

$$
r_i'=cr_i+sr_j,\qquad r_j'=-sr_i+cr_j.
$$

Both formulas must use the **old** rows. Overwriting the first before computing the second with its original value would implement the wrong transformation.

Right multiplication changes two columns instead. With this same embedded $G$, the new columns are $c_i'=cc_i-sc_j$ and $c_j'=sc_i+cc_j$. The signs differ from the row-update formulas because multiplication is on the other side.

For example, a rotation on indices $1,3$ of a four-dimensional vector leaves coordinates $2,4$ unchanged. Locality concerns the selected coordinate pair, not necessarily adjacency.

## 4. Upper Hessenberg QR

An upper Hessenberg matrix satisfies $a_{ij}=0$ when $i>j+1$. Only one entry per column lies below the diagonal. An $n\times n$ upper Hessenberg matrix can therefore be triangularised by $n-1$ adjacent Givens rotations:

1. Act on rows $1,2$ to clear entry $(2,1)$.
2. Act on rows $2,3$ to clear the current entry $(3,2)$.
3. Continue with rows $k,k+1$ to clear $(k+1,k)$.

The earlier zero columns stay zero because both rows now being mixed have zeros in those positions. For a five-by-five input the sequence is

$$
G_4G_3G_2G_1A=R.
$$

Recover the factorisation by transposing and reversing the applied product:

$$
A=G_1^TG_2^TG_3^TG_4^TR=QR.
$$

The leftmost factor of $Q$ is $G_1^T$. Products of orthogonal matrices remain orthogonal, so this is QR. The demonstration follows exactly this four-stage construction on a five-by-five Hessenberg matrix, displaying the active pair and the growing triangular zero pattern.

Each rotation updates at most two rows across $O(n)$ remaining entries. With $n-1$ rotations, this structured factorisation costs $O(n^2)$ rather than the cubic cost of a general dense square QR. Forming a dense full $Q$ can still be avoided when only its action is needed.

## 5. Locality is useful, but does not prevent all fill

Givens rotations are convenient for selected eliminations, structured matrices, and some sparse problems. They can also be used to update a factorisation after data changes. Householder transformations are usually a better general-purpose dense tool because each can eliminate a whole column tail at once.

A rotation can create a nonzero where one of the selected rows previously had zero; this is **fill-in**. Thus “acts on only two rows” does not mean “preserves every zero”. The Hessenberg argument succeeds because of a specific shared zero pattern and an appropriate order of operations. For a general sparse matrix, ordering and fill must be analysed rather than assumed away.

Both rotations and reflectors preserve Euclidean geometry. That is what makes orthogonal triangularisation especially well suited to a problem whose objective is a Euclidean residual norm.
