## The question: can we afford this calculation?

A mathematically correct method can be useless if its computation takes too long. Numerical linear algebra therefore studies computational cost alongside accuracy. This lesson develops operation counts and shows how to use them when choosing an order of computation.

### Before you begin

You need matrix multiplication, matrix dimensions, and the distinction between sparse and dense matrices. Norms are not needed for counting operations, but they explain how we later assess the accuracy of the answers obtained.

By the end, you should be able to derive the leading flop counts for matrix–vector and matrix–matrix multiplication, preserve their leading constants, and compare equivalent calculations by cost.

## 1. What is a flop?

A **floating-point operation**, abbreviated flop, is an arithmetic operation such as addition, subtraction, multiplication, or division. Here, each scalar arithmetic operation costs one flop. A multiplication followed by an addition counts as two mathematical operations, even if hardware can execute a fused instruction.

This model intentionally omits many practical effects: memory movement, parallelism, cache behaviour, implementation overhead, and different hardware speeds. Flop counts give a useful mathematical comparison, not an exact prediction of elapsed time. They also do not measure the numerical error of the result.

## 2. Start with a dot product

For two vectors of length $n$,

$$a^Tb=\sum_{j=1}^n a_jb_j.$$

Forming the $n$ products uses $n$ multiplications. Summing those products uses $n-1$ additions if the first product starts the running total. The total is

$$n+(n-1)=2n-1\text{ flops}.$$

An implementation that starts from zero and adds every product may count one extra addition. At leading order both cost $2n$ flops. We use the $2n-1$ convention for exact exercise counts.

Complex arithmetic has a different real-operation cost. The formulas here use a real scalar-operation convention; do not silently interpret one complex multiplication as one real flop when benchmarking.

## 3. Matrix–vector multiplication

Let $A\in\mathbb R^{m\times n}$ and $x\in\mathbb R^n$. Each of the $m$ output entries of $Ax$ is a length-$n$ dot product. Therefore the direct dense calculation costs

$$m(2n-1)=2mn-m\text{ flops},$$

with leading term

$$\boxed{2mn\text{ flops}.}$$

For an $n\times n$ matrix this is approximately $2n^2$. Doubling both dimensions multiplies this leading cost by four. Doubling only the number of rows multiplies it by two.

### Worked example

A $100\times50$ matrix times a length-$50$ vector produces $100$ outputs. There are $5{,}000$ multiplications and $4{,}900$ additions: $9{,}900$ flops in total. The leading estimate is $10{,}000$. The difference is the lower-order term $m=100$.

## 4. Matrix–matrix multiplication

For $A\in\mathbb R^{m\times n}$ and $B\in\mathbb R^{n\times k}$, the product $C=AB$ has $mk$ entries. Every entry is a length-$n$ dot product:

$$C_{ij}=\sum_{\ell=1}^nA_{i\ell}B_{\ell j}.$$

Hence classical dense multiplication costs

$$mk(2n-1)=2mnk-mk\text{ flops},$$

or, retaining the leading term,

$$\boxed{2mnk\text{ flops}.}$$

For two $n\times n$ matrices this becomes $2n^3$ at leading order. Doubling $n$ multiplies this leading cost by eight. This explains why modest-looking increases in matrix dimension can be expensive.

These formulas describe the standard dot-product algorithm. They are not lower bounds on every possible matrix multiplication algorithm. Fast multiplication methods exist, but the counts here use the classical algorithm.

### Guided example

Take $A\in\mathbb R^{20\times30}$ and $B\in\mathbb R^{30\times10}$. The result has $200$ entries and each entry needs $59$ operations. The exact count is $11{,}800$; the leading count is $12{,}000$. If you obtained a different value, check that the inner dimension is $30$, not $20$ or $10$.

## 5. Keep leading constants, drop lower-order terms carefully

A cost such as $n^3+10n^2$ can be approximated by its leading term $n^3$. This is an **asymptotic approximation**, not a literal equality for finite $n$.

The leading constant still matters. Methods costing $n^3$ and $2n^3$ are both $O(n^3)$, but the latter has twice the leading arithmetic cost. Numerical linear algebra commonly reports the leading expression, including its constant, to preserve that distinction.

At small sizes the omitted terms can matter substantially. For $n=10$, $n^3+10n^2=2{,}000$, twice its leading term. At $n=1{,}000$, the lower-order contribution is only one per cent of the leading term. Always distinguish an exact count, a leading estimate, and an asymptotic order statement.

## 6. Equivalent algebra, different computational cost

For dense square $A,B$ and a vector $x$, consider computing $(AB)x$.

**Form the matrix first:** compute $AB$ in roughly $2n^3$ flops, then multiply by $x$ in roughly $2n^2$. Total: $2n^3+2n^2$.

**Apply the matrices in sequence:** compute $y=Bx$, then $Ay$. Total: $4n^2$ flops.

Associativity says the exact mathematical results are equal, but the work and storage differ greatly. At $n=1{,}000$, these leading estimates are $2.002\times10^9$ versus $4\times10^6$ flops, a ratio of $500.5$. In floating-point arithmetic, reassociation can also change rounding errors; lower cost alone is not a complete accuracy argument.

If the same product will be applied repeatedly, the tradeoff may change. Ask what intermediate results are needed, how often they will be reused, and whether they fit in memory.

### Structure changes the count

The $2mn$ estimate assumes a dense matrix. A sparse matrix–vector product can skip zeros and has work proportional to $\operatorname{nnz}(A)$ when stored appropriately. A tridiagonal $n\times n$ matrix has at most $3n-2$ nonzero entries, so its matrix–vector product needs only work proportional to $n$, not $n^2$.

For a tridiagonal matrix with all three diagonals populated and $n\ge2$, there are $3n-2$ multiplications. Summing within each nonempty row needs $(3n-2)-n=2n-2$ additions. The total is $5n-4$. This calculation shows how structure and sparsity reduce computational cost.

## Chapter synthesis

You can now ask four useful questions about a computation:

1. **What is the problem?** A linear solve, an eigenproblem, or an approximation?
2. **What structure is available?** Symmetry, orthogonality, sparsity, or a small subspace?
3. **How will size and error be measured?** Which vector or matrix norm is appropriate?
4. **What will the proposed calculation cost?** Track dimensions, leading constants, and exploitable structure.

Chapter 2 develops the SVD, giving a common language for rank, stretching, subspaces, and optimal low-rank approximation. The singular-value facts introduced in this chapter will then become parts of one coherent factorisation.
