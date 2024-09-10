---
title: Probability Theory Review
date: 2024-06-11 10:01:29
tags: 
- Probability Theory
categories:
- Probability Theory
mathjax: true
---
这是一篇概率论期末复习的小笔记. 课程资料取自
> NJU-Probability-Theory-2024-Spring By 尹一通/刘景铖
<!--more-->

本学期概率论学习大纲如下：
![intro](intro.png)

### Chapter 1：概率空间

#### 概率空间定义

##### 样本空间

样本空间一般用$\Omega$表示，事件(Event)是一个子集 $A$，其中$A\subseteq \Omega$

一族事件(Events)：

$$
\Sigma \subseteq 2^{\Omega}
$$

而对于$\omega \in \Omega$，$\omega$称为样本(Sample)或者基本事件(Elementary event)

##### 离散概率质量函数(pmf)

$$
p: \Omega \rightarrow [0,1],\quad \sum_{\omega\in \Omega} p(\omega) = 1
$$

事件 $A\in \Omega$ 的概率为

$$
\Pr (A) = \sum_{\omega\in A}p(\omega)
$$

##### $\sigma-$代数

![](sigma-algebra.png)

##### 概率空间

令$\Sigma \subseteq 2^{\Omega}$是一个$\sigma-$代数
概率测度(或概率律)为函数：
$$
\Pr : \Sigma \rightarrow [0,1]
$$
满足
- (normalized) $\Pr(\Omega) = 1$
- ($\sigma$-additive) 对于不相容(disjoint)的事件$A_1,A_2,\cdots \in \Sigma$:
$$
\Pr (\bigcup_iA_i) = \sum_i \Pr(A_i)
$$
那么这样一个三元组$(\Omega,\Sigma,\Pr)$即为概率空间.

##### Union Bound
亦称为 Boole's inequality:对于事件$A_1,A_2,\cdots, A_n\in \Sigma$:
$$
\Pr\left(\bigcup_{i=1}^nA_i\right) \leq \sum_{i=1}^n \Pr(A_i)
$$

##### 概率公理(Probability Axioms)
![Probability Axioms](Probability Axioms.png)

##### 概率法(Probability Method)

$$
\Pr(A) > 0 \rightarrow A \neq \emptyset
$$

##### 容斥原理(Inclusion-Exclusion Principle)
![inclusion-exclusion](inclusion-exclusion.png)


##### Null & Almost Surely Event
![Null & Almost Surely Event](Null & Almost Surely Event.png)

#### 离散条件概率(Discrete Conditional Probability)

给定事件$B$发生的条件下，事件$A$发生的概率为：

$$
\Pr(A|B) = \frac{\Pr(A\cap B)}{\Pr(B)}
$$

注意：$\Pr(\cdot|B)$ 是一个良定义的概率测度.
- 样本空间是$B$
- $\Sigma^B = \{A\cap B|A\in \Sigma\}$ 是一个$\sigma-$代数
- $\Pr(\cdot|B)$ 满足概率公理

##### Law for Conditional Probability

![Law for Conditional Probability](Law for Conditional Probability.png)

#### 独立性(Independence)

事件$A$和$B$是独立的，当且仅当：
$$
\Pr(A\cap B) = \Pr(A)\Pr(B)
$$
推论：
- 若$\Pr(B) > 0$:
$$
\Pr(A|B) = \Pr(A)
$$
- 
$$
\Pr(A\cap B) = \Pr(A)\Pr(B) \Leftrightarrow \Pr(A\cap B^c) = \Pr(A)\Pr(B^c)
$$

##### Mutually Independent 
![Mutually Independent](Mutually Independent.png)

##### Pairwise Independent
![Pairwise Independent](Pairwise Independent.png)

##### Conditional Independence
![Conditional Independence](Conditional Independence.png)

### Chapter 2：随机变量(Random Variables)

#### 随机变量
给定概率空间$(\Omega,\Sigma,\Pr)$，随机变量是一个函数：

$$
X: \Omega \rightarrow \mathbb{R}
$$
满足$\forall x\in \mathbb{R},\{\omega\in \Omega | X(\omega) \leq x\}\in \Sigma$(i.e. X是一个可测函数)

对于离散随机变量，其函数定义为：

$$
X : \Omega \rightarrow \mathbb{Z}
$$

#### 分布(Distribution)
累积分布函数(CDF,i.e. cumulative distribution function) $F_X(x): \mathbb{R}\rightarrow [0,1]$
$$
F_X(x) = \Pr(X\leq x)
$$
![CDF](CDF.png)

##### Redefine: 离散随机变量 pmf & CDF
$$
p_X(x) = \Pr(X=x)
$$
$$
F_X(y) = \Pr(X\leq y) = \sum_{x\leq y}p_X(x)
$$

##### 连续随机变量 pdf & CDF
对于连续型随机变量，其概率密度函数(pdf,i.e. probability density function) $f_X(x)$ 与 CDF $F_X(x)$ 满足：

$$
F_X(y) = \Pr(X \leq y) = \int_{-\infty}^y f_X(x)dx
$$

##### Redefine: 离散随机变量独立性
![DV-independence](DV-independence.png)

#### 随机向量(Random Vectors)
给定概率空间 $(\Omega,\Sigma,\Pr)$ 随机向量
$\vec{X} = \{X_1,X_2,\cdots,X_n\}$

那么联合分布函数(Joint CDF)为：

$$
F_{\vec{X}}(x_1,x_2,\cdots,x_n) = \Pr(X_1\leq x_1,X_2\leq x_2,\cdots,X_n\leq x_n)
$$

对于离散的情况，联合概率质量函数(Joint pmf)为：

$$
p_{\vec{X}}(x_1,x_2,\cdots,x_n) = \Pr(X_1=x_1,X_2=x_2,\cdots,X_n=x_n)
$$

对于离散的$X_i$的边缘质量函数(Marginal pmf)为：

$$
p_{X_i}(x_i) = \sum_{x_1,x_2,\cdots,x_{i-1},x_{i+1},\cdots,x_n}p_{\vec{X}}(x_1,x_2,\cdots,x_n)
$$

For example:

$$
\Pr(x) = \sum_y \Pr(x,y) = \sum_y \Pr(x|y)\Pr(y)
$$

#### 重要分布模型
##### 二项分布(Binomial Distribution)
$$
\Pr(X=k) = \binom{n}{k}p^k(1-p)^{n-k}
$$
期望值：
$$
E[X] = np
$$
方差：
$$
Var[X] = np(1-p)
$$

##### 几何分布(Geometric Distribution)
$$
\Pr(X=k) = (1-p)^{k-1}p
$$
期望值：
$$
E[X] = \frac{1}{p}
$$

用指示性随机变量证明：
![EofGeometricproof](EofGeometricproof.png)

方差：
$$
Var[X] = \frac{1-p}{p^2}
$$

![VofGeometricproof](VofGeometricproof.png)

无记忆性：
![GD-Memoryless](GD-Memoryless.png)

##### 负二项分布(Negative Binomial Distribution)
$X$定义为第$r$次成功发生时伯努利实验失败的次数，那么：
$$
\Pr(X=k) = \binom{k+r-1}{k}p^r(1-p)^k = (-1)^k\binom{-r}{k}p^r(1-p)^k
$$
值得注意的是负二项分布可以写为一系列几何分布之和：
$$
X = (X_1-1) + (X_2-1) + \cdots + (X_r-1),\quad X_i\sim Geometric(p)
$$
因此利用期望的线性性质，有：
![EofNBinproof](EofNBinproof.png)

- 方差：
![NBinVar](NBinVar.png)

##### 超几何分布(Hypergeometric Distribution)
$X$定义为无放回(Without Replacement)抓取 n 次，其中有 k 次成功的次数，那么：
$$
\Pr(X=k) = \frac{\binom{M}{k}\binom{N-M}{n-k}}{\binom{N}{n}}
$$

期望值：

$$
E[X] = n\frac{M}{N}
$$


##### 多项式分布(Multinomial Distribution)
$X_1,X_2,\cdots,X_k$定义为 $n$ 次独立的多项式试验，其中第 $i$ 个结果出现 $x_i$ 次的次数，那么：
$$
\Pr(X_1=x_1,X_2=x_2,\cdots,X_k=x_k) = \frac{n!}{x_1!x_2!\cdots x_k!}p_1^{x_1}p_2^{x_2}\cdots p_k^{x_k}
$$

##### 泊松分布(Poisson Distribution)
$$
\Pr(X=k) = \frac{\lambda^k}{k!}e^{-\lambda}
$$
期望值：
$$
E[X] = \lambda
$$
方差：
$$
Var[X] = \lambda
$$

###### 泊松分布的性质：
- 泊松分布之和仍然是泊松分布
> $X_1 \sim Pois(\lambda_1), X_2 \sim Pois(\lambda_2)$，那么$X_1+X_2 \sim Pois(\lambda_1+\lambda_2)$


<!--用 align 环境写出-->
$$
\begin{align}
\Pr(X_1+X_2=k) &= \sum_{i=0}^k \Pr(X_1=i,X_2=k-i) \\
&= \sum_{i=0}^k \Pr(X_1=i)\Pr(X_2=k-i) \\
&= \sum_{i=0}^k \frac{\lambda_1^i}{i!}e^{-\lambda_1}\frac{\lambda_2^{k-i}}{(k-i)!}e^{-\lambda_2} \\
&= \frac{e^{-(\lambda_1+\lambda_2)}}{k!}\sum_{i=0}^k \binom{k}{i}\lambda_1^i\lambda_2^{k-i} \\
&= \frac{e^{-(\lambda_1+\lambda_2)}}{k!}(\lambda_1+\lambda_2)^k
\end{align}
$$

- 泊松分布的近似
令$(X_1,X_2,\cdots,X_n)$为多项式分布，给定参数$m,n,\sum_i p_i = 1$，
即 n 个小球放入 m 个盒子，每个盒子的概率为 $p_i$.

令$(Y_1,Y_2,\cdots,Y_m)$为泊松分布，给定参数$\lambda = np_i$，
并且给定
$$
\sum_{i=1}^m Y_i = n
$$
那么此时，$(X_1,X_2,\cdots,X_n)$ 与 $(Y_1,Y_2,\cdots,Y_m)$ 同分布.

#### 独立随机变量之和
若$X$和$Y$是独立的随机变量，那么$Z=X+Y$的分布为：
$$
p_{X+Y}(z) = \sum_x p_X(x)p_Y(z-x) = \sum_y p_X(z-y)p_Y(y)
$$

#### 重要模型
- Balls into bins(Random mapping)
- Random Graph(Erdos-Renyi Random graph model)
- Random Tree(Galton–Watson branching process)

#### 期望(Expectation)
- 对于离散型随机变量：
$$
E[X] = \sum_x xp_X(x)
$$
- 对于连续型随机变量：
$$
E[X] = \int_{-\infty}^\infty xf_X(x)dx
$$

- 指示型随机变量的期望：
$$
E[I_A] = \Pr(A)
$$

- LOTUS(Law of the Unconscious Statistician)
$$
E[f(X)] = \sum_x f(x)p_X(x)
$$
![LOTUSproof](LOTUSproof.png)

- 期望的线性性质：
$$
E[aX+bY] = aE[X]+bE[Y]
$$

$\forall \text{linear function } f$
$$
E[f(X_1,X_2,\cdots,X_n)] = f(E[X_1,X_2,\cdots,X_n])
$$

- 随机变量乘机的期望性质：
![ProductofExpectation](ProductofExpectation.png)

- 期望的计算方法(Double Counting):
![DoubleCounting](DoubleCounting.png)

- Limitation of Expectation:
![LimitationExpect](LimitationExpect.png)

##### 条件期望(Conditional Expectation)
$$
E[X|A] = \sum_x x\cdot \Pr(X=x |A)
$$

##### 条件分布(Conditional Distribution)
其 pmf 为：
$$
p_{X|A}(x) = \Pr(X=x|A)
$$

##### 全期望公式(Law of Total Expectation)
$$
\mathbb{E}[X] = \sum_{i=1}^n\mathbb{E}[[X|B_i]]\cdot \Pr(B_i)
$$

##### Jensen's Inequality
![JensenInequality](JensenInequality.png)

##### 期望的单调性(Monotonicity of Expectation)
![MonotonicityofE](MonotonicityofE.png)

##### 期望: Averaging Principle

- $\Pr(X>\mathbb{E}[X]) > 0$ and if $\Pr(X < c) = 1$ then $\mathbb{E}[x] < c$
- $\Pr(X>\mathbb{E}[X]) > 0$ and if $\Pr(X > c) = 1$ then $\mathbb{E}[x] > c$

根据概率法，有：
$$
\exists \omega\in \Omega,X(\omega) \geq \mathbb{E}[X]
$$
$$
\exists \omega\in \Omega,X(\omega) \leq \mathbb{E}[X]
$$

### Chapter 3：偏差(Deviation)

#### 马尔可夫不等式(Markov's Inequality)
令 $X$ 取非负值，那么对于任意 $a>0$:
$$
\Pr(X\geq a) \leq \frac{\mathbb{E}[X]}{a}
$$

proof by total expectation:
$$
\begin{align}
\mathbb{E}[X] &= \mathbb{E}[X|X\geq a]\cdot \Pr(X\geq a) + \mathbb{E}[X|X<a]\cdot \Pr(X<a) \\
&\geq a\cdot \Pr(X\geq a)
+ 0\cdot \Pr(X<a) \\
&= a\cdot \Pr(X\geq a)
\end{align}
$$

- Lower tail Markov's Inequality:
$$
\Pr(X\leq a) \leq \frac{u -\mathbb{E}[X]}{u - a}
$$
其中 $X$ 有 bounded **range** $u$.

- 更一般的形式:
![GeneralMarkovInequality](GeneralMarkovInequality.png)

#### 蒙特卡洛算法 versus 拉斯维加斯算法
- 蒙特卡洛算法：给定一个算法，其输出的结果是随机的，但是其期望值是正确的.
- 拉斯维加斯算法：给定一个算法，其输出的结果是确定的，但是其运行时间是随机的.

#### 矩(Moments)
- k 阶矩(Moment of order k):
$$
\mathbb{E}[X^k]
$$
- k 阶中心矩(Central Moment of order k):
$$
\mathbb{E}[(X-\mathbb{E}[X])^k]
$$

#### 切比雪夫不等式(Chebyshev's Inequality)
令 $X$ 为一个随机变量，那么对于任意 $a>0$:
$$
\Pr(|X-\mathbb{E}[X]|\geq a) \leq \frac{Var[X]}{a^2}
$$

proof by Markov's Inequality:
令 $Y = (X-\mathbb{E}[X])^2$，那么：
$$
\begin{align}
\Pr(|X-\mathbb{E}[X]|\geq a) &= \Pr(Y\geq a^2) \\
&\leq \frac{\mathbb{E}[Y]}{a^2} \\
&= \frac{Var[X]}{a^2}
\end{align}
$$

- 标准差形式:
$$
\forall k \geq 1,\Pr(|X-\mathbb{E}[X]|\geq k\sigma) \leq \frac{1}{k^2}
$$

#### 随机变量的中位数(Median)
- 对于随机变量 $X$，其中位数$m$定义为：
$$
\Pr(X\geq m) \geq \frac{1}{2},\quad \Pr(X\leq m) \geq \frac{1}{2}
$$
![Median&Expectation&StandardD](Median&Expectation&StandardD.png)

#### 方差(Variance)
$$
Var[X] = \mathbb{E}[(X-\mathbb{E}[X])^2] = \mathbb{E}[X^2] - \mathbb{E}[X]^2
$$

##### 方差性质：
- $Var[aX+b] = a^2Var[X]$
- $Var[X + Y] = Var[X] + Var[Y] + 2Cov[X,Y]$

对于两两独立(pairwise independent)随机变量 $X_1,X_2,\cdots,X_n$:
$$
Var\left[\sum_{i=1}^nX_i\right] = \sum_{i=1}^nVar[X_i]
$$

##### 指示性随机变量的方差
$$
Var[I_A] = \Pr(A)(1-\Pr(A))
$$

#### 协方差(Covariance)
$$
Cov[X,Y] = \mathbb{E}[(X-\mathbb{E}[X])(Y-\mathbb{E}[Y])] = \mathbb{E}[XY] - \mathbb{E}[X]\mathbb{E}[Y]
$$

协方差性质：
- Symmetric: $Cov[X,Y] = Cov[Y,X]$
- Distributive: $Cov[X,Y+Z] = Cov[X,Y] + Cov[X,Z]$
- "Linear": $Cov[aX,Y] = aCov[X,Y]$

若 $X$ 和 $Y$ 独立，那么 $Cov[X,Y] = 0$，反之不成立.

proof:
![IndependentCovProof](IndependentCovProof.png)

#### 相关性(Correlation)
$$
\rho(X,Y) = \frac{Cov[X,Y]}{\sqrt{Var[X]Var[Y]}} \in [-1,1] \quad 
\text{By Cauchy-Schwarz Inequality}
$$

$X,Y$ 称为不相关(Uncorrelated)，当且仅当 $\rho(X,Y) = 0 \Leftrightarrow Cov[X,Y] = 0$
- 若 $X,Y$不相关，那么有：
$$
Var[X+Y] = Var[X] + Var[Y]
$$

$$
\mathbb{E}[XY] = \mathbb{E}[X]\mathbb{E}[Y]
$$
- 若 $X,Y$ 独立，那么 $X,Y$ 不相关，反之不成立.


#### 高阶矩(Higher Moments)
- Skewness(偏度):
$$
\text{Skew}[X] = \frac{\mathbb{E}[(X-\mathbb{E}[X])^3]}{\sqrt{Var[X]}^3}
$$
- Kurtosis(峰度):
$$
\text{Kurt}[X] = \frac{\mathbb{E}[(X-\mathbb{E}[X])^4]}{\sqrt{Var[X]}^4}
$$

#### 矩生成函数(Moment Generating Function)
$$
M_X(t) = \mathbb{E}[e^{tX}] = \sum_{k\geq 0} \frac{t^k\mathbb{E}[X^k]}{k!}
$$

### Chapter 4：连续分布(Continuous Distributions)

#### 连续型随机变量(Continuous Random Variables)

- 累积分布函数(CDF) $F_X: \mathbb{R}\rightarrow [0,1]$

$$
F_X(x) = \Pr(X\leq x) = \int_{-\infty}^x f_X(t)dt
$$
其中 $f_X(x)$ 为概率密度函数(pdf)，且有：

$$
f_X(x) = \frac{dF_X(x)}{dx}
$$

概率密度函数从 $-\infty$ 到 $\infty$ 的积分为 1:
$$
\int_{-\infty}^\infty f_X(x)dx = 1
$$

CDF 是一个非减函数，且有右连续性.
$$
\lim _{x\rightarrow -\infty}F_X(x) = 0,\quad \lim _{x\rightarrow \infty}F_X(x) = 1
$$

** 下面的内容较复杂，多以课程 slides 为主 **

#### 连续随机变量的联合分布
![CJointDistribution](CJointDistribution.png)

#### 连续随机变量的边缘分布
![CMarginalDistribution](CMarginalDistribution.png)

#### 独立性(Independence)
![Cindependent](Cindependent.png)

#### 条件分布(Conditional Distribution)
![ConDistribution1](ConDistribution1.png)  
![ConDistribution2](ConDistribution2.png)

即对于 $f_{X|Y}(x|y),f_T(y) > 0$ 有：
$$
f_{X|Y}(x|y) = \frac{f_{X,Y}(x,y)}{f_Y(y)}
$$

#### 期望(Expectation)
$$
\mathbb{E}[X] = \int_{-\infty}^\infty xf_X(x)\ dx = \int_{-\infty}^\infty x\ dF_X(x)
$$

若此连续型随机变量 $X$ 非负，那么：
![ContinuousDoubleCounting](ContinuousDoubleCounting.png)

#### LOTUS(Law of the Unconscious Statistician)
![C-LOTUS](C-LOTUS.png)

下面两张 slides 较难，暂未完全理解：

#### Induced Probability Distribution
![IPD](IPD.png)

#### Inverse Tranform Sampling (逆变换采样)

![InverseTranformSampling](InverseTranformSampling.png)

#### 随机支配(Stochastic Dominance)
![StochasticDominance](StochasticDominance.png)

#### 重要的连续分布模型
##### 均匀分布(Uniform Distribution)
$$
f_X(x) = \begin{cases}
\frac{1}{b-a}, & a\leq x\leq b \\
0, & \text{otherwise}
\end{cases}
$$

##### 指数分布(Exponential Distribution)
$$
f_X(x) = \begin{cases}
\lambda e^{-\lambda x}, & x\geq 0 \\
0, & \text{otherwise}
\end{cases}
$$

CDF:
$$
F_X(x) = \begin{cases}
1-e^{-\lambda x}, & x\geq 0 \\
0, & \text{otherwise}
\end{cases}
$$

- 期望值：
$$
E[X] = \frac{1}{\lambda}
$$

- 方差：
$$
Var[X] = \frac{1}{\lambda^2}
$$

- 无记忆性(Memoryless Property):
![expMemoryless](expMemoryless.png)

##### 正态分布(Normal Distribution)
$$
f_X(x) = \frac{1}{\sqrt{2\pi}\sigma}e^{-\frac{(x-\mu)^2}{2\sigma^2}}
$$

标准正态分布(Standard Normal Distribution):
$$
f_X(x) = \frac{1}{\sqrt{2\pi}}e^{-\frac{x^2}{2}}
$$

给出高斯积分：
$$
\int_{-\infty}^\infty e^{-x^2}dx = \sqrt{\pi}
$$

- 正态分布线性变换导出的随机变量：
对于$Y=aX+b, X\sim N(\mu,\sigma^2)$，那么：
$$
Y\sim N(a\mu+b,a^2\sigma^2)
$$
因此，若$X\sim N(\mu,\sigma^2)$，那么：
$$
\frac{X-\mu}{\sigma}\sim N(0,1)
$$
- 正态分布之和：
若$X\sim N(\mu_1,\sigma_1^2),Y\sim N(\mu_2,\sigma_2^2)$，那么：
$$
X+Y\sim N(\mu_1+\mu_2,\sigma_1^2+\sigma_2^2)
$$

#### 连续型随机变量之和(卷积)
考虑$Z = X+Y$, 其 pdf 为：
$$
f_Z(z) = f_X*f_Y(z) = \int_{-\infty}^\infty f_X(x)f_Y(z-x)dx = 
\int_{-\infty}^\infty f_X(z-y)f_Y(y)dx
$$

#### 正态分布的大偏差不等式
![NormalLargeD](NormalLargeD.png)

#### 二维正态分布(Bivariate Normal Distribution)
$$
f_{X,Y}(x,y) = \frac{1}{2\pi\sqrt{1-\rho^2}}\exp\left(-\frac{1}{2(1-\rho^2)}\left(x^2 -2\rho xy + y^2\right)\right)
$$

其中，$X,Y$的边缘分布为 $N(0,1)$. 且有：

$$
Cov[X,Y] = \mathbb{E}[XY] - \mathbb{E}[X]\mathbb{E}[Y]
= \int_{-\infty}^\infty \int_{-\infty}^\infty xyf_{X,Y}(x,y)dxdy = \rho
$$
#### 卡方分布(Chi-Squared Distribution)
![Chi-Squared](Chi-Squared.png)
$$
f_X(x) = \begin{cases}
\frac{1}{2^{k/2}\Gamma(k/2)}x^{k/2-1}e^{-x/2}, & x\geq 0 \\
0, & \text{otherwise}
\end{cases}
$$

对于 $k = 1$ 的情况，其 pdf 为：
$$
f_X(x) = \frac{1}{\sqrt{2\pi}}e^{-x/2}
$$

### Chapter 5: 收敛与极限(Convergence and Limit)
#### 收敛方式 (Convergence)

![ModesofConvergence1](ModesofConvergence1.png)
![ModesofConvergence2](ModesofConvergence2.png)

三者的推出关系如下：

$$
\text{a.s.} \Rightarrow \text{in probability} \Rightarrow \text{in distribution}
$$

当依分布收敛到常数时，即为依分布收敛到常数.
![CovergenceConstant](CovergenceConstant.png)

依概率收敛推不出 almost surely 收敛，反例如下：
![CounterP2AS](CounterP2AS.png)

a.s. 收敛的条件：
![ConditionForAS](ConditionForAS.png)

#### Continuous Mapping Theorem

- 若 $X_n \xrightarrow{a.s.} X$，且 $g$ 为连续函数，那么 $g(X_n) \xrightarrow{a.s.} g(X)$
- 若 $X_n \xrightarrow{p} X$，且 $g$ 为连续函数，那么 $g(X_n) \xrightarrow{p} g(X)$
- 若 $X_n \xrightarrow{d} X$，且 $g$ 为连续函数，那么 $g(X_n) \xrightarrow{d} g(X)$

#### Slutsky's Theorem
若 $X_n \xrightarrow{d} X$，且 $Y_n \xrightarrow{p} c$，那么：
- $X_n + Y_n \xrightarrow{d} X + c$
- $X_nY_n \xrightarrow{d} cX$
- $X_n/Y_n \xrightarrow{d} X/c$
- $X_n/Y_n \xrightarrow{p} X/c$

#### 大数定律(Law of Large Numbers)
- 弱大数定律(Weak Law of Large Numbers):
$$
\bar{X}_n \xrightarrow{p} \mu
$$
- 强大数定律(Strong Law of Large Numbers):
$$
\bar{X}_n \xrightarrow{a.s.} \mu
$$

弱大数定律的证明(需要方差有界)：
![WeakLLNProof](WeakLLNProof.png)

#### 棣莫弗-拉普拉斯中心极限定理(De Moivre-Laplace Central Limit Theorem)
![DM-LCLT](DM-LCLT.png)

#### 列维中心极限定理(Lindeberg-Levy Central Limit Theorem)
$$
\frac{S_n - n\mu}{\sigma\sqrt{n}} \xrightarrow{d} N(0,1)
$$

#### 特征函数(Characteristic Function)
$$
\phi_X(t) = \mathbb{E}[e^{itX}]
$$
有 Fourier 变换：
$$
f_X(x) = \int_{-\infty}^\infty e^{-itx}d F_X(t) = \mathbb{E}[\cos(tX)] + i\mathbb{E}[\sin(tX)]
$$

- 若 $X,Y$ 独立，那么 $\phi_{X+Y}(t) = \phi_X(t)\phi_Y(t)$
- 若 $X_n \xrightarrow{d} X$，那么 $\phi_{X_n}(t) \xrightarrow{} \phi_X(t)$
- $|\phi_X(t)| \leq 1$
  
特别的，标准正态分布的特征函数为：
$$
\phi_X(t) = e^{-t^2/2}
$$

### Chapter 6: Concentration

#### Chernoff Bounds
$$
S_n = \sum_{i=1}^n X_i
$$
即 Poisson Binomial Random Variable.

考虑其偏差的 tail bounds，即有 Chernoff Bounds:
![Chernoff](Chernoff.png)
