## 1. Approximation by a small number of directions

A matrix can have many rows and columns while most of its action is concentrated in a few singular directions. **Low-rank approximation** keeps those directions and discards the rest. The central question is not just whether this makes the matrix smaller to store, but whether any other matrix of the same allowed rank could do better.

You need the SVD, matrix norms, and the subspace intersection lemma: subspaces of $\mathbb R^n$ whose dimensions sum to more than $n$ share a nonzero vector. We will use that lemma to prove an optimality result.

## 2. Matrix norms in singular coordinates

Let $A=U\Sigma V^T$, initially with $m\ge n$. For $\|x\|_2=1$, put $y=V^Tx$. Orthogonality gives $\|y\|_2=1$, so

$$
\|Ax\|_2^2=\|\Sigma y\|_2^2=\sum_{i=1}^n\sigma_i^2 y_i^2\le\sigma_1^2\sum_{i=1}^n y_i^2=\sigma_1^2.
$$

Thus $\|A\|_2\le\sigma_1$. Equality is attained at $x=v_1$, since $Av_1=\sigma_1u_1$. Therefore

$$
\boxed{\|A\|_2=\max_{x\ne0}\frac{\|Ax\|_2}{\|x\|_2}=\sigma_1(A).}
$$

The argument uses length preservation by rectangular $U$, not the generally false assertion $UU^T=I_m$. The complex version uses $|y_i|^2$.

For $p=\min(m,n)$, trace cyclicity gives

$$
\|A\|_F^2=\operatorname{tr}(A^TA)=\operatorname{tr}(V\Sigma^2V^T)=\sum_{i=1}^p\sigma_i^2.
$$

The **nuclear norm** is $\|A\|_*=\sum_{i=1}^p\sigma_i$. Spectral, Frobenius, and nuclear norms therefore measure, respectively, the largest singular value, the Euclidean length of their list, and its sum. These identities also hold for wide matrices by using the full SVD or transposing.

A norm is **unitarily invariant** if $\|UAV\|=\|A\|$ for compatible square unitary factors. Such norms depend only on singular values; more precisely, they correspond to symmetric gauge norms of the singular-value vector. This explains why singular values are the natural language for many approximation questions. The induced 1- and infinity-norms are not generally unitarily invariant.

## 3. Truncation, storage, and multiplication

For an integer $0\le k<p$, define the **truncated SVD**

$$
A_k=\sum_{i=1}^k\sigma_i u_i v_i^T=U_k\Sigma_kV_k^T.
$$

It has rank at most $k$. Its rank is exactly $k$ only if $\sigma_k>0$. We use $k$ for the permitted rank and $r$ for the exact rank of $A$. With $k=0$, the empty sum is the zero matrix. If $k\ge r$, then $A_k=A$; if $k\ge p$, simply take the whole matrix.

Store the factors rather than the dense product. $U_k$ needs $mk$ entries, $V_k$ needs $nk$, and the diagonal of $\Sigma_k$ needs $k$. Total storage is

$$
(m+n+1)k\quad\text{numbers, instead of }mn.
$$

This is a saving only when $(m+n+1)k<mn$. Storing all $k^2$ entries of a diagonal matrix is unnecessary. Combining the diagonal into one factor would instead give $(m+n)k$ entries, but the separate three-factor convention will be used here.

To apply the approximation to a vector, compute

$$
z=V_k^Tx,\qquad w=\Sigma_kz,\qquad A_kx=U_kw.
$$

For $k\ge1$, the exact dense dot-product counts are $k(2n-1)$, $k$, and $m(2k-1)$, respectively. Their total is $2(n+m)k-m$, with leading cost $2(n+m)k$, or $O((m+n)k)$. Forming the dense $A_k$ first would throw away this multiplication benefit. Computing the SVD initially has a separate cost; repeated use can justify it.

## 4. The error made by truncation

Subtract the retained terms:

$$
A-A_k=\sum_{i=k+1}^p\sigma_i u_i v_i^T.
$$

Its nonzero singular values are exactly the discarded ones. Consequently,

$$
\|A-A_k\|_2=\sigma_{k+1},\qquad\|A-A_k\|_F=\sqrt{\sum_{i=k+1}^p\sigma_i^2},\qquad\|A-A_k\|_*=\sum_{i=k+1}^p\sigma_i.
$$

For nonzero $A$, the relative spectral error is $\sigma_{k+1}/\sigma_1$. A good relative spectral approximation means $\sigma_{k+1}\ll\sigma_1$. Many individually small discarded values can still give a substantial Frobenius error, because that norm measures their combined energy. Relative error divided by $\|A\|$ is undefined when $A=0$; its absolute error is simply zero.

### Worked example

If the singular values are $8,3,1$, retaining two gives spectral, Frobenius, and nuclear errors all equal to $1$. Retaining one gives spectral error $3$, Frobenius error $\sqrt{10}$, and nuclear error $4$. The rank-one relative spectral error is $3/8$.

Changing the error norm changes its value and the meaning of “small”, even when the same truncated matrix is an optimal choice.

## 5. Why no rank-k matrix can do better

**Best low-rank approximation theorem.** For any $A\in\mathbb R^{m\times n}$ and integer $0\le k<p$,

$$
\boxed{\min_{\operatorname{rank}(B)\le k}\|A-B\|_2=\sigma_{k+1}(A)=\|A-A_k\|_2.}
$$

The constraint is rank **at most** $k$. The minimiser need not be unique. We have already shown that $A_k$ achieves the claimed error. The work is to show that an arbitrary competitor $B$ cannot have a smaller one.

### Step 1: every competitor loses many input directions

A rank-at-most-$k$ matrix can be factored as $B=B_1B_2^T$, where $B_1\in\mathbb R^{m\times k}$ and $B_2\in\mathbb R^{n\times k}$. If the actual rank is smaller, pad a rank factorisation with zero columns. Hence $\operatorname{null}(B_2^T)\subseteq\operatorname{null}(B)$ has dimension at least $n-k$. Equivalently, rank–nullity gives $\dim\operatorname{null}(B)\ge n-k$ directly.

Choose $W\in\mathbb R^{n\times(n-k)}$ with orthonormal columns in this null space, so $BW=0$. Restricting an operator to a subspace cannot increase its largest stretch:

$$
\|A-B\|_2\ge\|(A-B)W\|_2=\|AW\|_2.
$$

Indeed, for any unit $z$, $\|Wz\|_2=1$, so $\|(A-B)Wz\|_2\le\|A-B\|_2$. This justifies the first inequality.

### Step 2: one lost direction lies among A's strong directions

Let $S=\operatorname{span}(v_1,\ldots,v_{k+1})$. Its dimension is $k+1$, while the span of $W$ has dimension $n-k$. Their dimensions sum to $n+1$, so there is a nonzero common vector.

Explicitly, $[W,-V_{k+1}]$ has $n$ rows and $n+1$ columns, hence a nonzero null vector $(a,b)$. It gives $Wa=V_{k+1}b=x$. If $x=0$, independence of each column set would force $a=b=0$, a contradiction. Scale $x$ to length one. Orthonormality gives $\|a\|_2=\|b\|_2=1$.

### Step 3: bound the stretch from below

Write $x=\sum_{i=1}^{k+1}b_i v_i$ with $\sum_i b_i^2=1$. Then

$$
\|Ax\|_2^2=\sum_{i=1}^{k+1}\sigma_i^2 b_i^2\ge\sigma_{k+1}^2\sum_i b_i^2=\sigma_{k+1}^2.
$$

But $Bx=0$, so

$$
\|A-B\|_2\ge\|(A-B)x\|_2=\|Ax\|_2\ge\sigma_{k+1}.
$$

Every allowed $B$ obeys this lower bound. Taking $B=A_k$ gives equality and completes the proof. It also covers $k=0$ and a zero $\sigma_{k+1}$. The full right singular basis makes the same proof valid for wide matrices. Complex spaces use adjoints and absolute squares.

The geometric reason is precise: a low-rank competitor must annihilate some direction in which $A$ still has stretch at least $\sigma_{k+1}$.

## 6. Other norms and applications

The same truncated SVD is optimal in **every unitarily invariant norm**, including the Frobenius and nuclear norms. The general theorem is an extension of the spectral result; its full proof requires further singular-value inequalities. The proof above establishes the spectral case, not automatically every norm case. The error formulas in Section 4 give the optimal values for Frobenius and nuclear norms.

This is a special property of the low-rank problem. In other approximation problems, such as fitting with different residual norms, changing the norm can change the optimal solution. Even here the norm can affect uniqueness and the set of all minimisers.

**Principal component analysis (PCA)** is an important application. With observations as rows, subtract the column means to form a centred data matrix. Its leading right singular vectors are directions in feature space along which the data varies most. Keeping a few components gives a low-rank representation of the centred observations. The squared singular values are proportional to the corresponding sample variances.

Low-rank structure can be explicit, as in a product of two thin factors, or hidden in data whose columns are nearly dependent. It is not guaranteed: an identity matrix has a flat singular spectrum and no good lower-rank relative spectral approximation. Rapid singular-value decay is what makes truncation effective.

## 7. Images as matrices

A greyscale image is a matrix: its $(i,j)$ entry records the intensity of a pixel. Compute its SVD, retain $k$ terms, and display the reconstructed $A_k$. Low ranks often capture broad patterns; increasing the rank restores finer features. Colour images can be treated channel by channel, although this is only one possible approach.

Consider a $500\times500$ image of a university crest and lettering, reconstructed at ranks $1,5,10,20,50$. At rank $1$ the broad horizontal and vertical structure dominates. Ranks $5$ and $10$ begin to distinguish the lettering and crest; at $20$ the shapes are clearer, and at $50$ this example can look almost indistinguishable from the original. These are properties of that image, not a universal guarantee at rank $50$.

The original stores $250{,}000$ pixel values. Rank $50$ stores $(500+500+1)50=50{,}050$ factor entries: about one fifth as many **numbers**. This is not necessarily a fivefold reduction in file bytes: pixel and factor precision, metadata, and encoding all matter. Truncated-SVD compression is a useful mathematical illustration, not a claim to outperform modern image formats.

The demonstration uses a small generated greyscale image so that you can change the retained rank locally. Its singular values and reconstructions are computed from the actual image matrix. Compare the visible result, spectral error, Frobenius error, and number of stored factors. Display intensities are clipped to the valid grey range; the reported errors refer to the unclipped mathematical approximation, because clipping changes the matrix and can change its rank.

A $500\times500$ SVD is a modest problem for modern numerical software, but the decomposition still costs work. Compression becomes attractive when the resulting representation is useful enough to justify that initial computation.
