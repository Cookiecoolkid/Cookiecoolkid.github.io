---
title: Numerical-Method-Review
date: 2024-06-16 09:52:39
tags: 
- Numerical Method
categories:
- Numerical Method
mathjax: true
---

这是一篇计算方法期末复习的小笔记. 课程资料取自
> 计算方法 Numerical method (Spring 2024) By 刘景铖
<!--more-->

# 函数求根
## 不动点迭代法
从 $x = x_0$ 出发，迭代公式为 $x_{n+1} = g(x_n)$

> Theorem 1.1: 若 $g(x)$ 在 $[a, b]$ 上连续可导，$r = g(r)$, 
> 且 $S = |g'(x)| < 1$，则 $g(x)$ 在 $[a, b]$ 上的不动点迭代 $x_n \to r$.

## 牛顿法
迭代公式为 $x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}$

具有二次收敛性：
$$
\lim_{n \to \infty} \frac{|x_{n+1} - r|}{|x_n - r|^2} 
= \left| \frac{f''(r)}{2f'(r)} \right| < \infty
$$

# 插值
## 拉格朗日插值

任意给定 $n+1$ 个点$(x_1,y_1),\cdots,(x_n,y_n)$，
过这 $n + 1$ 个点的 $n$ 次多项式 $P_n(x)$ 有且仅有一个.

存在性证明：

令$L_k(x) = A(x - x_1)\cdots (x-x_{k-1})(x-x_{k+1})\cdots (x-x_n)$，
其中 $A = \frac{1}{(x_k - x_1)\cdots (x_k - x_{k-1})(x_k - x_{k+1})\cdots (x_k - x_n)}$.

则 $P_n(x) = \sum_{k=0}^{n} y_k L_k(x)$.

唯一性用反证法证明.

假设存在另一个 $n$ 次多项式 $Q_n(x)$ 也满足过这 $n + 1$ 个点，
则 $P_n(x) - Q_n(x)$ 也是一个 $n$ 次多项式，且过这 $n + 1$ 个点.

由于 $P_n(x) - Q_n(x)$ 有 $n + 1$ 个零点，所以 $P_n(x) - Q_n(x) = 0$.
然而 $P_n(x) - Q_n(x)$ 是一个 $n$ 次多项式，至多有 $n$ 个零点，矛盾.

## 多项式插值与自纠错码

发送 $n$ 个信息位，且至多发生 $k$ 位错误，
那么如果需要检测传输过程是否出错，需要发送 $n + k$ 个信息位.
同时，若是需要纠错，那么需要发送 $n + 2k$ 个信息位.

## 切比雪夫插值

假设函数定义在 $[-1, 1]$ 上，要选取$x_1,\cdots,x_n$使得：
$$
\max_{x \in [-1, 1]} |(x-x_1)(x-x_2)\cdots(x-x_n)| 
$$

> Theorem 2.1: 令 $x_k = \cos\left(\frac{2k-1}{2n}\pi\right)$，则 $T_n(x) = \cos(n\arccos(x))$. 此时上式取到最小值 $1 / 2^{n-1}$.

特别的：$T_0(x) = 1, T_1(x) = x, T_2(x) = 2x^2 - 1$.
其迭代公式为 $T_{n+1}(x) = 2xT_n(x) - T_{n-1}(x)$.

# 范数
## 向量范数
对于向量 $x \in \mathbb{R}^n$：
- $L^1$ 范数：
$$||x||_1 = \sum_{i=1}^{n} |x_i|$$.
- $L^2$ 范数：
$$||x||_2 = \sqrt{\sum_{i=1}^{n} x_i^2}$$.
- $L^\infty$ 范数：
$$||x||_\infty = \max_{1 \leq i \leq n} |x_i|$$.
- 一般情况，$L^p$ 范数：
$$||x||_p = \left(\sum_{i=1}^{n} |x_i|^p\right)^{1/p}$$.

## 矩阵范数
对于矩阵 $A \in \mathbb{R}^{m \times n}$：
- Frobenius 范数：
$$||A||_F = \sqrt{\sum_{i=1}^{n} \sum_{j=1}^{m} a_{ij}^2}$$.
- 算子范数：
$$||A||_p = \max_{x \neq 0} \frac{||Ax||_p}{||x||_p}$$.
- $p\rightarrow q$ 范数：
$$||A||_{p \rightarrow q} = \max_{x \neq 0} \frac{||Ax||_q}{||x||_p}$$.

对于算子范数，有：
- $$||A||_1 = \max_{1 \leq j \leq n} \sum_{i=1}^{m} |a_{ij}|$$，即最大列和.
- $$||A||_2 = \max_{||x||_2 \leq 1}\sqrt{x^TA^TAx} = \sqrt{\lambda_{\max}(A^TA)}$$.
- $$||A||_\infty = \max_{1 \leq i \leq m} \sum_{j=1}^{n} |a_{ij}|$$，即最大行和.



### 矩阵的条件数
条件数是衡量矩阵 $A$ 的数值稳定性的一个重要指标.
对于矩阵 $A \in \mathbb{R}^{m \times n}$，$\vec{e}$ 为误差向量，其条件数定义为：
$$
\kappa(A) = \max_{e,b \neq 0} \frac{||A^{-1}e|| / ||A^{-1}b||}{||e||/||b||}
= ||A|| \cdot ||A^{-1}||
$$

特别的对于 2-条件数，有：
$$
\kappa_2(A) = ||A||_2 ||A^{-1}||_2 = \sqrt\frac{\lambda_{\max}(A^TA)}{\lambda_{\min}(A^TA)}
$$

# 解线性方程组
## 高斯消元法
即 $LU$ 分解，将矩阵 $A$ 分解为 $L$ 为下三角矩阵，$U$ 为上三角矩阵.

## Jacobi 迭代法
将矩阵 $A_{n\times n}$ 分解为 $D, L, U$ 三部分，其中 $D$ 为对角矩阵，$L$ 为下三角矩阵，$U$ 为上三角矩阵.
迭代公式为 $x^{(k+1)} = D^{-1}(b -(L+U)x^{(k)})$.

> Theorem 3.1: 若 $A$ 为严格对角占优矩阵，则 Jacobi 迭代法收敛.
> 严格对角占优矩阵指的是对于任意 $i$，有 $|a_{ii}| > \sum_{j \neq i} |a_{ij}|$.

## Gauss-Seidel 迭代法
迭代公式为 $x^{(k+1)} = D^{-1}(b - Ux_k - Lx_{k+1})$.

## 谱半径
考虑迭代方程为 
$$
x^{(k+1)} = Ax^{(k)} + b
$$

对于迭代矩阵 $A$，其谱半径定义为 $\rho(A) = \max |\lambda_i|$.
> Theorem 3.2: 谱半径 $\rho(A) < 1$ 当且仅当 $\lim_{k\rightarrow \infty}A^{k} = 0$

- Jacobi 迭代法的迭代矩阵为 $A = D^{-1}(L+U)$
- Gauss-Seidel 迭代法的迭代矩阵为 $A = (L+D)^{-1}U$$

# 最小二乘法

希望使得求解方程的误差最小，即
$$
\bar{x} = \min_{x} \|Ax - b\|_2
$$

即等价于法线方程的解：
$$
A^TA\bar{x} = A^Tb
$$

要想求解 $\bar{x}$，不会直接计算 $A^TA$ 的逆，而是使用 QR 分解.
即 $A = QR$，其中 $Q$ 为正交矩阵，$R$ 为上三角矩阵.

此时 $Q^TQ = I$，所以
$$
A^TA\bar{x} = A^Tb \Rightarrow R^TQ^TQR\bar{x} = R^TQ^Tb \Rightarrow \bar{x} = R^{-1}Q^Tb
$$

这需要用到 Gram-Schmidt 正交化方法来先求 $Q$:
假设 $A_1,A_2,\cdots,A_n$ 为矩阵 $A$ 的列向量,则有：
$$
b_1 = A_1
$$
$$
b_2 = A_2 - \frac{A_2^Tb_1}{b_1^Tb_1}b_1
$$
$$
b_3 = A_3 - \frac{A_3^Tb_1}{b_1^Tb_1}b_1 - \frac{A_3^Tb_2}{b_2^Tb_2}b_2
$$
$$ ...... $$

再通过单位化得到 $Q$：
$$
q_1 = \frac{b_1}{\|b_1\|}, q_2 = \frac{b_2}{\|b_2\|}, \cdots
$$
矩阵 $Q$ 即为：
$$
Q = \begin{bmatrix} q_1 & q_2 & \cdots & q_n \end{bmatrix}
$$

最后再来求解 $R$，对于正交矩阵 $Q$, 有 $Q^TQ = I$(即 $Q^T = Q^{-1}$)，因此有：
$$
R = Q^TA
$$
这是容易计算的，因此得到了 $Q$ 和 $R$，进而可以求解 $\bar{x}$.

## 正交系统里的最小二乘法：离散三角级数
给定数据 $(x_1, y_1), (x_2, y_2), \cdots, (x_n, y_n)$，希望找到一个三角级数：
$$
y_j \approx \frac{a_0}{2} + a_n \cos nx_j + \sum_{k=1}^{n-1} (a_k\cos(kx) + b_k\sin(kx))
$$
同样使用最小二乘法建模可以得到：
$$
a_k = \frac{1}{m} \sum_{j=0}^{2m-1} y_j \cos(kx_j)\\
b_k = \frac{1}{m} \sum_{j=0}^{2m-1} y_j \sin(kx_j)
$$

# 傅里叶变换

给定最多为 $n$ 次的多项式 $p(x),q(x)$ 的系数，目标是求出其乘积 $r(x) = p(x)q(x)$ 的系数.

## 单位根
$n$ 次单位根 $\omega_n = e^{2\pi i/n}$.
- 1 次单位根：$1$
- 2 次单位根：$+1,-1$
- 4 次单位根：$+1,-1,+i,-i$
- 8 次单位根：$+1,-1,+i,-i, \sqrt{i}, -\sqrt{i}, \sqrt{-i}, -\sqrt{-i}$

从上往下是开方的过程，从下往上是平方的过程.

## 离散傅里叶变换
输入多项式系数 $a_0,a_1,\cdots,a_{n-1}$，选定$x_0,x_1,\cdots,x_n$为$m + 1$次单位根.
输出多项式在 $n$ 个单位根上的取值$p(x_0),p(x_1),\cdots,p(x_n)$.

逆变换即为用插值从 $p(x_0),p(x_1),\cdots,p(x_n)$ 求出 $a_0,a_1,\cdots,a_{n-1}$.
复杂度为 $O(n^2)$.

## 快速傅里叶变换
运用分治的思想，将 $n$ 个单位根分为两部分，分别计算其值，再合并，复杂度为 $O(n\log n)$.

<!---给出伪代码--->
给定多项式$A(x)$:
```python
FFT(A, w):
    if w == 1: return A(1)
    express A(x) in the form of A_even(x^2) + xA_odd(x^2)
    A_even = FFT(A_even, w^2)
    A_odd = FFT(A_odd, w^2)
    for j in range(n):
        A(j) = A_even(j) + w^j * A_odd(j)
    return A(w^0), A(w^1), ..., A(w^n)
```

其逆变换为：
```python
IFFT(A, w):
    if w == 1: return A(1)
    express A(x) in the form of A_even(x^2) + xA_odd(x^2)
    A_even = IFFT(A_even, w^2)
    A_odd = IFFT(A_odd, w^2)
    for j in range(n):
        A(j) = A_even(j) + w^(-j) * A_odd(j)
    return 1/(n+1) * (A(w^0), A(w^1), ..., A(w^n))
```

# 特征值与特征向量
## 特征值的 min-max 刻画 (Courant-Fischer 定理)
对于实对称矩阵 $A$，其特征值 $\lambda_1 \geq \lambda_2 \geq \cdots \geq \lambda_n$.

- 最大特征值：$\lambda_1 = \max_{x\neq 0} \frac{x^TAx}{x^Tx} = \max_{\|x\|_2 = 1} x^TAx$.
- 最小特征值：$\lambda_n = \min_{\|x\|_2 = 1} x^TAx$.
- 第 $k$ 大特征值：$\lambda_k = \max_{\text{dim}(V) = k} \min_{\|x\|_2 = 1} x^TAx$.

对于最大特征值的 min-max 刻画证明：

因为 $A$ 为实对称矩阵，所以可以设 $A$ 的两两正交的特征向量为 $v_1,v_2,\cdots,v_n$，对应的特征值为 $\lambda_1,\lambda_2,\cdots,\lambda_n$，那么：
$$
\begin{aligned}
    x^TAx &= (\alpha_1v_1 + \alpha_2v_2 + \cdots + \alpha_nv_n)^TA(\alpha_1v_1 + \alpha_2v_2 + \cdots + \alpha_nv_n) \\\\
    &= \lambda_1\alpha_1^2 + \lambda_2\alpha_2^2 + \cdots + \lambda_n\alpha_n^2\\\\
    &\leq \lambda_1(\alpha_1^2 + \alpha_2^2 + \cdots + \alpha_n^2)\\\\
\end{aligned}
$$
并且有：
$$
\begin{aligned}
    x^Tx &= (\alpha_1v_1 + \alpha_2v_2 + \cdots + \alpha_nv_n)^T(\alpha_1v_1 + \alpha_2v_2 + \cdots + \alpha_nv_n) \\\\
    &= \alpha_1^2 + \alpha_2^2 + \cdots + \alpha_n^2\\\\
\end{aligned}
$$
因此有：
$$
\frac{x^TAx}{x^Tx} \leq \lambda_1
$$

# 正定矩阵

- 对于矩阵 $A$，若对于任意非零向量 $x$，有 $x^TAx > 0$，则称 $A$ 为正定矩阵.
- 若 $x^TAx \geq 0$，则称 $A$ 为半正定矩阵.

> Theorem: 实数对称矩阵 $A$ 为正定矩阵当且仅当其所有特征值均为正.

- 迹：矩阵 $A$ 的迹定义为 $\text{tr}(A) = \sum_{i=1}^{n} a_{ii} = \sum_{i=1}^{n} \lambda_i$.
- 行列式：矩阵 $A$ 的行列式定义为 $\det(A) = \prod_{i=1}^{n} \lambda_i$.
- Frobenius 范数：矩阵 $A$ 的 Frobenius 范数定义为 $\|A\|_F^2 = \sum_{i=1}^{n} \sum_{j=1}^{m} a_{ij}^2 = \sum_{i=1}^{n} \lambda_i^2 = \text{tr}(A^TA)$.

在 $A$ 是正定矩阵的情况下，有：
$$
\|A\|_2 = \sqrt{\lambda_{\max}(A^TA)} = \sqrt{\lambda_{\max}(A)^2} = \lambda_{\max}(A)
$$
条件数有：
$$
\kappa_2(A) = \|A\|_2 \|A^{-1}\|_2 = \frac{\lambda_{\max}(A)}{\lambda_{\min}(A)}
$$

# 计算特征值与特征向量：幂迭代法

对于矩阵 $A$，其特征值 $\lambda_1 \geq \lambda_2 \geq \cdots \geq \lambda_n$，对应的特征向量为 $v_1,v_2,\cdots,v_n$，且这些特征向量线性无关.

因此:
$$
x = \sum_{i=1}^{n} \alpha_i v_i\\
Ax = \sum_{i=1}^{n} \alpha_i Av_i = \sum_{i=1}^{n} \alpha_i \lambda_i v_i\\
A^kx = \sum_{i=1}^{n} \alpha_i \lambda_i^k v_i = \lambda_1^k \left(\alpha_1 v_1 + \sum_{i=2}^{n} \alpha_i \left(\frac{\lambda_i}{\lambda_1}\right)^k v_i\right)
$$

随着 $k$ 的增大，$\left(\frac{\lambda_i}{\lambda_1}\right)^k$ 会趋近于 $0$，因此 $A^kx$ 会趋近于 $\lambda_1^k \alpha_1 v_1$.

最终得到一个近似的特征向量 $v_1$，要求解其近似的特征值 $\lambda_1$，
由最小二乘法要最小化$\|Ax - \lambda x\|_2^2$，即法线方程：
$$
\lambda_1 = \frac{x^TAx}{x^Tx}
$$

但此时仅近似得到了最大的特征值.


## 求解更多的特征值
### 相似矩阵
若 $A = T^{-1}BT$，则 $A$ 与 $B$ 相似，它们有相同的特征值.

并且 QR 分解可以将矩阵 $A$ 分解为 $A = QR$，其中 $Q$ 为正交矩阵，$R$ 为上三角矩阵.
其给出了一个相似矩阵 $B = RQ$，在于下面的事实：
$$
Q^{-1}AQ = RQ
$$

### 奇异值分解(SVD)
对于$m\times n$矩阵 $A$，其奇异值分解为 $A = U_{m\times m}\Sigma_{m\times n} V^T_{n\times n}$，其中 $U,V$ 为正交矩阵，$\Sigma$ 为对角矩阵.

> Theorem: $A^TA$ 与 $AA^T$ 有相同的非零特征值，且非零特征值为 $A$ 的奇异值的平方.

将$A^TA$与$AA^T$的特征值记作$\lambda_1^2 \geq \lambda_2^2 \geq \cdots \geq \lambda_n^2$，记 $A^TA$ 的正规正交的单位特征向量为 $v_1,v_2,\cdots,v_n$，$AA^T$ 的正规正交的单位特征向量为 $u_1,u_2,\cdots,u_n$，则有：
$$
A^TA v_i = \lambda_i v_i
$$
$$
AA^T u_i = \lambda_i u_i
$$

那么将 $\{u_i\}, \{v_i\}$ 作为列向量分别组合为 $U,V$，且有：
$$
U^TU = I_m 
$$
$$
V^TV = I_n
$$

> Lemma: 存在常数 $c_i,d_i$ 使得：
> $$
> Av_i = d_i u_i
> $$
> $$
> A^Tu_i = c_i v_i
> $$

注意到： $u_i^TAA^Tu_i$ 有两种写法：
$$
u_i^TAA^Tu_i = u_i^T\lambda_i u_i = \lambda_i
$$

$$
u_i^TAA^Tu_i = (A^Tu_i)^TA^Tu_i = c_i^2
$$

因此有：
$$
\lambda_i = c_i^2
$$

同理有：
$$
\lambda_i = d_i^2
$$
由于(假设 $m>n$)：
$$
A^Tu_i = \sqrt{\lambda_i} v_i\\
Av_i = \sqrt{\lambda_i} u_i
$$
因此可以写出$：
$$
AV = U \text{diag}(\sqrt{\lambda_1},\sqrt{\lambda_2},\cdots,\sqrt{\lambda_n})\\
A^TU = V \text{diag}(\sqrt{\lambda_1},\sqrt{\lambda_2},\cdots,\sqrt{\lambda_n})
$$
即：
$$
A = U \text{diag}(\sqrt{\lambda_1},\sqrt{\lambda_2},\cdots,\sqrt{\lambda_n})V^T\\
A = U \Sigma V^T
$$

### SVD 与 Rayleigh Quotient Iteration
对于矩阵 $A$ 范数:
$$
\|A\|_2 = \sqrt{\lambda_{\max}(A^TA)} = \sigma_{\max}(A)\\
$$

> 回顾： 特别地，正定矩阵 $A$ 的二范数为 $\|A\|_2 = \lambda_{\max}(A)$.

对于矩阵 $A$ 的条件数:
$$
\kappa_2(A) = \frac{\sigma_{\max}(A)}{\sigma_{\min}(A)}
$$

> 回顾： 特别地，正定矩阵 $A$ 的条件数为 $\kappa_2(A) = \frac{\lambda_{\max}(A)}{\lambda_{\min}(A)}$.


# Richardson 迭代法
对于线性方程组 $Ax = b$，迭代公式为：
$$
x_0 = 0 \\
x_{(k+1)} = x_{(k)} - \alpha (Ax_{(k)} - b)
$$

# Hessian 矩阵 & 凸函数
## Hessian 矩阵
对于函数 $f(x)$，其 Hessian 矩阵定义为：
$$
H = \begin{bmatrix}
    \frac{\partial^2 f}{\partial x_1^2} & \frac{\partial^2 f}{\partial x_1 \partial x_2} & \cdots & \frac{\partial^2 f}{\partial x_1 \partial x_n}\\
    \frac{\partial^2 f}{\partial x_2 \partial x_1} & \frac{\partial^2 f}{\partial x_2^2} & \cdots & \frac{\partial^2 f}{\partial x_2 \partial x_n}\\
    \vdots & \vdots & \ddots & \vdots\\
    \frac{\partial^2 f}{\partial x_n \partial x_1} & \frac{\partial^2 f}{\partial x_n \partial x_2} & \cdots & \frac{\partial^2 f}{\partial x_n^2}
\end{bmatrix}
$$
- 对于凸函数，其 Hessian 矩阵为半正定矩阵. 即对于任意 $x$，有 $x^THx \geq 0$.
对于一个点$x_0$, 
- 若 $H(x_0)$ 为正定矩阵，则 $x_0$ 为局部极小值点.
- 若 $H(x_0)$ 为负定矩阵，则 $x_0$ 为局部极大值点.

# 共轭梯度法
给定正定矩阵 $A$，可以定义内积为：
$$
\langle x, y \rangle_A = x^TAy
$$
- 线性：$\langle x, y_1 + y_2 \rangle_A = \langle x, y_1 \rangle_A + \langle x, y_2 \rangle_A$.
- 对称：$\langle x, y \rangle_A = \langle y, x \rangle_A$.
- 正定：$\langle x, x \rangle_A > 0$.

称 $x_1,x_2,\cdots,x_n$ 为 $A$ 共轭的向量，若对于任意 $i \neq j$，有：
$$
\langle x_i, x_j \rangle_A = 0
$$

其定义的范数为：
$$
\|x\|_A = \sqrt{\langle x, x \rangle_A}
$$

> Theorem: 对于正定矩阵 $A$，其共轭向量一定线性无关.

共轭梯度法的目标是去近似 $p(A)$，满足$p(A) = A^{-1}$
那么要解 $Ax = b$，即找出：
$$
x = A^{-1}b = p(A)b \in \text{span}\{b, Ab, A^2b, \cdots, A^{n-1}b\}
$$

那么共轭梯度法的迭代过程为：
$$
\begin{aligned}
    &x_0 = 0\\\\
    &r_0 = b - Ax_0 = b\\\\
    &d_0 = r_0\\\\
    &\text{for } k = 0,1,2,\cdots\\\\
    &\alpha_k = \frac{r_k^Tr_k}{d_k^TAd_k}\\\\
    &x_{k+1} = x_k + \alpha_k d_k\\\\
    &r_{k+1} = r_k - \alpha_k Ad_k\\\\
    &\beta_k = \frac{r_{k+1}^Tr_{k+1}}{r_k^Tr_k}\\\\
    &d_{k+1} = r_{k+1} + \beta_k d_k
\end{aligned}
$$

# 随机游走
## 马尔科夫链

记 $X_t$ 为时间 $t$ 的状态，$P_{ij}$ 为从状态 $i$ 转移到状态 $j$ 的概率，那么有：
$$
P(X_{t+1} = j | X_t = i) = P_{ij}
$$

记 $p_t(i)$ 为时间 $t$ 状态为 $i$ 的概率，那么有：
$$
p_{t+1}(j) = \sum_{i} p_t(i)P_{ij}
$$

转移矩阵 $W = AD^{-1}$，其中 $A$ 为邻接矩阵，$D$ 为度数矩阵.
有：
$$
p_{t} = W^tp_0
$$

注意是可能不是一个对称的矩阵，但 $W$ 对应一个相似且对称的矩阵$\mathcal{A}$：
$$
\mathcal{A} = D^{-1/2}WD^{1/2}
$$

- 对于有限的马尔可夫链，若其对应的有向图是强连通的，则称其为不可约的.
- 如果对于任意状态 $i$，所有 $t$ 时刻返回 状态 $i$ 的最大公约数为 $1$，则称其为非周期的.

> Theorem: 若马尔可夫链是不可约的，且非周期的话，则一定存在足够大的常数 $T$，使得对于任意 $t > T$，有：
> $$
> (P^t)_{ij} > 0, \forall i,j
> $$

### 稳态分布
若马尔可夫链是不可约的，且非周期的，那么存在唯一的稳态分布 $\pi$，使得
$$
\pi = \pi P
$$
- 随着 $t$ 的增大，从任意初始状态出发，最终都会收敛到 $\pi$.
- $\pi(i) = \frac{1}{h_i}$，其中 $h_i$ 为状态 $i$ 的期望回归时间.


> Theorem: 对于任意有限的，连通的无向图(非二分图)，其稳态分布 $\vec{\pi}= \frac{\vec{d}}{2m}$，其中 $\vec{d}$ 为度数向量，$m$ 为边数.

### 回归时间
对于状态 $i$，定义其回归时间为：
$$
H_i = \min\{t > 0 | X_t = i, X_0 = i\}
$$
$$
h_i = E[H_i]
$$

### 混合时间
对于马尔可夫链，其混合时间定义为：
$$
\tau(\epsilon) = \min\{t > 0 | \max_{i} \|p_t(i) - \pi(i)\| < \epsilon\}
$$

特别的对于 $\text{d - regular}$ 的马尔可夫链，其混合时间:
$$
\tau(\epsilon) \leq \frac{1}{\lambda}\log (\frac{n}{\epsilon})
$$
其中，$\lambda = \min\{1-\alpha_2,1 - |\alpha_n|\}$，$\alpha_2,\alpha_n$ 分别为矩阵$W$第二大和最小的特征值.

## 惰性随机游走(Lazy Random Walk)
对于无向图 $G$，其邻接矩阵为 $A$，其度数矩阵为 $D$，
那么其转移矩阵为 $P = \frac{1}{2}I + \frac{1}{2}AD^{-1}$.
即：
$$
p_t = (\frac{1}{2}I + \frac{1}{2}AD^{-1})^t p_0 \to \vec{\pi} = \frac{\vec{d}}{2m}
$$

# 谱图论(Spectral Graph Theory)
## 邻接矩阵
对于无向图 $G$，其邻接矩阵 $A$ 定义为：
$$
A_{ij} = \begin{cases}
    1 & \text{if } i \text{ 与 } j \text{ 相邻}\\
    0 & \text{otherwise}
\end{cases}
$$

> 图的邻接矩阵 $A$ 的最大特征值 $\alpha_1$ 满足：
> $$
> \text{d}_{\text{avg}} \leq \alpha_1 \leq \text{d}_{\max}
> $$

- 对于二分图，若 $\alpha$ 是其特征值，且重数为 $k$，则 $-\alpha$ 也是其特征值，重数为 $k$.

> Lemma: 设图 $G$ 的邻接矩阵 $A(G)$特征值为 $\alpha_1 \geq \alpha_2 \geq \cdots \geq \alpha_n$ ，若 $\forall i, \alpha_i = -\alpha_{n-i_1}$，那么图 $G$ 是二分图.

## 拉普拉斯矩阵(Laplacian Matrix)
对于无向图 $G$，其度数矩阵 $D$ 定义为：
$$
D_{ii} = \text{degree}(i)
$$
其拉普拉斯矩阵 $L$ 定义为：
$$
L = D - A
$$
- 拉普拉斯矩阵是半正定矩阵.
- 拉普拉斯矩阵的最小特征值为 $0$

> Theorem: 图 $G$ 是连通的，当且仅当其拉普拉斯矩阵特征值为 0 的重数为 1.

## Perron-Frobenius 定理
对于非负矩阵 $A$，不可约且非周期：
- 最大特征值为正，重数为 $1$.
- 对应的特征向量中，每个维度都是非零且同号的.
- $|\lambda_i| < \lambda_1, \text{for } 2\leq i\leq n$

## Cheeger 不等式
对于无向图 $G$，其拉普拉斯矩阵 $L$，其特征值为 $0 = \lambda_1 \leq \lambda_2 \leq \cdots \leq \lambda_n$，那么有：
$$
\frac{\lambda_2}{2} \leq \phi(G) \leq \sqrt{2\lambda_2}
$$
其中 $\phi(G)$ 为图 $G$ 的 Cheeger 常数.

## 电阻电路网络
给定一个无向图，每条边上有一个电阻 $r_e$.
- 基尔霍夫定律：所有进入某节点的电流的总和，等于所有离开这节点的电流的总和.
$$
\sum_{u: u\sim v \in E} i_{uv} = b_v, \forall v\in V 
$$
即内部流出的电流等于外部流入的电流.
- 欧姆定律：把节点的电势记作 $\phi_i: V\to \mathbb{R}$，那么有：
$$
\phi(u) - \phi(v) = r_{uv}i_{uv}
$$

- 两者合并有(在 $w_{uv} = 1$ 情况下)：
$$
b_v = \text{deg}_w(v) \phi(v) - \sum_{u: u\sim v \in E} \phi(u)
$$
即为
$$
\vec{b} = L\vec{\phi}  
$$

### 矩阵表示

给定电阻 $r_e$，若从节点 s 注入 $1A$ 的电流，并从节点 t 流出，通过计算：
$$
\vec{b} = L\vec{\phi}
$$
可以模拟电阻电路网络内部的电流电压.

### 拉普拉斯矩阵的伪逆

> Lemma: 若 $\vec{b} \bot \vec{1}$，则存在向量 $\vec{\phi}$ 使得 $L\vec{\phi} = \vec{b}$.

证明：假设 $\vec{\phi} = \sum_{i=1}^{n} \alpha_i \vec{v}_i$，其中 $\vec{v_1} = \vec{1}$，那么由于拉普拉斯矩阵的 $\lambda_1 = 0$，因此有：
$$
L\vec{\phi} = \sum_{i=2}^{n} \alpha_i \lambda_i \vec{v}_i
$$
即 $\vec{b} \bot \vec{1}$.

因此对于拉普拉斯矩阵 $L$，其伪逆为：
$$
L^+ = \sum_{i=2}^{n} \frac{1}{\lambda_i} \vec{v}_i\vec{v}_i^T
$$

### 等效电阻
对于电阻电路网络，若两个节点 $s,t$ 之间的等效电阻为 $R_{st}$，那么有：
$$
R_{st} = \phi (s) - \phi(t)
$$
其中 $\phi$满足 $L\phi = \vec{b}$，且 $\vec{b}$ 为 $s$ 注入 $1A$ 电流后，$t$ 流出的电流.

> Lemma: 等效电阻 $R_{st}$ 为拉普拉斯矩阵 $L$ 的伪逆 $L^+$ 的第 $s$ 行第 $t$ 列元素.
> 即 $R_{st} = b^T_{st}L^+b_{st}$. 向量 $b_{st}(s) = 1, b_{st}(t) = -1$，其余为 $0$.


### 电势能
对于电阻电路网络，其电势能为：
$$
\varepsilon(\vec{l}) = \sum_{e\in E} r_e i_e^2
$$
> Theorem: 电势能 $\varepsilon(\vec{l}) = R_{st}$，其中 $R_{st}$ 为节点 $s,t$ 之间的等效电阻.

#### Thompson Principle
单位电流最小化所有能量.即：
$$
R_{st} \leq \varepsilon(\vec{g})
$$
其中，$\vec{g}$ 为任意$s-t$电流.

### 单调性
- 电势能 $\varepsilon(\vec{l})$ 随着电阻增大而增大：
即若$\vec{r'} \geq \vec{r}$，则:
$$
R_{r'}(s,t) \geq R_r(s,t)
$$

### 电阻电路的三角不等式
对于电阻电路网络，其等效电阻满足三角不等式：
$$
R_{ac} \leq R_{ab} + R_{bc}
$$

## 随机游走的 Commute Time & Hitting Time
返程时间(Commute Time)：从节点 $i$ 到节点 $j$ 再返回节点 $i$ 所需的时间:
$$
C_{uv} = h_{uv} + h_{vu}
$$

> Theorem: 对于任意节点 $s,t$，有：
> $$
> C_{st} = 2m R_{st}
> $$
> 其中 $m$ 为边数.

Hitting Time：从节点 $i$ 到节点 $j$ 的时间:
$$
h_{ut} = 1 + \frac{1}{d_u} \sum_{v\sim u \in E} h_{vt}
$$

即对于$h_{*,t}$这一系列向量：
$$
\begin{pmatrix}
    D - A
\end{pmatrix}
\begin{pmatrix}
    h_{u,t} \\
    h_{t,t}
\end{pmatrix}
= \begin{pmatrix}
    d_{u} \\
    d_{t} - 2m
\end{pmatrix}
$$

对于$h_{s,*}$这一系列向量：
$$
\begin{pmatrix}
    D - A
\end{pmatrix}
\begin{pmatrix}
    h_{s,s} \\
    h_{u,s} \\
    h_{t,s}
\end{pmatrix}
= \begin{pmatrix}
    d_{s} - 2m\\
    d_{u}\\
    d_{t}
\end{pmatrix}
$$

# 线性规划(Linear Programming)
线性规划标准型：
$$
\text{maximize } \sum_{j=1}^{n} c_jx_j
$$
$$
\text{subject to } \sum_{j=1}^{n} a_{ij}x_j \leq b_i, i = 1,2,\cdots,m
$$
$$
x_j \geq 0, j = 1,2,\cdots,n
$$

## 对偶问题
对于上述的标准型，其对偶问题为：

$$
\text{minimize } \sum_{i=1}^{m} b_iy_i
$$
$$
\text{subject to } \sum_{i=1}^{m} a_{ij}y_i \geq c_j, j = 1,2,\cdots,n
$$
$$
y_i \geq 0, i = 1,2,\cdots,m
$$

## 弱对偶性
对于标准型与对偶问题，有：
$$
\forall\text{ reasonable solution } x,y,  \sum_{j=1}^{n} c_jx_j \leq \sum_{i=1}^{m} b_iy_i
$$

## 强对偶性
对于标准型与对偶问题，若标准型有最优解 $x^{*}$, 
对偶问题有最优解 $y^*$, 那么有：
$$
\sum_{j=1}^{n} c_jx_j^* = \sum_{i=1}^{m} b_iy_i^*
$$

> Farkas Lemma: $Ax = b, x\geq 0$无解当且仅当存在 $y\geq 0$，使得 $y^TA \geq 0, y^Tb < 0$.


## 组合优化问题线性规划示例
### 二分图完美匹配

$$
\text{maximize } \sum_{e\in E} c_ex_e
$$
$$
\begin{aligned}
    \text{subject to } &\sum_{e\in E} x_e = 1, \forall v\in V\\\\
    &0\leq x_e \leq 1, \forall e\in E
\end{aligned}
$$

> 该 LP 问题的最优解一定为整数解. 否则，可以通过对"环"的调整，使得其最优解为整数解.

### 最小生成树

$$
\text{minimize } \sum_{e\in E} c_ex_e
$$
$$
\begin{aligned}
    \text{subject to } &\sum_{e\in E} x_e = |V|-1\\\\
    &\sum_{e\in E(S)} x_e \leq |S| - 1, \forall S\subset V, 2\leq |S| \leq |V|\\\\
    &0\leq x_e \leq 1, \forall e\in E
\end{aligned}
$$

### 二分图最大匹配 & 最小点覆盖
两者互为对偶问题.

最大匹配：
$$
\text{maximize } \sum_{e\in E} x_e
$$
$$
\begin{aligned}
    \text{subject to } &\sum_{e\in \delta(v)} x_e \leq 1, \forall v\in V\\\\
    &x_e \geq 0, \forall e\in E
\end{aligned}
$$

最小点覆盖：
$$
\text{minimize } \sum_{v\in V} y_v
$$
$$
\begin{aligned}
    \text{subject to } &y_u + y_v \geq 1, \forall e = (u,v) \in E\\\\
    &y_v \geq 0, \forall v\in V
\end{aligned}
$$

### 最大流 & 最小割
两者互为对偶问题.

$f$ 表示流量, $\delta_{in}(v)$ 表示流入节点 $v$ 的边，$\delta_{out}(v)$ 表示流出节点 $v$ 的边. $d_{uv}$ 表示边 $(u,v)$ 是否在割中，$y_v$ 表示节点 $v$ 是否在源点 $s$ 代表的集合 $S$ 之中.

最大流：
$$
\text{maximize } f_{st}
$$
$$
\begin{aligned}
    \text{subject to } &f(\delta_{in}(v)) - f(\delta_{out}(v)) \leq 0, \forall v\in V\\\\
    &f_e \leq 1, \forall e\in E\\\\
    &f_e \geq 0, \forall e\in E
\end{aligned}
$$

最小割：
$$
\text{minimize } \sum_{e\in E} d_e
$$
$$
\begin{aligned}
    \text{subject to } &d_{uv} + y_u - y_v \geq 0, \forall u\sim v\in E\\\\
    &y_s - y_t \geq 1\\\\
    &y_v \geq 0, \forall v\in V
\end{aligned}
$$

## 零和问题
对于两个玩家，分别为 $A,B$，有：
$$
\text{maximize } \min_{x} \sum_{i=1}^{n} a_ix_i
$$
$$
\text{minimize } \max_{y} \sum_{i=1}^{n} b_iy_i
$$

> Theorem: 对于零和博弈，其最优解为纳什均衡. 即使一个玩家知道对方的策略之后，也不能找到比
> 当前策略严格更优的策略

### Von Neumann Minimax Theorem
$$
\max_{x} \min_{y} x^TAy = \min_{y} \max_{x} x^TAy
$$
即在零和游戏中，无论谁先宣布自己的策略，都会达到均衡解.
证明即由于这两边可以写成一对对偶问题，由强对偶性可得.

左边可以写为：
$$
\max \quad t
$$
$$
\begin{aligned}
    \text{subject to } \quad &(x^TA)^{(j)} \geq t, \forall j = 1,2,\cdots,n\\\\
    &\sum_{i=1}^n x_i = 1\\\\
    &x_i \geq 0, \forall i = 1,2,\cdots,n
\end{aligned}
$$

右边可以写为：
$$
\min \quad t
$$
$$
\begin{aligned}
    \text{subject to } \quad &(Ay)^{(i)} \leq t, \forall i = 1,2,\cdots,m\\\\
    &\sum_{i=1}^n y_i = 1\\\\
    &y_i \geq 0, \forall i = 1,2,\cdots,m
\end{aligned}
$$

即得证.

# 常用矩阵求导公式 (未求证正确性)

- $x_{n\times 1}$ 且 $A$ 是对称矩阵，$\frac{\partial}{\partial x} x^TAx = 2Ax$
- $x_{n\times 1}$ 且 $A$ 不是对称矩阵，$\frac{\partial}{\partial x} x^TAx = x^T(A+A^T)$
- $y_{m\times 1} = A_{m\times n}x_{n\times 1}$，且 $A$ 不是 $x$ 的函数，$\frac{\partial}{\partial x} y = A$
- $\alpha = y^T_{m\times 1}A_{m\times n}x_{n\times 1}$，$\frac{\partial}{\partial x} \alpha = y^TA$,且 $\frac{\partial}{\partial y} \alpha = x^TA^T$
