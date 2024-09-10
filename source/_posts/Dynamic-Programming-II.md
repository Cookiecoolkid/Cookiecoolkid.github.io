---
title: Dynamic Programming II
date : 2024-09-19 14:59:30
tags : 
- AcWing
- Algorithm
categories: 
- Algorithm
mathjax: true
---

- 状态机模型 💡
<!--more-->

## 状态机模型

![StateMachine1](StateMachine1.png)

- ```0``` 表示当前没有选择盗窃
- ```1``` 表示当前选择盗窃

![Draw1](Draw1.png)

```cpp
#include <iostream>
#include <cstring>
using namespace std;

const int INF = 0x3f3f3f3f;
const int N = 100010;
int T;
int dp[N][2];
int w[N];
int n;

int main() {
    cin >> T;
    
    while (T --) {
        memset(dp, 0, sizeof(dp));
        cin >> n;
        for (int i = 1; i <= n; i++ ) cin >> w[i];
        
        dp[0][0] = 0;
        dp[0][1] = -INF;
        
        for (int i = 1; i <= n; i++) {
            dp[i][0] = max(dp[i - 1][0], dp[i - 1][1]);
            dp[i][1] = dp[i - 1][0] + w[i];
        }
        
        cout << max(dp[n][0], dp[n][1]) << endl;
    }
    
    return 0;
}
```

![StateMachine2](StateMachine2.png)

- ```0```表示不持有股票
- ```1```表示持有股票

![Draw2](Draw2.png)

- 由于本题还有限制最大交易次数，所以需要增加一个维度

```cpp
#include <iostream>
#include <cstring>
using namespace std;

const int N = 100010;
const int M = 110;
const int INF = 0x3f3f3f3f;
int dp[N][M][2];
int n, k;
int w[N];

int main() {
    cin >> n >> k;
    
    for (int i = 1; i <= n; i++) cin >> w[i];
    
    memset(dp, -0x3f, sizeof(dp));
    for (int i = 0; i <= n; i++) dp[i][0][0] = 0;
    
    for (int i = 1; i <= n; i ++) {
        for (int j = 1; j <= k; j ++) {
            dp[i][j][0] = max(dp[i - 1][j][0], dp[i - 1][j][1] + w[i]);
            dp[i][j][1] = max(dp[i - 1][j][1], dp[i - 1][j - 1][0] - w[i]);
        }
    }
    
    int res = 0;
    for (int i = 1; i <= k; i++) res = max(res, dp[n][i][0]);
    cout << res;
}
```

![StateMachine3](StateMachine3.png)

![Draw3](Draw3.png)

- ```0```表示不持有股票，且不在冷冻期
- ```1```表示持有股票
- ```2```表示不持有股票，且在冷冻期

```cpp
#include <iostream>
#include <cstring>
#include <algorithm>

using namespace std;

const int N = 100010;
const int INF = 0x3f3f3f3f;

int n;
int w[N];
int dp[N][3];

int main() {
    cin >> n;
    for (int i = 1; i <= n; i++) {
        cin >> w[i];
    }
    memset(dp, -0x3f, sizeof(dp));
    dp[0][0] = 0;
    
    for (int i = 1; i <= n; i++) {
        dp[i][0] = max(dp[i - 1][0], dp[i - 1][2]);
        dp[i][1] = max(dp[i - 1][0] - w[i], dp[i - 1][1]);
        dp[i][2] = dp[i - 1][1] + w[i];
    }
    
    cout << max(dp[n][0], dp[n][2]);
    
    return 0;
}
```

![StateMachine4](StateMachine4.png)

- 一看到 ```KMP``` 就 PTSD
- 详解看 [https://www.acwing.com/solution/content/55449/](https://www.acwing.com/solution/content/55449/)
- ```dp[i + 1][ptr] = (dp[i + 1][ptr] + dp[i][j]) % mod;``` 因为每一次匹配操作最多只会增加一个字符，因此对于考虑```(i+1)```长度时的最大匹配后缀的```ptr```与```(i)```长度时的最大匹配后缀```j```仅下面三种情况: 
  - ptr = 0
  - ptr = j
  - ptr = j + 1

```cpp
#include <iostream>
#include <algorithm>
#include <cstring>

using namespace std;

const int N = 55, mod = 1e9 + 7;
int dp[N][N];
int n, m;
char s[N];
int ne[N];
    
int main() {
    cin >> n >> s + 1;
    m = strlen(s + 1);
    
    for (int i = 2, j = 0; i <= m; i++) {
        while (j && s[i] != s[j + 1]) j = ne[j];
        if (s[i] == s[j + 1]) j++;
        ne[i] = j;
    }
    
    dp[0][0] = 1;
    
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            for (int k = 'a'; k <= 'z'; k++) {
                int ptr = j;
                while (ptr && s[ptr + 1] != k) ptr = ne[ptr];
                if (s[ptr + 1] == k) ptr ++;
                
                dp[i + 1][ptr] = (dp[i + 1][ptr] + dp[i][j]) % mod;
            }
        }
    }
    
    int res = 0;
    for (int i = 0; i < m; i++) res = (res + dp[n][i]) % mod;
    
    cout << res << endl;
    
    return 0;
}
```
