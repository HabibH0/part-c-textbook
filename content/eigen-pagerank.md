## 1. Optional application: a ranking is an eigenvector

This lesson is an optional application of the power method and a brief introduction to a Markov-chain model. PageRank is a historical example of using the link structure of the web to help rank pages; the model here is not a description of every signal used by a modern search engine.

The idea is recursive: a page is important if important pages link to it. To turn that statement into mathematics, give every page a nonnegative score, normalised so the scores sum to one. A page distributes its current score among the pages it links to. A consistent ranking is one unchanged by this redistribution.

## 2. Choose and keep a column convention

Let $W_{ij}=1$ when page $j$ links to page $i$, and $0$ otherwise. This is a directed link: the column is the source and the row is the destination. If page $j$ has $d_j>0$ outgoing links, define

$$
P_{ij}=\frac{W_{ij}}{d_j}.
$$

Then $P$ is nonnegative and **column-stochastic**: $\sum_iP_{ij}=1$ for every column. If $x_j$ is the probability of being at page $j$, the next distribution is $Px$, because its $i$th component collects all incoming contributions $P_{ij}x_j$.

A page with no outgoing links is a dangling node. Its raw column cannot be normalised. One standard convention replaces that column by the uniform probability vector $\boldsymbol1/n$. The demonstration applies this convention before forming $P$.

For any probability vector $x$, nonnegativity of $P$ gives $Px\ge0$ and

$$
\boldsymbol1^TPx=\boldsymbol1^Tx=1.
$$

The column-sum identity makes $\boldsymbol1^T$ a **left** eigenvector. The stationary ranking is a **right** eigenvector; these roles should not be interchanged.

## 3. Add teleportation

A raw link matrix may have disconnected components, absorbing regions, or periodic cycles. To make the model well behaved, choose $0<\alpha<1$ and define

$$
A=\alpha P+\frac{1-\alpha}{n}\boldsymbol1\boldsymbol1^T.
$$

With probability $\alpha$, follow a link; with probability $1-\alpha$, jump uniformly to any page. Each entry of $A$ is at least $(1-\alpha)/n>0$, and each column still sums to one.

The Perron–Frobenius theorem, used here as optional background, guarantees for this strictly positive matrix a unique positive stationary vector $v$ with $\boldsymbol1^Tv=1$, associated with a simple dominant eigenvalue. That eigenvalue is $1$: if $Av=\lambda v$, multiply by $\boldsymbol1^T$ to get $1=\lambda$ under this normalisation. Every other eigenvalue has smaller magnitude.

Plain nonnegativity alone does not guarantee a unique positive dominant vector or power-method convergence. Teleportation supplies the stronger hypotheses needed here.

## 4. Compute the ranking

Start from the uniform distribution $x_0=\boldsymbol1/n$ or another probability vector and repeat

$$
x_{k+1}=Ax_k=\alpha Px_k+\frac{1-\alpha}{n}\boldsymbol1.
$$

The second expression uses $\boldsymbol1^Tx_k=1$, so it avoids storing a dense all-ones matrix. Mass is preserved in exact arithmetic. In finite precision one may renormalise by the sum to correct tiny drift.

The usual power method can instead normalise each iterate by its Euclidean norm. That produces the same direction, because scaling a positive vector does not change its ranking. To report probabilities, divide by the sum at the end. Euclidean-normalised vectors need not sum to one; do not mix the two conventions in a calculation.

### A complete two-page example

Suppose both pages link to page 1, giving

$$
P=\begin{pmatrix}1&1\\0&0\end{pmatrix},\qquad \alpha=\frac45.
$$

Then

$$
A=\begin{pmatrix}9/10&9/10\\1/10&1/10\end{pmatrix}.
$$

For every starting probability vector, one multiplication produces $(9/10,1/10)^T$. This is the stationary distribution. Teleportation keeps page 2's score positive even though no link sends mass there.

## 5. A convergence argument without diagonalization

For a real vector $z$, column-stochasticity and the triangle inequality imply

$$
\|Pz\|_1\le\sum_{i,j}P_{ij}|z_j|=\sum_j|z_j|=\|z\|_1.
$$

If $x$ and $y$ are probability vectors, their difference has sum zero. Hence the teleportation term cancels and

$$
\|Ax-Ay\|_1=\alpha\|P(x-y)\|_1\le\alpha\|x-y\|_1.
$$

In particular $\|x_k-v\|_1\le\alpha^k\|x_0-v\|_1$. This bound holds even without an eigenbasis. A larger $\alpha$ follows links more strongly but weakens this worst-case contraction guarantee. It can also make rankings more sensitive to changes in the link graph.

For any probability iterate $x$, set $r=Ax-x$. Since $v=Av$,

$$
\|x-v\|_1\le\|x-Ax\|_1+\|Ax-Av\|_1
\le\|r\|_1+\alpha\|x-v\|_1.
$$

Thus $\|x-v\|_1\le\|r\|_1/(1-\alpha)$. This provides an interpretable stopping estimate. It may exceed the trivial distance bound $2$ for probability vectors, in which case it is valid but uninformative.

## 6. Read a ranking carefully

The demonstration shows a small directed network, its transition matrix, the current scores and the stationary reference computed from a linear system. Node area and score bars represent probability; arrows show links before teleportation. The reference is computed independently of the displayed power iterates.

Approximate scores often suffice when their separation is large. Near-tied scores can change order under small computational or modelling changes, so a few iterations do not guarantee every ranking decision. The model measures one form of link-based importance; it does not establish the truth or quality of a page's contents.
