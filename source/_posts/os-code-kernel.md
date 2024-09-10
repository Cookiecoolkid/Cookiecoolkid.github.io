---
title: os-code-kernel
date: 2024-06-28 16:08:05
tags: Operation System
categories: Operation System
mathjax: true
---

**All code is taken from NJU-2024-operation-system by jyy.**
please check [https://jyywiki.cn/OS/2024/](https://jyywiki.cn/OS/2024/)


forked-code：
[https://github.com/Cookiecoolkid/jyyos/tree/master/kernel](https://github.com/Cookiecoolkid/jyyos/tree/master/kernel)

<!--more-->

## thread-os ⭐️⭐️⭐️
```c
#include <am.h>
#include <klib.h>
#include <klib-macros.h>

typedef union thread {
    struct {
        const char    *name;
        void          (*entry)(void *);
        Context       context;
        union thread  *next;
        char          end[0];
    };
    uint8_t stack[8192];
} Thread;

void T1(void *);
void T2(void *);
void T3(void *);

Thread threads[] = {
    // Context for the bootstrap code:
    { .name = "_", .entry = NULL, .next = &threads[1] },

    // Thread contests:
    { .name = "1", .entry = T1, .next = &threads[2] },
    { .name = "2", .entry = T2, .next = &threads[3] },
    { .name = "3", .entry = T3, .next = &threads[1] },
};
Thread *current = &threads[0];

Context *on_interrupt(Event ev, Context *ctx) {
    // Save context.
    current->context = *ctx;

    // Thread schedule.
    current = current->next;

    // Restore current thread's context.
    return &current->context;
}

int main() {
    cte_init(on_interrupt);

    for (int i = 1; i < LENGTH(threads); i++) {
        Thread *t = &threads[i];
        t->context = *kcontext(
            // a Thread object:
            // +--------------------------------------------+
            // | name, ... end[0] | Kernel stack ...        |
            // +------------------+-------------------------+
            // ^                  ^                         ^     
            // t                  &t->end                   t + 1
            (Area) { .start = &t->end, .end = t + 1, },
            t->entry, NULL
        );
    }

    yield();
    assert(0);  // Never returns.
}


void delay() {
    for (int volatile i = 0;
         i < 10000000; i++);
}

void T1(void *arg) { while (1) { putch('A'); delay(); } }
void T2(void *arg) { while (1) { putch('B'); delay(); } }
void T3(void *arg) { while (1) { putch('C'); delay(); } }
```


- 这是一个最简易的 `os` 模型.
- 通过 `on_interrupt` 函数实现了线程的调度. 
- 借助 `abstract machine` 的 `Context` 结构体以及 `yield` 函数实现了线程的切换. `AM` 项目在 `NJU ProjectN` 项目中可以找到.


## xv6-riscv ⭐️⭐️⭐️⭐️⭐️

- 特别精简但完整的操作系统实现，适合读源码学习.
- 很重要.

Makefile 下载 xv6-riscv 项目并提供了 python 调试脚本

```makefile
xv6-riscv:
	git clone https://github.com/mit-pdos/xv6-riscv.git

debug:
	gdb-multiarch -x init.py
```

```python
import gdb
import re

R = {}

def stop_handler(event):
    if isinstance(event, gdb.StopEvent):
        regs = [
            line for line in 
                gdb.execute('info registers',
                            to_string=True).
                            strip().split('\n')
        ]
        for line in regs:
            parts = line.split()
            key = parts[0]

            if m := re.search(r'(\[.*?\])', line):
                val = m.group(1)
            else:
                val = parts[1]

            if key in R and R[key] != val:
                print(key, R[key], '->', val)
            R[key] = val

gdb.events.stop.connect(stop_handler)

gdb.execute('set confirm off')
gdb.execute('set architecture riscv:rv64')
gdb.execute('target remote 127.0.0.1:26000')
gdb.execute('symbol-file xv6-riscv/kernel/kernel')
gdb.execute('set riscv use-compressed-breakpoints yes')

# Set a breakpoint on trampoline
# All user traps go here.
gdb.execute('hb *0x3ffffff000')

# User program entry
gdb.execute('hb *0x0')
```

- To be continued...

