---
title: os-code-introduction
date: 2024-06-26 10:36:24
tags: Operation System
categories: Operation System
mathjax: true
---

**All code is taken from NJU-2024-operation-system by jyy.**
please check [https://jyywiki.cn/OS/2024/](https://jyywiki.cn/OS/2024/)


forked-code：
[https://github.com/Cookiecoolkid/jyyos/tree/master/introduction](https://github.com/Cookiecoolkid/jyyos/tree/master/introduction)

<!--more-->

## logisim ⭐️⭐️

- 本示例用代码模拟 logisim 数字电路的功能. 详细代码见 *introduction* 分支下的 *logisim* 
- logisim 中的主要用到 *reg*, *wire* 类型的变量：
```c
// Wires
// A wire in digital circuits is used to connect different components
// together, allowing the transmission of electrical signals between them.
// A wire is represented as a boolean value (true or false), which
// corresponds to high (1) and low (0) voltage levels in a real circuit.
typedef bool wire;

// Flip-flops
// A basic memory element in digital circuits, capable of storing one bit
// of data. It has an input and an output (wires), and it maintains its
// output value until the input changes and a clock signal is received.
typedef struct {
    bool value;  // The current value stored in the flip-flop
    wire *in;    // Pointer to the input wire
    wire *out;   // Pointer to the output wire
} reg;
```

*wire* 被定义为 *bool* 类型，表示电路中的高低电压，*reg* 用于存储一个比特的数据，有输入输出端口.

而数字电路中还需要有逻辑门，定义如下：
```c
// Logical gates from NAND
// NAND gate is a fundamental building block in digital electronics. Using
// NAND gates, one can construct any other logical operation.

// NAND gate: Returns true unless both inputs are true.
#define NAND(X, Y)  (!((X) && (Y)))

// NOT gate: Inverts the input.
#define NOT(X)      (NAND(X, 1))

// AND gate: Returns true only if both inputs are true.
#define AND(X, Y)   (NOT(NAND(X, Y)))

// OR gate: Returns true if at least one input is true.
#define OR(X, Y)    (NAND(NOT(X), NOT(Y)))
```

示例代码即可模拟如下的电路：
![logisim](logisim.png)

Code:
```c
    X1 = AND(NOT(X), Y);
    Y1 = NOT(OR(X, Y));
    A = D = E = NOT(Y);
    B = 1;
    C = NOT(X);
    F = Y1;
    G = X;

    // 2. Edge triggering: Lock values in the flip-flops
    b0.value = *b0.in;
    b1.value = *b1.in;
    *b0.out = b0.value;
    *b1.out = b1.value;
```
每当时钟周期到来的时候，将输入的值存储到 *reg* 中，然后输出到 *wire* 中，各个*wire*的值就会根据逻辑门的定义进行计算.

由此，某种意义上，计算机系统就是可以直接由此构造出来.

> Everything is a State Machine.

只需要用数字电路模拟出如下部件:
- REG
- CSR
- Memory
就可以完整表示一个 CPU State. 而每一次需要计算下一步状态即可，这就是一个小的 CPU 模型.
可以见下一节 *mini-rv32ima* 的代码.

## mini-rv32ima ⭐️⭐️⭐️

本节代码是一个简单的 RISC-V CPU 模型，详细代码见 *introduction* 分支下的 *mini-rv32ima*

执行如下命令

```bash
$ make mini-rv32ima
$ ./mini-rv32ima ./bin/fib.rv32i-bin 10
```

即可在 *a0* 寄存器中得到斐波那契数列的第 10 项数值.

![mini-rv32ima-1](mini-rv32ima-1.png)

*CPU-State* 的定义如下:

```c
struct CPUState {
    // Processor internal state
    uint32_t regs[32], csrs[CSR_COUNT];

    // Memory state
    uint8_t *mem;
    uint32_t mem_offset, mem_size;
};
```
*REG* 和 *CSR* 用枚举类型表示:

```c
enum RV32IMA_REG {...};
enum RV32IMA_CSR {...};
```

> Everything is a State Machine. :smile:

因此，只需要定义好 *CPU-State* 的结构，然后定义好 *CPU* 的状态转移函数即可.

```c
static inline int32_t rv32ima_step(struct CPUState *state, uint32_t elapsedUs);
```

其中每一次 *step* 函数的调用，就是一个时钟周期的过程，即一个状态的转移.
共可能有以下几种状态转移:
- Traps
- Timer interrupts
- run instructions

Traps 和 Timer interrupts 都是通过修改 *CSR* 来实现状态迁移：

```c
cycle_end:
    // Handle traps and interrupts.
    if (trap) {
        if (trap & 0x80000000) { // It's an interrupt, not a trap.
            CSR(MCAUSE) = trap;
            CSR(MTVAL) = 0;
            pc += 4; // PC needs to point to where the PC will return to.
        } else {
            CSR(MCAUSE) = trap - 1;
            CSR(MTVAL) = (trap > 5 && trap <= 8) ? rval : pc;
        }
        CSR(MEPC) = pc;
        // On an interrupt, the system moves current MIE into MPIE
        CSR(MSTATUS) = ((CSR(MSTATUS) & 0x08) << 4) | ((CSR(EXTRAFLAGS) & 3) << 11);
        pc = (CSR(MTVEC) - 4);

        // If trapping, always enter machine mode.
        CSR(EXTRAFLAGS) |= 3;

        trap = 0;
        pc += 4;
    }

    if (CSR(CYCLEL) > cycle)
        CSR(CYCLEH)++;
    CSR(CYCLEL) = cycle;
    CSR(PC) = pc;
    return 0;
```

执行指令的过程即抽象为如下代码：


```c
    // 1. Fetch instruction
    uint32_t instr = rv32ima_fetch(state);

    // 2. Decode instruction
    struct RV32IMA_DecodeResult decode = rv32ima_decode(instr);

    // 3. Execute instruction
    struct RV32IMA_ExecResult exec = rv32ima_exec(state, decode);

    // 4. Write back result
    rv32ima_writeback(state, decode, exec);
```

## minimal ⭐️⭐️⭐️

- 平时所写的应用程序通过编译汇编链接后，所形成的可执行文件用 *objdump* 查看，可以看到其中链接了很多的代码，那么如何实现一个最小的可执行文件？
- 指令集并没有提供推出应用程序的指令，应用程序如何退出？

答案就在于**syscall**指令.

*minimal.S* 的代码如下：

```c
#include <sys/syscall.h>

// The x86-64 system call Application Binary Interface (ABI):
//     System call number: RAX
//     Arguments: RDI, RSI, RDX, RCX, R8, R9
//     Return value: RAX
// See also: syscall(2) syscalls(2)

#define syscall3(id, a1, a2, a3) \
    movq $SYS_##id, %rax; \
    movq $a1, %rdi; \
    movq $a2, %rsi; \
    movq $a3, %rdx; \
    syscall

#define syscall2(id, a1, a2)  syscall3(id, a1, a2, 0)
#define syscall1(id, a1)  syscall2(id, a1, 0)

.globl _start
_start:
    syscall3(write, 1, addr1, addr2 - addr1)
    syscall1(exit, 1)

addr1:
    .ascii "\033[01;31mHello, OS World\033[0m\n"
addr2:
```

输入如下命令后：
    
```bash
$ make minimal
$ objdump -d minimal
```
得到：
    
```bash
    
minimal:     file format elf64-x86-64


Disassembly of section .text:

0000000000401000 <_start>:
  401000:	48 c7 c0 01 00 00 00 	mov    $0x1,%rax
  401007:	48 c7 c7 01 00 00 00 	mov    $0x1,%rdi
  40100e:	48 c7 c6 3c 10 40 00 	mov    $0x40103c,%rsi
  401015:	48 c7 c2 1c 00 00 00 	mov    $0x1c,%rdx
  40101c:	0f 05                	syscall 
  40101e:	48 c7 c0 3c 00 00 00 	mov    $0x3c,%rax
  401025:	48 c7 c7 01 00 00 00 	mov    $0x1,%rdi
  40102c:	48 c7 c6 00 00 00 00 	mov    $0x0,%rsi
  401033:	48 c7 c2 00 00 00 00 	mov    $0x0,%rdx
  40103a:	0f 05                	syscall 

000000000040103c <addr1>:
  40103c:	1b 5b 30             	sbb    0x30(%rbx),%ebx
  40103f:	31 3b                	xor    %edi,(%rbx)
  401041:	33 31                	xor    (%rcx),%esi
  401043:	6d                   	insl   (%dx),%es:(%rdi)
  401044:	48                   	rex.W
  401045:	65 6c                	gs insb (%dx),%es:(%rdi)
  401047:	6c                   	insb   (%dx),%es:(%rdi)
  401048:	6f                   	outsl  %ds:(%rsi),(%dx)
  401049:	2c 20                	sub    $0x20,%al
  40104b:	4f 53                	rex.WRXB push %r11
  40104d:	20 57 6f             	and    %dl,0x6f(%rdi)
  401050:	72 6c                	jb     4010be <addr2+0x66>
  401052:	64 1b 5b 30          	sbb    %fs:0x30(%rbx),%ebx
  401056:	6d                   	insl   (%dx),%es:(%rdi)
  401057:	0a                   	.byte 0xa
```

可以看到，*minimal* 可执行文件中只有两个系统调用，一个是 *write* 一个是 *exit*. 这就是最小的可执行文件:smile:

### strace

事实上，任意一个程序本质上都是和 *minimal* 一样，都是状态的迁移以及 *syscall* 的调用.
而 *strace* 命令可以很好查看程序的系统调用，如下：

```bash
$ strace ./minimal
```

## hanoi ⭐️⭐️⭐️

- 汉诺塔问题是一个经典的递归问题，但是如何将递归的问题转化为迭代的问题？

> Everything is a State Machine.

C 程序本质也是一个状态机：
![hanoi-1](hanoi-1.png)

那么非递归的汉诺塔的状态即为：
```c
struct Frame {
    // Each frame has a program counter to keep track its next
    // to-be-executed statement.
    int pc;

    // The internal state of the frame. This state includes
    // both arguments and local variables (if any).
    //
    // Arguments:
    int n;
    char from, to, via;

    // Local variables:
    int c1, c2;
};
```
- 每一个栈帧都有自己的 *pc* 记录下一步的执行指令(即会记录函数返回后的下一步指令地址)
- 每一个栈帧有自己的变量数值，包括参数和局部变量.

那么函数调用实际上就是新增一个栈帧，函数返回就是去除一个栈帧：

```c
int hanoi(int n, char from, char to, char via) {
    Frame stk[64];
    Frame *top = stk - 1;

    // Function call: push a new frame (PC=0) onto the stack
    #define call(...) ({ *(++top) = (Frame){.pc = 0, __VA_ARGS__}; })
    
    // Function return: pop the top-most frame
    #define ret(val) ({ top--; retval = (val); })


    // The last function-return's value. It is not obvious
    // that we only need one retval.
    int retval = 0;

    // The initial call to the recursive function
    call(n, from, to, via);

    while (1) {
        // Fetch the top-most frame.
        Frame *f = top;
        if (top < stk) {
            // No top-most frame any more; we're done.
            break;
        }

        // Jumps may change this default next pc.
        int next_pc = f->pc + 1;

        // Single step execution.

        // Extract the parameters from the current frame. (It's
        // generally a bad idea to reuse variable names in
        // practice; but we did it here for readability.)
        int n = f->n, from = f->from, to = f->to, via = f->via;

        switch (f->pc) {
            case 0:
                if (n == 1) {
                    printf("%c -> %c\n", from, to);
                    ret(1);
                }
                break;
            case 1: call(n - 1, from, via, to); break;
            case 2: f->c1 = retval; break;
            case 3: call(1, from, to, via); break;
            case 4: call(n - 1, via, to, from); break;
            case 5: f->c2 = retval; break;
            case 6: ret(f->c1 + f->c2 + 1); break;
            default: assert(0);
        }

        f->pc = next_pc;
    }

    return retval;
}
```

### 状态机视角下的编译器

- 高级语言(C) = 状态机 (栈 + 变量数值)
- 汇编代码(汇编指令) = 状态机 (REG + CSR + Memory)
- 编译器 = 状态机之间的翻译器

### 状态机视角下的编译优化

只要编译前与编译后输出的系统调用序列完全一致，那么编译器做的优化就是正确的.

## os-model ⭐️⭐️⭐️

在本实验之下，用三十多行 *python* 代码实现了一个简单的操作系统模型，其中只包含*spawn*，*read*，*write* 三个系统调用.

- *spawn*：创建一个新的进程
- *read*：读取一个字符
- *write*：写入一个字符

其中用到了 *generator* 的概念，即每一个进程都是一个 *generator* 对象，每一次调用 *step* 函数，都会执行到下一个系统调用.

此简易的模型就包含了操作系统最重要的特性：
- 进程
- 系统调用
- 上下文切换
- 调度

```python
#!/usr/bin/env python3

import sys
import random
from pathlib import Path

class OS:
    SYSCALLS = ['read', 'write', 'spawn']

    class Process:
        def __init__(self, func, *args):
            # func should be a generator function. Calling
            # func(*args) returns a generator object.
            self._func = func(*args)

            # This return value is set by the OS's main loop.
            self.retval = None

        def step(self):
            '''
            Resume the process with OS-written return value,
            until the next system call is issued.
            '''
            syscall, args, *_ = self._func.send(self.retval)
            self.retval = None
            return syscall, args

    def __init__(self, src):
        # This is a hack: we directly execute the source
        # in the current Python runtime--and main is thus
        # available for calling.
        exec(src, globals())
        self.procs = [OS.Process(main)]
        self.buffer = ''

    def run(self):
        while self.procs:
            current = random.choice(self.procs)

            try:
                # Operating systems handle interrupt and system
                # calls, and "assign" CPU to a process.
                match current.step():
                    case 'read', _:
                        current.retval = random.choice([0, 1])
                    case 'write', s:
                        self.buffer += s
                    case 'spawn', (fn, *args):
                        self.procs += [OS.Process(fn, *args)]
                    case _:
                        assert 0

            except StopIteration:
                # The generator object terminates.
                self.procs.remove(current)

        return self.buffer

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(f'Usage: {sys.argv[0]} file')
        exit(1)

    src = Path(sys.argv[1]).read_text()

    # Hack: patch sys_read(...) -> yield "sys_read", (...)
    for syscall in OS.SYSCALLS:
        src = src.replace(f'sys_{syscall}',
                          f'yield "{syscall}", ')

    stdout = OS(src).run()
    print(stdout)
```

## mosiac(model-checker) ⭐️⭐️
实现较复杂，详细代码见 *introduction* 分支下的 *mosaic*.

由于操作系统的存在，不同进度的随机调度以及 IO，使得操作系统的正确性难以验证，因此需要一种模型检测的方法. *mosaic* 就是一个简单的模型检测器，通过将程序的运行过程抽象为 *graph*，然后通过 *BFS* 遍历所有可能的状态，来验证程序的正确性.

目前其包含的系统调用有：

```python
## 1. Mosaic system calls

### 1.1 Process, thread, and context switching

sys_fork = lambda: os.sys_fork()
sys_spawn = lambda fn, *args: os.sys_spawn(fn, *args)
sys_sched = lambda: os.sys_sched()

### 1.2 Virtual character device

sys_choose = lambda choices: os.sys_choose(choices)
sys_write = lambda *args: os.sys_write(*args)

### 1.3 Virtual block storage device

sys_bread = lambda k: os.sys_bread(k)
sys_bwrite = lambda k, v: os.sys_bwrite(k, v)
sys_sync = lambda: os.sys_sync()
sys_crash = lambda: os.sys_crash()
```
其输出结果是 *graph* 中的 *vertice* 和 *edge*，即每一个状态以及状态之间的转移的一个类似 json 的输出，可以将其 *pipe* 给各种工具得到更好的可读性以及应用.