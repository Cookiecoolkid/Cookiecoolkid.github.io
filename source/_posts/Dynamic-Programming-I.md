---
title: Dynamic Programming I
date: 2024-09-02 09:26:24
tags: 
- AcWing
- Algorithm
categories: 
- Algorithm
mathjax: true
---

- 二维数字三角形模型 🔺
- 最长上升自序列模型 📈
- 背包问题 🎒

#### 动态规划
- 状态表示(思考维度 如二维```f[i][j]```)
  - 集合：```f[i][j]``` 表示哪些情况
  - 属性：```f[i][j]``` 表示集合里的 MAX/MIN/数量
- 状态计算
  - 划分集合(不重不漏)
  - 状态转移方程

<!--more-->

![dp](dp.png)

#### 二维数字三角形模型
![Pr1](Pr1.png)

```c++
#include <iostream>
#include <algorithm>
using namespace std;

const int Row = 110;
const int Col = 110;

int T;
int dp[Row][Col];
int map[Row][Col];

int main() {
    cin >> T;
    while (T--) {
        int r,c;
        cin >> r >> c;
        for (int i = 0; i < r; i++) {
            for (int j = 0; j < c; j++) {
                cin >> map[i][j];
            }
        }
        
        dp[0][0] = map[0][0];
        
        for (int i = 1; i < c; i++) dp[0][i] = dp[0][i - 1] + map[0][i];
        for (int i = 1; i < r; i++) dp[i][0] = dp[i - 1][0] + map[i][0];
        
        for (int i = 1; i < r; i++) {
            for (int j = 1; j < c; j++) {
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]) + map[i][j];
            }
        }
        cout << dp[r - 1][c - 1] << endl;
    }
}
```

![Pr2](Pr2.png)

```c++
#include <iostream>

using namespace std;

const int N = 15;
int n;
int dp[N][N][N][N];
int map[N][N];
int main(){
    cin >> n;
    int r,c,w;
    while(cin >> r >> c >> w, r || c || w) {
        map[r][c] = w;
    }
    
    for (int i1 = 1; i1 <= n; i1++) {
        for (int i2 = 1; i2 <= n; i2++) {
            for (int j1 = 1; j1 <= n; j1++) {
                for (int j2 = 1; j2 <= n; j2++) {
                    if (i1 + j1 != i2 + j2) continue;
                    int t = map[i1][j1];
                    if (i1 != i2) t += map[i2][j2];
                    
                    int &x= dp[i1][j1][i2][j2];
                    x = max(x, dp[i1 - 1][j1][i2 - 1][j2] + t);
                    x = max(x, dp[i1][j1 - 1][i2 - 1][j2] + t);
                    x = max(x, dp[i1 - 1][j1][i2][j2 - 1] + t);
                    x = max(x, dp[i1][j1 - 1][i2][j2 - 1] + t);
                }
            }
        }
    }
    cout << dp[n][n][n][n] << endl;
}
```


#### 最长上升子序列模型

![Model1](Model1.png)

```c++
#include<iostream>
using namespace std;

const int N = 1010;
int a[N];
int dp[N]; //dp[i]表示以a[i]结尾的所有上升子序列的最大长度

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        cin >> a[i];
    }
    
    for (int i = 1; i <= n; i++) dp[i] = 1;
    
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j < i; j++) {
            if (a[i] > a[j]) 
                dp[i] = max(dp[i], dp[j] + 1);
        }
    }
    int res = 0;
    for (int i = 1; i <= n; i++) {
        res = max(res, dp[i]);
    }
    cout << res << endl;
}
```

![Pr3](Pr3.png)

```c++
#include <iostream>
using namespace std;

const int N = 1010;
int a[N];
int up[N];
int down[N];
int n;

int main() {
    cin >> n;
    for (int i = 1; i <= n; i++) cin >> a[i];
    
    for (int i = 1; i <= n; i++) {
        up[i] = 1;
        for (int j = 1; j < i; j++) {
            if (a[i] > a[j])
                up[i] = max(up[i], up[j] + 1);
        }
    }
    
    for (int i = n; i; i--) {
        down[i] = 1;
        for (int j = n; j > i; j--) {
            if (a[i] > a[j])
                down[i] = max(down[i], down[j] + 1);
        }
    }
    
    int res = 0;
    for (int i = 1; i <= n; i++) {
        res = max(res, up[i] + down[i] - 1);
    }
    cout << res << endl;
}
```

![Pr4](Pr4.png)


```c++
#include<iostream>
using namespace std;

const int N = 1010;

int q[N];
int dp[N], g[N];

int n;

int main() {
    while(cin >> q[n]) n++;
    
    int res = 0;
    for (int i = n - 1; i >= 0; i --) {
        dp[i] = 1;
        for (int j = n - 1; j > i; j --) {
            if (q[j] <= q[i]) 
                dp[i] = max(dp[i], dp[j] + 1);
        }
    }
    
    for (int i = 0; i < n; i++) res = max(res, dp[i]);
     
    cout << res << endl;
    
    int cnt = 0;
    for (int i = 0; i < n; i++) {
        int k = 0;
        while(k < cnt && q[i] > g[k]) k++;
        g[k] = q[i];
        if (k >= cnt) cnt++;
    }
    
    cout << cnt << endl;
}
```

![Pr5](Pr5.png)

```c++
#include <iostream>
using namespace std;

const int N = 55;
int up[N], down[N];
int a[N];
int ans;
int n;

void dfs(int depth, int u, int d) {
    if (u + d >= ans) return;
    if (depth == n) {
        ans = u + d;
        return;
    }
    // 列举两种情况
    // 加入上升序列
    int k = 0;
    while (k < u && a[depth] > up[k]) k++;
    int tmp = up[k];
    up[k] = a[depth];
    if (k == u) dfs(depth + 1, u + 1, d);
    else dfs(depth + 1, u, d);
    
    // 回溯
    up[k] = tmp;
    // 加入下降序列
    k = 0;
    while (k < d && a[depth] < down[k]) k++;
    tmp = down[k];
    down[k] = a[depth];
    if (k == d) dfs(depth + 1, u, d + 1);
    else dfs(depth + 1, u, d);
    
    // 回溯
    down[k] = tmp;
    
    return;
}

int main() {
    while (cin >> n, n) {
        for (int i = 0; i < n; i++) cin >> a[i];
        
        ans = n;
        dfs(0, 0, 0);
        
        cout << ans << endl;
    }
}
```

![Pr6](Pr6.png)


```c++
#include <iostream>
using namespace std;

const int N = 3010;

int a[N];
int b[N];

int dp[N][N];
int n;
int ans;
int main() {
    cin >> n;
    for (int i = 1; i <= n; i++) cin >> a[i];
    for (int i = 1; i <= n; i++) cin >> b[i];
    
    for (int i = 1; i <= n; i++) {
        int maxv = 0; 
        for (int j = 1; j <= n; j++) {
            dp[i][j] = dp[i - 1][j];
            /*
            if (a[i] == b[j]) {
                for (int k = 0; k < j; k++) {
                    if (b[k] < b[j])
                        dp[i][j] = max(dp[i][j], dp[i - 1][k] + 1);
                }
                //用 maxv 优化一层循环, 由于 a[i] == b[j] 即等价于 b[k] < a[i] 因此可以放在 i 循环中
            }
            */
            if (a[i] == b[j]) dp[i][j] = max(dp[i][j], maxv + 1);
            if (a[i] > b[j]) maxv = max(maxv, dp[i - 1][j]);
        }
    }
    for (int i = 1; i <= n; i++) ans = max(ans, dp[n][i]);
    cout << ans << endl;
}
```

#### 背包

##### 多重背包

###### 多重背包 + 二进制优化

关键: 将$sum(s_i), i = 1,...,n$个物品分为了$cnt$堆物品

```c++
#include <iostream>
using namespace std;

const int N = 12010, M = 2010;

int n, m;
int v[N], w[N]; //逐一枚举最大是N*logS
int f[M]; // 体积<M

int main()
{
    cin >> n >> m;
    int cnt = 0; //分组的组别
    for(int i = 1;i <= n;i ++)
    {
        int a,b,s;
        cin >> a >> b >> s;
        int k = 1; // 组别里面的个数
        while(k<=s)
        {
            cnt ++ ; //组别先增加
            v[cnt] = a * k ; //整体体积
            w[cnt] = b * k; // 整体价值
            s -= k; // s要减小
            k *= 2; // 组别里的个数增加
        }
        //剩余的一组
        if(s>0)
        {
            cnt ++ ;
            v[cnt] = a*s; 
            w[cnt] = b*s;
        }
    }

    n = cnt ; //枚举次数正式由个数变成组别数

    //01背包一维优化
    for(int i = 1;i <= n ;i ++)
        for(int j = m ;j >= v[i];j --)
            f[j] = max(f[j],f[j-v[i]] + w[i]);

    cout << f[m] << endl;
    return 0;
}
```

###### 多重背包 + 单调队列 + 一维数组

![MultiBag](MultiBag.png)

```c++
#include <iostream>
#include <cstring>
#include <algorithm>

using namespace std;

const int N = 1010;
const int M = 20010;

int dp[2][M];
int v[N], w[N], s[N];
int q[M];
int n, m;

int main() {
    cin >> n >> m;
    for (int i = 1; i <= n; i++) {
        cin >> v[i] >> w[i] >> s[i];
    }
    
    for (int i = 1; i <= n; i++) {
        for (int r = 0; r < v[i]; r++) {
            int hh = 0, tt = -1;
            for (int j = r; j <= m; j += v[i]) {
                while (hh <= tt && q[hh] < j - s[i] * v[i]) hh ++; // 装进 s[i] * v[i] 还有空间，但只有 s[i] 个，队头出队
                while (hh <= tt && dp[(i - 1) & 1][q[tt]] + (m - q[tt]) / v[i] * w[i] 
                                <= dp[(i - 1) & 1][j] + (m - j) / v[i] * w[i]) -- tt; // 后进来的更优，队尾出队
                q[++ tt] = j;
                dp[i & 1][j] = dp[(i - 1) & 1][q[hh]] + (j - q[hh]) / v[i] * w[i];
            }
        }
    }
    cout << dp[n & 1][m] << endl; 
    return 0;
}
```

![ConcreteSelection](ConcreteSelection.png)

```c++
#include <iostream>
#include <algorithm>

using namespace std;

const int N = 1010;

int n, m;
int w[N], v[N];
int dp[N][N];

int main(){
    cin >> n >> m;
    for (int i = 1; i <= n; i++) cin >> v[i] >> w[i];
    
    for (int i = n; i >= 1; i--) {
        for (int j = 0; j <= m; j++) {
            dp[i][j] = dp[i + 1][j];
            if (j >= v[i]) dp[i][j] = max(dp[i][j], dp[i + 1][j - v[i]] + w[i]);
        }
    }
    
    // dp[1][m]
    int j = m;
    for(int i = 1; i <= n; i++) {
        if (j >= v[i] && dp[i][j] == dp[i + 1][j - v[i]] + w[i]){
            cout << i << " ";
            j -= v[i];
        }
    }
    return 0;
}
```

##### 分组背包

- 循环物品组 
- 循环体积
- 循环决策

![GBag](GBag.png)
```c++
#include<bits/stdc++.h>
using namespace std;

const int N = 110;
int f[N];
int v[N][N],w[N][N],s[N];
int n, m, k;

int main(){
    cin >> n >> m;
    for(int i = 0; i < n; i++){
        cin >> s[i];
        for(int j = 0; j < s[i]; j++){
            cin >> v[i][j] >> w[i][j];
        }
    }

    // 二维状态转移为： f[i][j]=max(f[i][j],f[i-1][j-v[i][k]]+w[i][k]);
    for(int i = 0; i < n; i++){
        for(int j = m; j >= 0; j--){
            for(int k = 0; k < s[i]; k++){
            // for(int k = s[i]; k >= 1; k--)也可以
                if(j >= v[i][k])     
                    f[j] = max(f[j],f[j-v[i][k]]+w[i][k]);  
            }
        }
    }
    cout << f[m] << endl;
}
```

![GroupBag](GroupBag.png)

```c++
#include <cstring>
#include <iostream>
#include <algorithm>
#include <vector>

#define v first
#define w second

using namespace std;

typedef pair<int, int> PII;

const int N = 60, M = 32010;

int n, m;
PII master[N];
vector<PII> servent[N];
int f[M];

int main()
{
    cin >> m >> n;

    for (int i = 1; i <= n; i ++ )
    {
        int v, p, q;
        cin >> v >> p >> q;
        p *= v;
        if (!q) master[i] = {v, p};
        else servent[q].push_back({v, p});
    }

    for (int i = 1; i <= n; i ++ )
        for (int u = m; u >= 0; u -- )
        {
            for (int j = 0; j < 1 << servent[i].size(); j ++ )
            {
                int v = master[i].v, w = master[i].w;
                for (int k = 0; k < servent[i].size(); k ++ )
                    if (j >> k & 1)
                    {
                        v += servent[i][k].v;
                        w += servent[i][k].w;
                    }
                if (u >= v) f[u] = max(f[u], f[u - v] + w);
            }
    }

    cout << f[m] << endl;

    return 0;
}
```

###### 树形 + 分组背包 DP

![TreeGroupDP](TreeGroupDP.png)

```c++
#include <iostream>
#include <cstring>
#include <algorithm>

using namespace std;

const int N = 110;
const int V = 110;
int n, m;
// dp[i][j] 代表考虑以 i 结点为根节点, 体积为 j 的情况下价值最大值
int dp[N][V], e[N], ne[N], h[N];
int v[N], w[N];
int root;
int idx;

// 数组邻接表
void add(int a, int b) {
    e[idx] = b;
    ne[idx] = h[a];
    h[a] = idx++;
}

void dfs(int x) {
    // dfs 模板： 循环所有子情况，对所有子情况调用 dfs
    // 分组背包模板 循环物品(这里是树的结点),循环体积(一维要逆序循环),
    // 循环决策(这里以体积为 0 ~ m 为决策,共 m + 1 种情况, 若以子结点为决策(选 or 不选), 最多共 2^100 种情况)
    for (int i = h[x]; i != -1; i = ne[i]) {
        int u = e[i];
        
        dfs(u);
        
        for (int j = m - v[x]; j >= 0; j--) {
            // Strategy By V
            for (int k = 0; k <= j; k++) {
                /*
                状态表示dp[x][i][j]:表示以x为根的子树的前i个子节点子树中选，总体积不超过j的所有集合，属性:max

                状态计算dp[x][i][j]:

                通过递归的方式求出最终解，所以每层dfs是为了，求出当前以x为根的子树的的子节点子树中，每颗子树到底分配
                多少体积的所有情况，把一个子树看做成一个组，一组内不同方案，相当于给改组分配不同体积，只看后面两个[i]
                [j]代表的是在前i个组中选，总体积不超过j的所有集合，属性max,就相当于分组背包问题

                dp[x][i][j]=max(dp[x][i][j],dp[x][i-1][j-k]+dp[u][u_son_size][k])
                
                这边通过第二重 j 逆序循环 优化了第二维
                */
                dp[x][j] = max(dp[x][j], dp[x][j - k] + dp[u][k]);
            }
        }
    }    
    // 前面都是在预留了 x 的情况下进行 dp (x 必须选)
    // 最后在将 x 结点放进去
    for (int j = m; j >= v[x]; j--) dp[x][j] = dp[x][j - v[x]] + w[x];
    for (int j = 0; j < v[x]; j++) dp[x][j] = 0;
}

int main() {
    memset(h, -1, sizeof(h));
    cin >> n >> m;
    
    for (int i = 1; i <= n; i++) {
        int p;
        cin >> v[i] >> w[i] >> p;
        if (p == -1) root = i;
        else add(p, i);
    }
    
    dfs(root);
    
    cout << dp[root][m] << endl;
    
    return 0;   
}
```


##### 完全背包(选法)

![BuyBook](BuyBook.png)

```c++
#include <iostream> #include <algorithm>

using namespace std;

const int N = 16; 
const int M = 3010; 
int a[] = {0, 10, 20, 50, 100}; 
int m;

int dp[N][M]; // 前 i 种货币 组成价值恰好为 m 的选法.

int main(){ 
    cin >> m;
    int n = 4;
    dp[0][0] = 1;
    
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j <= m; j++) {
            dp[i][j] = dp[i - 1][j];
            for (int k = 1; k * a[i] <= j; k++) {
                dp[i][j] += dp[i - 1][j - k * a[i]];
            }
        }
    }
    cout << dp[n][m] << endl;
    return 0;
    
}
```

- 一维优化版本:

```c++
#include <iostream> 
#include <algorithm>

using namespace std;

const int N = 16; 
const int M = 3010; 
int a[] = {0, 10, 20, 50, 100}; 
int m;

int dp[M]; // 前 i 种货币 组成价值恰好为 m 的选法.

int main(){ 
    cin >> m;
    int n = 4;
    dp[0] = 1;
    
    for (int i = 1; i <= n; i++) {
        for (int j = m; j >= 0; j--) {
            for (int k = 1; k * a[i] <= j; k++) {
                dp[j] += dp[j - k * a[i]];
            }
        }
    }
    cout << dp[m] << endl;
    return 0;
    
}
```

![CurrencySystem](CurrencySystem.png)

```c++
#include <iostream> #include <algorithm>

using namespace std;

const int N = 16; 
const int M = 3010; 
int a[N]; 
int n, m;

long long dp[N][M]; // 前 i 种货币 组成价值恰好为 m 的选法.

int main(){ 
    cin >> n >> m;

    for (int i = 1; i <= n; i++ ) cin >> a[i];
    
    dp[0][0] = 1;
    
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j <= m; j++) {
            // dp[i][j] = dp[i - 1][j];
            for (int k = 0; k * a[i] <= j; k++) {
                dp[i][j] += dp[i - 1][j - k * a[i]];
            }
        }
    }
    cout << dp[n][m] << endl;
}
```

- 一维优化：
```c++
#include <iostream> #include <algorithm>

using namespace std;

const int N = 16; 
const int M = 3010; 
int a[N]; 
int n, m;

long long dp[M]; // 前 i 种货币 组成价值恰好为 m 的选法.

int main(){ 
    cin >> n >> m;

    for (int i = 1; i <= n; i++ ) cin >> a[i];
    
    dp[0] = 1;
    
    for (int i = 1; i <= n; i++) {
        for (int j = m; j >= 0; j--) {
            // dp[i][j] = dp[i - 1][j];
            // 注意这里循环从 k = 1 开始，因为未更新时 dp[j] 等价于前面的 dp[i - 1][j]
            for (int k = 1; k * a[i] <= j; k++) {
                dp[j] += dp[j - k * a[i]];
            }
        }
    }
    cout << dp[m] << endl;
}
```

- 时间优化：
![CBTimeAdvance](CBTimeAdvance.png)

```c++
#include <iostream> #include <algorithm>

using namespace std;

const int N = 16; 
const int M = 3010; 
int a[N]; 
int n, m;

long long dp[M]; // 前 i 种货币 组成价值恰好为 m 的选法.

int main(){ 
    cin >> n >> m;

    for (int i = 1; i <= n; i++ ) cin >> a[i];
    
    dp[0] = 1;
    
    for (int i = 1; i <= n; i++) {
        // 注意此时状态转移方程为 dp[i][j] = dp[i - 1][j] + dp[i][j - a[i]]
        // 用到的是 dp[i] 层的状态，因此要正着循环
        for (int j = a[i]; j <= m; j++) {
            // dp[i][j] = dp[i - 1][j];
            dp[j] += dp[j - a[i]];
        }
    }
    cout << dp[m] << endl;
}
```

###### 中等难度

![ConcurrencySystemPlus](ConcurrencySystemPlus.png)

- 本题的关键在于要观察到这是线性代数的极大无关组表示(用```b[i]```表示)：
  - 其一，```a，b```之间可以相互表示
  - 其二，```b```中的数字一定取自```a```
  - 其三，```b```是表示出 ```a```中最优的(```b```数组元素间不能相互表示)

关于第二点的证明：

反证法：假设```b```存在一个不等于```a```中任一元素的元素，不妨设为$b_i$，由于```b```必须能表示出```a```，有：

$$
\begin{aligned}
    b_i &= k_1a_1 + k_2a_2 + ... + k_na_n \\
    &=  l_1b_1 + l_2b_2 + ... + l_{i-1}b_{i-1} + l_{i+1}b_{i+1} + ... + l_mb_m
\end{aligned}
$$


第二个等号成立在于```a```也可以由```b```表示且由于其他数字(除了```b_i```的其他数)都取自```a```，因此可以用除了$b_i$的数字来表示，这与第三点最优性矛盾。

```c++
#include <iostream>
#include <algorithm>
#include <cstring>
using namespace std;

const int N = 110;
const int M = 25010;
int n;
int a[N];
int dp[M];
int T;

int main() {
    cin >> T;
    
    while (T --) {
        cin >> n;
        int ans = n;
        for (int i = 1; i <= n; i++) cin >> a[i];
        
        sort(a + 1, a + n + 1);
        
        dp[0] = 1;
        
        for (int i = 1; i <= n; i++) {
            for (int j = a[i]; j <= a[n]; j++) {
                dp[j] += dp[j - a[i]];
            }
        }
        
        int k = 1;
        for (int i = a[1]; i <= a[n]; i++) {
            if (i == a[k]) {
                k ++;
                if (dp[i] > 1) ans --;
            }
        }
        
        // for (int i = 1; i <= a[n]; i++) cout << "dp[" << i << "] = " << dp[i] << endl;
        
        memset(dp, 0, sizeof(dp)); // 注意需要清空，避免影响下一轮
        
        cout << ans << endl;
    }
    
    return 0;
}
```

##### 混合背包(0-1,多重,完全)

![MixBag](MixBag.png)
```c++
#include <iostream>
#include <algorithm>

using namespace std;

const int N = 1010;
const int M = 1010;

int n, m;
int dp[M];


int main() {
    cin >> n >> m;
    
    for (int i = 0; i < n; i++) {
        int v, w, s;
        cin >> v >> w >> s;
         
        // s = 0 代表完全背包情况: dp[i][j] = max(dp[i - 1][j], dp[i][j - v] + w)
        // 注意这里的完全背包求的是最大价值 不是选法
        if (s == 0) { 
            for (int j = v; j <= m; j++) dp[j] = max(dp[j], dp[j - v] + w);
        } else {
            // 剩余的情况为 0-1背包或者多重背包，而多重背包可以转化为 0-1背包 因此一起处理
            // 0-1背包的物品数量为 1
            if (s == -1) s = 1;
            
            // 多重背包二进制优化 分堆处理
            for (int k = 1; k <= s; k *= 2) {
                for (int j = m; j >= k * v; j --) {
                    dp[j] = max(dp[j], dp[j - k * v] + k * w);
                }
                s -= k;
            }
            // 这边涵盖了 0-1背包 以及多重背包剩余未分堆物品(自成一堆)的情况
            if (s) {
                for (int j = m; j >= s * v; j --) {
                    dp[j] = max(dp[j], dp[j - s * v] + s * w);
                }
            }
        }
    }
    cout << dp[m];
    
    return 0;
}
```

##### 背包最优方案数量

![BestWayNum](BestWayNum.png)

```c++
#include <iostream>
#include <algorithm>
#include <cstring>
using namespace std;

const int mod = 1e9+7;
const int N = 1010;
const int V = 1010;

int dp[V];
int g[V];
int n, m;
int v[N], w[N];

int main() {
    cin >> n >> m;
    for (int i = 1; i <= n; i++) cin >> v[i] >> w[i];
    
    g[0] = 1;
    
    for (int i = 1; i <= n; i++) {
        for (int j = m; j >= v[i]; j--) {
            int maxv = max(dp[j], dp[j - v[i]] + w[i]);
            int cnt = 0;
            if (maxv == dp[j - v[i]] + w[i]) cnt += g[j - v[i]];
            if (maxv == dp[j]) cnt += g[j];
            g[j] = cnt % mod;
            dp[j] = maxv;
        }
    }
    
    int res = 0;
    for (int j = 0; j <= m; j++) {
        res = max(res, dp[j]);
    }
    
    int cnt = 0;
    for (int j = 0; j <= m; j++) {
        if (dp[j] == res) cnt = (cnt + g[j]) % mod;
    }
    
    cout << cnt << endl;
    
    return 0;
}
```

##### 贪心推公式 + DP
![EnergyStone](EnergyStone.png)

- 最重要的部分在于说要推出公式：
- 考虑两个相邻的不会耗为 ```0``` 的能量石```(i, i + 1)```：
  - 先吃 ```i```，其能量为： $E_i + E_{i+1} - S_i * L_{i+1}$
  - 先吃 ```i+1```，其能量为：$E_{i+1} + E_i - S_{i+1} * L_i$
- 可以发现前两项相等，只有最后一项不能，当$S_i * L_{i+1} < S_{i+1} * L_i$时先吃```i```更好
- 移项后即为$\frac{S_i}{L_i} < \frac{S_{i+1}}{L_{i+1}}$
- 那么可以证明的是：当所有能量石按照$\frac{S}{L}$从小到大排序才可能得到最优解（最优解至少一定是按此顺序）
- 证明：若不是从小到大排序，那么考虑其中一对相邻的```(m,m+1)```，但是$\frac{S_m}{L_m} > \frac{S_{m+1}}{L_{m+1}}$
  那么，将二者调换顺序可以发现得到一个更优的解。如此往复，可以发现所有能量石从小到大排序是最优解存在的子集

```c++
#include <iostream>
#include <algorithm>
#include <cstring>
using namespace std;

const int N = 100010;

int n;
struct Stone {
    int S;
    int E;
    int L;
    

    // 重载 <
    bool operator< (const Stone &W) const {
        return S * W.L < L * W.S;
    }
}stone[N];

int dp[N]; // dp[j] 这里定义为恰好使用 j 时间的情况下最优解
           // 因为后续状态转移需要用到时间来计算（此时需要确定的时间，即恰好）

int main() {
    int T;
    cin >> T;
    for(int t = 1; t <= T; t++) {
        cin >> n;
        int m = 0;
        for (int i = 0; i < n; i++) {
            cin >> stone[i].S >> stone[i].E >> stone[i].L;
            m += stone[i].S;
        }
        
        // 贪心排序
        sort(stone, stone + n);
        
        // dp数组的定义为“恰好” 需要初始化为负无穷，dp[0] 价值为 0
        memset(dp, -0x3f, sizeof(dp));
        dp[0] = 0;
        
        for (int i = 0; i < n; i++) {
            int s = stone[i].S, l = stone[i].L, e = stone[i].E;
            for (int j = m; j >= s; j--) 
                dp[j] = max(dp[j], dp[j - s] + e - (j - s) * l);
        }
        
        int res = 0;
        for (int j = 0; j <= m; j++) res = max(res, dp[j]);
        
        cout << "Case #" << t << ": " << res << endl;
        
    }
    
    return 0;
}
```