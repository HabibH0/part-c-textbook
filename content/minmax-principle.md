## 1. From the largest stretch to every singular value

The spectral norm finds the largest possible stretch of a matrix. But how can we characterise the second largest singular value without first computing an SVD? Maximising over single vectors just returns the largest again. The missing ingredient is a choice of **subspace**.

You need the SVD, the spectral theorem for real symmetric or complex Hermitian matrices, and the subspace intersection lemma. Throughout this lesson, eigenvalues and singular values are ordered from largest to smallest, and every quotient is evaluated only at nonzero vectors.

For $A\in\mathbb C^{m\times n}$ with $m\ge n$, define the stretch quotient

$$
g_A(x)=\frac{\|Ax\|_2}{\|x\|_2}.
$$

Multiplying $x$ by a nonzero scalar does not change this quotient. We can therefore minimise or maximise on the unit sphere instead.

For a fixed $i$-dimensional subspace $S$, consider its weakest direction:

$$
\mu_A(S)=\min_{x\in S,\ \|x\|_2=1}\|Ax\|_2.
$$

**Courant–Fischer for singular values** states

$$
\boxed{\sigma_i(A)=\max_{\dim S=i}\ \min_{0\ne x\in S}g_A(x).}
$$

Read it in two stages. First choose a subspace of dimension $i$. Within it, measure the smallest stretch. Then choose the subspace for which this guaranteed stretch is largest. The outer maximum does not choose a different subspace for each vector: it chooses one whole subspace before the inner minimisation.

## 2. A concrete example and a coordinate formulation

Let $A=\operatorname{diag}(5,3,1)$ and $i=2$. On $S=\operatorname{span}(e_1,e_2)$, a unit vector has the form $(a,b,0)$ with $|a|^2+|b|^2=1$. Its squared output length is

$$
25|a|^2+9|b|^2\ge9.
$$

Equality occurs at $e_2$, so this plane guarantees stretch $3$. On $\operatorname{span}(e_1,e_3)$ the worst stretch is only $1$. The theorem says that no plane can guarantee more than $3$. Adding a strong direction to a plane is not enough: its weakest direction still matters.

For any fixed $S$, choose an orthonormal basis matrix $Q\in\mathbb C^{n\times i}$ with $Q^*Q=I_i$ and $\operatorname{range}(Q)=S$. Write $x=Qy$. Length preservation gives

$$
\mu_A(S)=\min_{\|y\|_2=1}\|AQy\|_2=\sigma_{\min}(AQ)=\sigma_i(AQ).
$$

The basis $Q$ is fixed in this inner minimisation. Different orthonormal bases for the same subspace give the same result. We then maximise this value over the possible subspaces, or equivalently over all such $Q$.

## 3. Proving the max–min formula

Write $A=U\Sigma V^*$ and let

$$
T_i=\operatorname{span}(v_i,\ldots,v_n),\qquad\dim T_i=n-i+1.
$$

**Upper bound for every candidate.** Fix any $i$-dimensional $S$. Since $i+(n-i+1)=n+1$, the intersection $S\cap T_i$ contains a nonzero vector. Normalise one to obtain $w$ of length one. Expand

$$
w=\sum_{j=i}^n c_jv_j,\qquad\sum_{j=i}^n|c_j|^2=1.
$$

Because $w$ only uses trailing singular directions,

$$
\|Aw\|_2^2=\sum_{j=i}^n\sigma_j^2|c_j|^2\le\sigma_i^2.
$$

The minimum over $S$ is at most the value at this particular $w$. Thus $\mu_A(S)\le\sigma_i$ for **every** candidate $S$, and its maximum is at most $\sigma_i$.

**A subspace attaining the bound.** Set $S_*=\operatorname{span}(v_1,\ldots,v_i)$. Every unit vector in $S_*$ has

$$
\|Ax\|_2^2=\sum_{j=1}^i\sigma_j^2|c_j|^2\ge\sigma_i^2.
$$

Equality is attained at $x=v_i$. Therefore $\mu_A(S_*)=\sigma_i$, proving the reverse inequality and the theorem. Repeated or zero singular values cause no problem: the argument uses non-strict ordering.

## 4. The dual min–max formula

The same singular value also has the characterisation

$$
\boxed{\sigma_i(A)=\min_{\dim S=n-i+1}\ \max_{0\ne x\in S}g_A(x).}
$$

Now choose a subspace of dimension $n-i+1$, observe its **strongest** direction, and make that strongest stretch as small as possible. Both the dimension and the order of the extrema have changed.

To prove it, fix such an $S$ and intersect it with $\operatorname{span}(v_1,\ldots,v_i)$. The dimensions again sum to $n+1$. A unit vector in the intersection has stretch at least $\sigma_i$, so the maximum over $S$ is at least $\sigma_i$. This is a lower bound for every candidate. Choosing $S=T_i$ makes every unit stretch at most $\sigma_i$, with equality at $v_i$. The lower bound is attained.

The two forms describe the same number through different optimisation problems. Merely interchanging “max” and “min” while keeping the same dimension would not give the theorem.

### Endpoints and the smallest-value convention

For $i=1$, the max–min subspaces are lines. All nonzero vectors on a given line have the same stretch quotient, so the outer maximum becomes $\sigma_1=\max_{\|x\|=1}\|Ax\|$.

For $i=n$, the only $n$-dimensional subspace is the entire input space, so $\sigma_n=\min_{\|x\|=1}\|Ax\|$. For an intermediate $i$, a single unrestricted vector extremum cannot isolate $\sigma_i$; the subspace dimension is essential.

If values are instead numbered **smallest first**, the $j$th smallest is $\sigma_{n-j+1}$: use dimension $n-j+1$ in the max–min form and dimension $j$ in the min–max form. State the ordering before substituting an index.

For a wide matrix, the full input-space formulation uses the $n$ square roots of the eigenvalues of $A^*A$, including the additional zeros. Its first $\min(m,n)$ entries are the usual singular values. Alternatively, apply the tall theorem to $A^*$ when convenient.

## 5. Symmetric and Hermitian eigenvalues

For Hermitian $H=H^*$, the **Rayleigh quotient**

$$
\rho_H(x)=\frac{x^*Hx}{x^*x}
$$

is real. For real symmetric $H$, this is $x^THx/(x^Tx)$. Let $\lambda_1\ge\cdots\ge\lambda_n$ be its eigenvalues. Courant–Fischer gives

$$
\lambda_i(H)=\max_{\dim S=i}\min_{0\ne x\in S}\rho_H(x)
=\min_{\dim S=n-i+1}\max_{0\ne x\in S}\rho_H(x).
$$

Here we optimise a **signed** quadratic quotient, not a norm. Negative eigenvalues remain negative; taking absolute values would change the problem.

For an orthonormal eigenbasis $q_1,\ldots,q_n$, write $x=\sum_j c_jq_j$. On the unit sphere,

$$
\rho_H(x)=\sum_j\lambda_j|c_j|^2,\qquad\sum_j|c_j|^2=1.
$$

This weighted-average formula proves both characterisations. An $i$-dimensional $S$ intersects the span of $q_i,\ldots,q_n$, producing a quotient at most $\lambda_i$. The leading $i$-dimensional eigenspace makes all quotients at least $\lambda_i$ and attains equality. For the dual form, intersect with the leading $i$ eigenvectors and then choose the trailing $n-i+1$ eigenspace. This proves both inequalities in each formula, including when eigenvalues are negative or repeated.

For $H=\operatorname{diag}(4,-1,-3)$, the optimal worst Rayleigh quotient on a plane is $-1$, attained on $\operatorname{span}(e_1,e_2)$. Its singular values, by contrast, are $4,3,1$. This example separates the two theorems' quotients and orderings.

The real and complex versions use the same dimension argument. All unit-sphere extrema exist in a fixed finite-dimensional subspace, and the displayed eigenvector subspaces explicitly attain the outer extrema.
