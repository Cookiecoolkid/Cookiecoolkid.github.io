---
title: os-review
date: 2024-06-28 23:41:35
tags: Operation System
categories: Operation System
mathjax: true
---

Thank you. Teacher jyy!

<!--more-->

# 一些零碎的知识点 💻

## 死锁产生的必要条件 🚫🔒

- Mutual-exclusion - 一个口袋一个球，得到球才能继续
- Wait-for - 得到球的人想要更多的球
- No-preemption - 不能抢别人的持有的球
- Circular-chain - 形成循环等待球的关系

## 如何避免死锁 🔓

- 给所有锁编号，按编号顺序加锁


> 附 2023 jyyos 期末题目，答案取自 Github Copilot

# os jyy 2023 final exam

> Sakiyary 回忆版，题面不严谨，可能有疏漏，意会即可

## 1. 基本概念

1. system call 与 function call 的区别。
2. data race 的定义。
3. 可执行文件中有什么内容。
4. 文件描述符的解释，写出 5 个 related syscall。
5. 基于闪存的 SSD 有一重大缺陷 “wear out”，解释并给出现代 SSD 的硬件解决方案。

## 2. 进程、线程与地址空间

1. 如何获取已知 pid、正在运行的进程的地址空间信息。
2. `*(int64_t*) main` 会得到什么数据。（原题就是这样，我也没读懂啥意思）
3. （一些铺垫… 说进程可以获取库私有变量）给出一个方案判断 OS 对每一个进程的管理是副本还是写时复制。
4. 在一个没有虚拟地址的 OS 上实现 `fork ()` 时的技术难点与解决方案。

## 3. 编译、链接和加载

1. 如何获得编译器编译 `#include <stdio.h>` 时 `stdio.h` 在文件系统中的实际位置（需要写出两种方法）。
2. 动态链接时如何用代码获取 `printf` 在库函数中的地址（给出基本思路即可）。
3. 加载器在动态链接时为何使用 `mmap` 而不是分配内存后用 `read` 将代码和数据读入内存。
4. 调试器在调试时如何获得一个变量的值（如 `p x` 为何能打印变量 `x` 的值）。

## 4. 并发编程

火箭发射器程序的并发实现，可使用互斥锁 / 信号量 / 条件变量（三者定义已给出）。

有 `n` （已定义）个发射线程，给出部分 `void Tlauncher (int id)` 代码，要求火箭按照 `id` 依次发射，补充其中代码实现线程同步；

````c
void Tlauncher (int id){
  assert (1 <= id && id <= n);
  while (1){
    // TODO
    lauch (id); // 已定义，发射编号为 id 的火箭
    // TODO
  }
}
````

写出在控制线程上的两个函数 `start ()` 与 `stop ()` 的实现，控制发射的启停，即正在发射时可调用 `stop ()` 来停止发射，停止后可调用 `start ()` 从头开始发射，初始时互斥锁可视为未上锁状态。

## 5. 文件系统

1. Everything is file 的优劣；写出不适合文件抽象的 IO 设备。
2. 写出 shell 实现重定向的代码片段（进程、管道、文件描述符相关操作）；解释为何 `sudo echo hello > /etc/hello.txt` 会报错权限不足。
3. FAT 在对文件 Append 写入时会更改两样东西，簇的分配与目录表更新（修改时间与文件大小），FAT 追加写入文件时 OS 发生崩溃（一切写入操作都可能终止）分析崩溃后文件系统一致性的可能情况。