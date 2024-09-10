---
title: os-code-concurrency
date: 2024-06-26 16:32:08
tags: Operation System
categories: Operation System
mathjax: true
---

**All code is taken from NJU-2024-operation-system by jyy.**
please check [https://jyywiki.cn/OS/2024/](https://jyywiki.cn/OS/2024/)


forked-code：
[https://github.com/Cookiecoolkid/jyyos/tree/master/concurrency](https://github.com/Cookiecoolkid/jyyos/tree/master/concurrency)

<!--more-->

## thread-lib ⭐️⭐️⭐️

```c
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <assert.h>
#include <unistd.h>
#include <pthread.h>

#define LENGTH(arr) (sizeof(arr) / sizeof(arr[0]))

enum {
    T_FREE = 0, // This slot is not used yet.
    T_LIVE,     // This thread is running.
    T_DEAD,     // This thread has terminated.
};

struct thread {
    int id;  // Thread number: 1, 2, ...
    int status;  // Thread status: FREE/LIVE/DEAD
    pthread_t thread;  // Thread struct
    void (*entry)(int);  // Entry point
};

static struct thread threads_[4096];
static int n_ = 0;

// This is the entry for a created POSIX thread. It "wraps"
// the function call of entry(id) to be compatible to the
// pthread library's requirements: a thread takes a void *
// pointer as argument, and returns a pointer.
static inline
void *wrapper_(void *arg) {
    struct thread *t = (struct thread *)arg;
    t->entry(t->id);
    return NULL;
}

// Create a thread that calls function fn. fn takes an integer
// thread id as input argument.
static inline
void create(void *fn) {
    assert(n_ < LENGTH(threads_));

    // Yes, we have resource leak here!
    threads_[n_] = (struct thread) {
        .id = n_ + 1,
        .status = T_LIVE,
        .entry = fn,
    };
    pthread_create(
        &(threads_[n_].thread),  // a pthread_t
        NULL,  // options; all to default
        wrapper_,  // the wrapper function
        &threads_[n_] // the argument to the wrapper
    );
    n_++;
}

// Wait until all threads return.
static inline
void join() {
    for (int i = 0; i < LENGTH(threads_); i++) {
        struct thread *t = &threads_[i];
        if (t->status == T_LIVE) {
            pthread_join(t->thread, NULL);
            t->status = T_DEAD;
        }
    }
}

__attribute__((constructor)) 
static void startup() {
    atexit(join);
}
```
这段代码是对线程的简易封装，提供了创建线程和等待线程结束的接口：
- `create`：创建一个线程，传入一个函数指针，函数指针的参数是线程的id
- `join`：等待所有线程结束

## Peterson 算法 ⭐️⭐️

```c
#define FALSE 0
#define TRUE 1
#define N 2 // 线程数量

int turn;
int flag[N] = {FALSE, FALSE};

void enter_region(int process) { // process是线程编号，0或1
    int other = 1 - process; // 计算另一个线程的编号
    flag[process] = TRUE; // 表明意图
    turn = other; // 让步
    while (flag[other] == TRUE && turn == other); // 等待
}

void leave_region(int process) { // 离开临界区
    flag[process] = FALSE; // 清除意图
}
```

- 适用于两个线程的互斥问题
- 先举起自己的旗子，表明自己要进入临界区，然后让步，若是观察到对方没有举起旗子或者轮到自己了(`turn != other`)，则进入临界区


## atomic_xchg 自旋锁 ⭐️⭐️⭐️

- 若是只有原子的读和写，是很难实现互斥的.
- 因此硬件提供了`xchg`指令，可以原子地进行一步读和写(交换)
  
```c
int status = ✅;

void lock() {
retry:
    int got = atomic_xchg(&status, ❌);
    if (got != ✅) {
        goto retry;
    }
}

void unlock() {
    atomic_xchg(&status, ✅);
}
```

## 内核中的自旋锁 ⭐️⭐️⭐️

```c
void spin_lock(spinlock_t *lk) {
    // Disable interrupts to avoid deadlock.
    push_off();

    // This is a deadlock.
    if (holding(lk)) {
        panic("acquire %s", lk->name);
    }

    // This our main body of spin lock.
    int got;
    do {
        got = atomic_xchg(&lk->status, LOCKED);
    } while (got != UNLOCKED);

    lk->cpu = mycpu;
}

void spin_unlock(spinlock_t *lk) {
    if (!holding(lk)) {
        panic("release %s", lk->name);
    }

    lk->cpu = NULL;
    atomic_xchg(&lk->status, UNLOCKED);

    pop_off();
}
```
- 此处 push_off 和 pop_off 是每个 CPU 各自记录中断状态的函数
- 当一个 CPU 拿到锁时，会将中断关闭，以避免死锁
- 当此 CPU 所有的锁都释放后(均 `pop`)，才会将中断打开

## 应用程序的互斥 ⭐️⭐️

- 当一个应用程序持有锁的时候，其他任何想获得这把锁的应用程序都会自旋，此时若该应用程序发生了中断，其他应用程序会一直自旋浪费资源.
- 试图将这把锁"让"出去，让其他应用程序在自己中断时有机会获得这把锁.

此时`lock`有两种情况：
- Fast Path: 自旋一次成功得到锁，进入临界区.
- Slow Path: 自旋一次失败，请求`syscall`系统调用 `futex`，将自己挂起，等待锁释放.


## 生产者消费者问题(条件变量) ⭐️⭐️⭐️⭐️

```c
#include <thread.h>
#include <thread-sync.h>

int n, depth = 0;
mutex_t lk = MUTEX_INIT();
cond_t cv = COND_INIT();
 
#define CAN_PRODUCE (depth < n)
#define CAN_CONSUME (depth > 0)

void T_produce() {
    while (1) {
        mutex_lock(&lk);

        while (!CAN_PRODUCE) {
            cond_wait(&cv, &lk);
            // We are here if the thread is being waked up, with
            // the mutex being acquired. Then we check once again,
            // and move out of the loop if CAN_PRODUCE holds.
        }

        // We still hold the mutex--and we check again.
        assert(CAN_PRODUCE);

        printf("(");
        depth++;

        cond_broadcast(&cv);
        mutex_unlock(&lk);
    }
}

void T_consume() {
    while (1) {
        mutex_lock(&lk);

        while (!CAN_CONSUME) {
            cond_wait(&cv, &lk);
        }

        printf(")");
        depth--;

        cond_broadcast(&cv);
        mutex_unlock(&lk);
    }
}
```
- `producer`和`consumer`线程运行的条件不同
  - `CAN_PRODUCE`：`depth < n`
  - `CAN_CONSUME`：`depth > 0`
- 若要正确实现同步：
  - 使用两个条件变量`cv`和`lk`.(但更复杂，`signal`和`broadcast`的使用也需要甄别，易出现 bug)
  - 或者就是如上述代码展示，只用一个条件变量`cv`和一个互斥锁`lk`与`broadcast`相配合(并且要注意使用的是 `while` 循环)，但这样会有稍微降低性能，因为`broadcast`会唤醒所有线程，而`signal`只唤醒一个线程.

## 信号量 ⭐️⭐️⭐️

- 能计数的互斥锁.
- `P`操作：`wait`(`acquire`)，`V`操作：`signal`(`release`)
- 当信号量的数量为 1 时，就是互斥锁
- 信号量 80% 的应用场景是相当于互斥锁(但可以在一个线程获取，另一个线程释放，而互斥锁只能在同一个线程获取和释放)
- 信号量 20% 的应用场景是用于控制资源的数量，如线程池(进行计数)

### 信号量实现生产者消费者问题

```c
#include <thread.h>
#include <thread-sync.h>

sem_t fill, empty;

void T_produce() {
    while (1) {
        // Needs an empty slot for producing.
        P(&empty);

        printf("(");

        // Creates a filled slot.
        V(&fill);
    }
}

void T_consume() {
    while (1) {
        // Needs a filled slot for consuming.
        P(&fill);

        printf(")");
        
        // Creates an empty slot.
        V(&empty);
    }
}

int main(int argc, char *argv[]) {
    assert(argc == 2);

    // Initially, 0 filled, n empty
    SEM_INIT(&fill, 0);
    SEM_INIT(&empty, atoi(argv[1]));

    for (int i = 0; i < 8; i++) {
        create(T_produce);
        create(T_consume);
    }
}
```

## 哲学家就餐问题 ⭐️⭐️

- 下面的代码存在死锁

```c
void Tphilosopher(int id) {
    int lhs = (id + N - 1) % N;
    int rhs = id % N;

    while (1) {
        // Come to table
        // P(&table);

        P(&avail[lhs]);
        printf("+ %d by T%d\n", lhs, id);
        P(&avail[rhs]);
        printf("+ %d by T%d\n", rhs, id);

        // Eat.
        // Philosophers are allowed to eat in parallel.

        printf("- %d by T%d\n", lhs, id);
        printf("- %d by T%d\n", rhs, id);
        V(&avail[lhs]);
        V(&avail[rhs]);

        // Leave table
        // V(&table);
    }
}
```

