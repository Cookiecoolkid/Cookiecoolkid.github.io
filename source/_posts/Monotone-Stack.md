---
title: Monotone Stack
date: 2024-09-13 11:46:28
tags: 
- OJ
categories: 
- Algorithm
mathjax: true

hidden: true
---

- Advanced-Programming 
- OJ - 1

<!--more-->

![Prob1](Prob1.png)

```c++
#include "problem1.h"

const int N = 60;
const int M = 5;
int a[N][M];
int s[N];
int tt = 0;

void Solution::summer(){
    int ret = 0;
//TODO 在此处补充代码，输入N、K，以及N行 每行5个数字，输出ret表示最终小蓝鲸能获取的最大海岛币数量
    int n, k;
    std::cin >> n >> k;

    ret = k;

    for (int i = 1; i <= n; i++) {
        for (int j = 0; j < M; j++) {
            std::cin >> a[i][j];
        }
    }

    for (int day = 1; day <= n; day++) {
        // 从 i 出发
        int money = ret;
        for (int i = 1; i <= M; i++) {
            for (int j = 0; j < M; j++) {
                while (tt && a[day][s[tt]] > a[day][(j + i) % M]) {
                    int top = s[tt];
                    tt --;
                    int num = 0;
                    int rem = 0;
                    if (tt) {
                        tt = 1;
                        num = (money / a[day][s[tt]]);
                        rem = money % a[day][s[tt]];
                    }
                    ret = std::max(ret, rem + num * a[day][top]);
                }
                s[++tt] = (i + j) % M;
            }
        }
        tt = 0;
    }

    std::cout << ret << std::endl;
}
```

![Prob2](Prob2.png)

```c++
#include "problem1.h"

const int N = 10010;

int stk[N];
int t = 0;
int b[N];
void Solution::winter(){
    int ret = 0;
//TODO 在此处补充代码

    int n; 
    std::cin >> n;
    for (int i = 1; i <= n; i++) std::cin >> b[i];
    for (int i = 1; i <= n; i ++ )
    {
        while (t && b[stk[t]] > b[i]) {
            ret = std::max(ret, b[stk[t]] - b[stk[1]]);
            t -- ;
        }
        stk[ ++ t] = i;
    }

    if (t) ret = std::max(ret, b[stk[t]] - b[stk[1]]);

    std::cout<<ret<<std::endl;
}
```