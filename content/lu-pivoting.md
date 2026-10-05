## 1. A nonsingular matrix can defeat unpivoted elimination

Consider

$$
A=\begin{pmatrix}0&1\\1&0\end{pmatrix}.
$$

It is nonsingular: $\det A=-1$. Yet the first elimination step asks us to divide by $a_{11}=0$. This is an ordering failure, not a singular system.

In fact this $A$ has no factorisation $A=LU$ with both factors triangular. If such factors existed, nonsingularity would force their diagonals to be nonzero. Then $(LU)_{11}=l_{11}u_{11}\ne0$, contradicting $a_{11}=0$. Under the unit-diagonal convention the contradiction is even more immediate: $u_{11}=0$ would make $U$ singular.

Exchange the two rows instead. With

$$
P=\begin{pmatrix}0&1\\1&0\end{pmatrix},
$$

we get $PA=I=LU$ with $L=U=I$. Pivoting makes the same equations usable in a different order.

## 2. Partial pivoting and permutations

At elimination step $k$, **partial pivoting** chooses an index $p\ge k$ satisfying

$$
|u_{pk}|=\max_{i=k,\ldots,n}|u_{ik}|.
$$

Exchange active rows $k$ and $p$ and then eliminate below the pivot. “Largest” means **largest magnitude**, not largest signed entry. If the active column is $(-7,2,5)^T$, choose $-7$. Ties may be resolved by any consistent rule.

A permutation matrix contains exactly one $1$ in every row and column and zeros elsewhere. It is orthogonal, so $P^{-1}=P^T$. Left multiplication $PA$ reorders rows; right multiplication $AP$ reorders columns. A product of individual row swaps gives the overall $P$, and the factorisation is

$$
PA=LU.
$$

To solve the original system, use

$$
Ly=Pb,\qquad Ux=y.
$$

The right-hand side must undergo the **same row reordering**. Row pivoting reorders equations, not the unknowns, so the final $x$ is already in the original variable order. A permutation can be stored as a vector of row indices; no dense matrix is needed to apply it.

## 3. Later swaps must also update the stored multipliers

When rows are swapped at step $k$, the previous $k-1$ columns of $L$ already contain multipliers attached to those rows. Swap those stored portions too. Do not swap the whole rows of a completed unit lower triangular $L$, because its uncomputed entries and diagonal have a different role.

Here is an example where the first pivot stays put but the second step swaps rows:

$$
A=\begin{pmatrix}4&1&0\\2&1&1\\1&3&1\end{pmatrix}.
$$

The first multipliers are $1/2$ and $1/4$. After the first elimination, the active rows are

$$
\begin{pmatrix}0&1/2&1\\0&11/4&1\end{pmatrix}.
$$

At step two, $11/4$ wins. Swapping those rows also swaps the previous multipliers $1/2$ and $1/4$. The new multiplier is $(1/2)/(11/4)=2/11$. Thus

$$
P=\begin{pmatrix}1&0&0\\0&0&1\\0&1&0\end{pmatrix},\qquad
L=\begin{pmatrix}1&0&0\\1/4&1&0\\1/2&2/11&1\end{pmatrix},
$$

$$
U=\begin{pmatrix}4&1&0\\0&11/4&1\\0&0&9/11\end{pmatrix}.
$$

For $b=(6,7,10)^T$, we must use $Pb=(6,10,7)^T$. Forward substitution yields $(6,17/2,27/11)^T$ and back substitution yields $x=(1,2,3)^T$. Multiplying the displayed factors verifies $LU=PA$, not $A$. The demonstration includes this later-swap example.

## 4. Why pivoted LU exists for every nonsingular matrix

We can prove this by induction on the dimension in exact arithmetic.

The first column of a nonsingular matrix cannot be zero, so a row permutation brings a nonzero entry $a$ to the first position. Partition the permuted matrix as $\begin{pmatrix}a&r^T\\c&B\end{pmatrix}$ and form $S=B-cr^T/a$.

The block identity is

$$
\begin{pmatrix}a&r^T\\c&B\end{pmatrix}
=\begin{pmatrix}1&0\\c/a&I\end{pmatrix}
\begin{pmatrix}a&r^T\\0&S\end{pmatrix}.
$$

The first factor is invertible and $a\ne0$. If $S$ were singular, choose a nonzero $z$ with $Sz=0$. Then $(-r^Tz/a,z)^T$ would be a nonzero null vector of the upper block factor, making the original matrix singular. This contradiction proves $S$ nonsingular.

By induction, $S$ has a pivoted LU factorisation. Extend its row permutations by leaving the first row fixed, and apply them to $c/a$ as well as the trailing block. This produces the required full $P,L,U$. The $1\times1$ base case is immediate. The argument also explains why a nonsingular active block always contains an available nonzero pivot in its first column.

Existence in exact arithmetic does not mean every very large problem fits in memory, nor does it promise an accurate forward answer for an ill-conditioned system. It establishes that row pivoting removes this algebraic breakdown for nonsingular square matrices.

## 5. Small pivots, growth, and stability

Pivoting is useful before a pivot becomes exactly zero. Consider

$$
A_\varepsilon=\begin{pmatrix}\varepsilon&1\\1&1\end{pmatrix},\qquad 0<\varepsilon\ll1.
$$

Without pivoting the multiplier is $1/\varepsilon$ and the second pivot is $1-1/\varepsilon$. Huge intermediates appear even though the original entries are modest. After exchanging rows, the first pivot is $1$, the multiplier is $\varepsilon$, and the second pivot is $1-\varepsilon$.

Partial pivoting guarantees $|l_{ik}|\le1$ because it divides each active-column entry by one of largest magnitude. This controls multipliers, but does **not** bound all subsequent entries of $U$ by the original scale. For example,

$$
A=\begin{pmatrix}1&0&1\\-1&1&1\\-1&-1&1\end{pmatrix}
$$

with first-available tie breaking has pivots $1,1,4$. Its upper factor contains $4$ even though all input entries have magnitude at most $1$. Larger related examples can exhibit severe growth.

The factorisation backward-error target is

$$
\widehat L\widehat U=PA+\Delta A,
$$

where $\|\Delta A\|$ is small relative to the matrix scale. Partial pivoting is usually effective in practice and is widely used, but exceptional unstable examples exist. Large factor growth can weaken the backward-error guarantee. Even when backward error is small, conditioning still determines the possible forward error in $x$.

Pivot searches and row exchanges add $O(n^2)$ comparisons and data movement to dense elimination; the leading arithmetic cost remains $\tfrac23n^3$. For $k$ right-hand sides the total remains $\tfrac23n^3+O(kn^2)$.

## 6. Optional extension: complete pivoting and low rank

**Complete pivoting** searches the entire active submatrix for an entry of largest magnitude, allowing both row and column exchanges. One convention is

$$
PAQ=LU.
$$

To solve, first solve $LUz=Pb$, then set $x=Qz$, since $PAQz=Pb$. Unlike row pivoting alone, column pivoting changes the coordinate order of the unknowns. Searching a whole active square also costs more comparisons than searching one column.

When singular values decay rapidly, complete-pivoting elimination often produces a useful low-rank approximation from its first few outer products, sometimes close in quality to truncated SVD. This is a practical tendency, not the SVD's universal optimality theorem. For $B_k=\sum_{j=1}^k\ell_j u_j^T$, the approximation to the original matrix is $P^TB_kQ^T$. The trailing residual tells us how much of the permuted matrix remains unmatched.
