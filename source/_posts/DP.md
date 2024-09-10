---
title: DP
date: 2024-09-02 09:26:24
tags: AcWing
categories: [Algorithm]
---

#### 动态规划
- 状态表示(思考维度 如二维f[i][j])
  - 集合：f[i][j] 表示哪些情况
  - 属性：f[i][j] 表示集合里的 MAX/MIN/数量
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

##### 多重背包 + 单调队列 + 一维数组

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