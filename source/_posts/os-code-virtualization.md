---
title: os-code-virtualization
date: 2024-06-27 16:32:08
tags: Operation System
categories: Operation System
mathjax: true
---

**All code is taken from NJU-2024-operation-system by jyy.**
please check [https://jyywiki.cn/OS/2024/](https://jyywiki.cn/OS/2024/)


forked-code：
[https://github.com/Cookiecoolkid/jyyos/tree/master/virtualization](https://github.com/Cookiecoolkid/jyyos/tree/master/virtualization)

<!--more-->

## PIPE ⭐️⭐️⭐️

- named pipe
- anonymous pipe
- 推荐做课程实验 M5 `sperf`

对于 `named pipe`，我们可以通过 `mkfifo` 系统调用来创建一个命名管道，然后通过 `open` 来打开这个管道(读口采用 `O_RDONLY`，写口采用 `O_WRONLY`)，然后就可以通过 `read` 和 `write` 来进行读写操作。
示例代码：

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <fcntl.h>
#include <sys/stat.h>
#include <unistd.h>
#include <errno.h>

// We also have UNIX domain sockets for local inter-process
// communication--they also have a name in the file system
// like "/var/run/docker.sock". This is similar to a named
// pipe.
#define PIPE_NAME "/tmp/my_pipe"

void pipe_read() {
    int fd = open(PIPE_NAME, O_RDONLY);
    char buffer[1024];

    if (fd == -1) {
        perror("open");
        exit(1);
    }

    // Read from the pipe
    int num_read = read(fd, buffer, sizeof(buffer));
    if (num_read > 0) {
        printf("Received: %s\n", buffer);
    } else {
        printf("No data received.\n");
    }
    close(fd);
}

void pipe_write(const char *content) {
    // Open the pipe for writing
    int fd = open(PIPE_NAME, O_WRONLY);

    if (fd == -1) {
        perror("open");
        exit(1);
    }

    // Write the message to the pipe
    write(fd, content, strlen(content) + 1);
    close(fd);
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        fprintf(stderr, "Usage: %s read|write [message]\n", argv[0]);
        return 1;
    }

    // Create the named pipe if it does not exist
    if (mkfifo(PIPE_NAME, 0666) == -1) {
        if (errno != EEXIST) {
            perror("mkfifo");
            return 1;
        }
    } else {
        printf("Created " PIPE_NAME "\n");
    }

    if (strcmp(argv[1], "read") == 0) {
        pipe_read();
    } else if (strcmp(argv[1], "write") == 0) {
        pipe_write(argv[2]);
    } else {
        fprintf(stderr, "Invalid command. Use 'read' or 'write'.\n");
        return 1;
    }

    return 0;
}
```

对于 `anonymous pipe`，可以通过 `pipe` 系统调用来创建一个匿名管道(读口写口参数为`size = 2`的数组 `int pipefd[2]`)，然后通过 `fork` 来创建一个子进程，通过 `close` 来关闭不需要的文件描述符，然后就可以通过 `read` 和 `write` 来进行读写操作。

- `dup2` 可以复制管道的读写端
- 文件描述符是一个用于访问文件或其他输入/输出资源的 “指针”
  
示例代码：

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <fcntl.h>
#include <sys/stat.h>
#include <unistd.h>
#include <errno.h>

// We also have UNIX domain sockets for local inter-process
// communication--they also have a name in the file system
// like "/var/run/docker.sock". This is similar to a named
// pipe.
#define PIPE_NAME "/tmp/my_pipe"

void pipe_read() {
    int fd = open(PIPE_NAME, O_RDONLY);
    char buffer[1024];

    if (fd == -1) {
        perror("open");
        exit(1);
    }

    // Read from the pipe
    int num_read = read(fd, buffer, sizeof(buffer));
    if (num_read > 0) {
        printf("Received: %s\n", buffer);
    } else {
        printf("No data received.\n");
    }
    close(fd);
}

void pipe_write(const char *content) {
    // Open the pipe for writing
    int fd = open(PIPE_NAME, O_WRONLY);

    if (fd == -1) {
        perror("open");
        exit(1);
    }

    // Write the message to the pipe
    write(fd, content, strlen(content) + 1);
    close(fd);
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        fprintf(stderr, "Usage: %s read|write [message]\n", argv[0]);
        return 1;
    }

    // Create the named pipe if it does not exist
    if (mkfifo(PIPE_NAME, 0666) == -1) {
        if (errno != EEXIST) {
            perror("mkfifo");
            return 1;
        }
    } else {
        printf("Created " PIPE_NAME "\n");
    }

    if (strcmp(argv[1], "read") == 0) {
        pipe_read();
    } else if (strcmp(argv[1], "write") == 0) {
        pipe_write(argv[2]);
    } else {
        fprintf(stderr, "Invalid command. Use 'read' or 'write'.\n");
        return 1;
    }

    return 0;
}
```

## sh ⭐️⭐️⭐️

- 这个 Shell 没有引用任何库文件——它只通过系统调用访问操作系统中的对象。
- 下面为程序主要部分：

- 程序入口：

```c
void _start() {
    main();
    syscall(SYS_exit, 0);
}
```

- 结构体定义及主要命令处理函数：


```c
enum {
    EXEC = 1,
    REDIR,
    PIPE,
    LIST,
    BACK
};

#define MAXARGS 10
#define NULL ((void *)0)

struct cmd {
    int type;
};

struct execcmd {
    int type;
    char *argv[MAXARGS], *eargv[MAXARGS];
};

struct redircmd {
    int type, fd, mode;
    char *file, *efile;
    struct cmd *cmd;
};

struct pipecmd {
    int type;
    struct cmd *left, *right;
};

struct listcmd {
    int type;
    struct cmd *left, *right;
};

struct backcmd {
    int type;
    struct cmd *cmd;
};

struct cmd *parsecmd(char *);

// cmd is the "abstract syntax tree" (AST) of the command;
// runcmd() never returns.
void runcmd(struct cmd *cmd) {
    int p[2];
    struct backcmd *bcmd;
    struct execcmd *ecmd;
    struct listcmd *lcmd;
    struct pipecmd *pcmd;
    struct redircmd *rcmd;

    if (cmd == 0)
        syscall(SYS_exit, 1);

    switch (cmd->type) {
    case EXEC:
        ecmd = (struct execcmd *)cmd;
        if (ecmd->argv[0] == 0)
            syscall(SYS_exit, 1);

        char *c = zalloc(5 + strlen(ecmd->argv[0]) + 1);
        strcpy(c, "/bin/");
        strcpy(c + strlen(c), ecmd->argv[0]);
        syscall(SYS_execve, c, ecmd->argv, NULL);
        print("fail to exec ", c, "\n", NULL);
        break;

    case REDIR:
        rcmd = (struct redircmd *)cmd;
        syscall(SYS_close, rcmd->fd);
        if (syscall(SYS_open, rcmd->file, rcmd->mode, 0644) < 0) {
            print("fail to open ", rcmd->file, "\n", NULL);
            syscall(SYS_exit, 1);
        }
        runcmd(rcmd->cmd);
        break;

    case LIST:
        lcmd = (struct listcmd *)cmd;
        if (syscall(SYS_fork) == 0)
            runcmd(lcmd->left);
        syscall(SYS_wait4, -1, 0, 0, 0);
        runcmd(lcmd->right);
        break;

    case PIPE:
        pcmd = (struct pipecmd *)cmd;
        assert(syscall(SYS_pipe, p) >= 0);
        if (syscall(SYS_fork) == 0) {
            syscall(SYS_close, 1);
            syscall(SYS_dup, p[1]);
            syscall(SYS_close, p[0]);
            syscall(SYS_close, p[1]);
            runcmd(pcmd->left);
        }
        if (syscall(SYS_fork) == 0) {
            syscall(SYS_close, 0);
            syscall(SYS_dup, p[0]);
            syscall(SYS_close, p[0]);
            syscall(SYS_close, p[1]);
            runcmd(pcmd->right);
        }
        syscall(SYS_close, p[0]);
        syscall(SYS_close, p[1]);
        syscall(SYS_wait4, -1, 0, 0, 0);
        syscall(SYS_wait4, -1, 0, 0, 0);
        break;

    case BACK:
        bcmd = (struct backcmd *)cmd;
        if (syscall(SYS_fork) == 0)
            runcmd(bcmd->cmd);
        break;

    default:
        assert(0);
    }
    syscall(SYS_exit, 0);
}
```

可以看到将 `shell` 的命令分为了 `EXEC`、`REDIR`、`PIPE`、`LIST`、`BACK` 五种类型：
- `EXEC` 为执行命令
- `REDIR` 为重定向命令
- `PIPE` 为管道命令
- `LIST` 为列表命令
- `BACK` 为后台命令

重点看看对于 `PIPE` 的处理.
```c
// Author: Github Copilot
case PIPE:
    // 将cmd强制转换为pipecmd类型的指针，以便访问pipecmd特有的字段
    pcmd = (struct pipecmd *)cmd;
    // 创建一个管道，p[0]为读端，p[1]为写端。assert确保管道创建成功
    assert(syscall(SYS_pipe, p) >= 0);
    // 创建一个子进程
    if (syscall(SYS_fork) == 0) {
        // 在子进程中，关闭标准输出（文件描述符1）
        syscall(SYS_close, 1);
        // 将管道的写端复制到标准输出位置
        syscall(SYS_dup, p[1]);
        // 关闭管道的读端
        syscall(SYS_close, p[0]);
        // 关闭管道的写端（已经复制到标准输出，不再需要原始的文件描述符）
        syscall(SYS_close, p[1]);
        // 递归地执行管道左侧的命令
        runcmd(pcmd->left);
    }
    // 再次创建一个子进程
    if (syscall(SYS_fork) == 0) {
        // 在新的子进程中，关闭标准输入（文件描述符0）
        syscall(SYS_close, 0);
        // 将管道的读端复制到标准输入位置
        syscall(SYS_dup, p[0]);
        // 关闭管道的读端（已经复制到标准输入，不再需要原始的文件描述符）
        syscall(SYS_close, p[0]);
        // 关闭管道的写端
        syscall(SYS_close, p[1]);
        // 递归地执行管道右侧的命令
        runcmd(pcmd->right);
    }
    // 在父进程中，关闭管道的读端
    syscall(SYS_close, p[0]);
    // 在父进程中，关闭管道的写端
    syscall(SYS_close, p[1]);
    // 父进程等待第一个子进程完成
    syscall(SYS_wait4, -1, 0, 0, 0);
    // 父进程等待第二个子进程完成
    syscall(SYS_wait4, -1, 0, 0, 0);
    // 结束case语句
    break;
```

## dlbox ⭐️⭐️⭐️

- `dlbox` 是一个简单的动态链接库加载器，它可以加载并运行动态链接库中的函数。
- 对于其中所有的符号都采取"查表"的方式，而不是直接调用函数，这与 GOT(全局偏移表)的工作方式类似。

对于 `dl.h`:

```c
#ifdef __ASSEMBLER__

    #define DL_HEAD     __hdr: \
                        /* magic */    .ascii DL_MAGIC; \
                        /* file_sz */  .4byte (__end - __hdr); \
                        /* code_off */ .4byte (__code - __hdr)
    #define DL_CODE     .fill REC_SZ - 1, 1, 0; \
                        .align REC_SZ, 0; \
                        __code:
    #define DL_END      __end:

    #define RECORD(sym, off, name) \
        .align REC_SZ, 0; \
        sym .8byte (off); .ascii name

    #define IMPORT(sym) RECORD(sym:,           0, "?" #sym "\0")
    #define EXPORT(sym) RECORD(    , sym - __hdr, "#" #sym "\0")
    #define LOAD(lib)   RECORD(    ,           0, "+" lib  "\0")
    #define DSYM(sym)   *sym(%rip)

#else
    #include <stdint.h>

    struct dl_hdr {
        char magic[4];
        uint32_t file_sz, code_off;
    };

    struct symbol {
        int64_t offset;
        char type, name[REC_SZ - sizeof(int64_t) - 1];
    };
#endif
```

`dl.h` 对于直接汇编语言编写的代码定义了一些宏，如动态链接库的头部、代码段、结束标记、符号表记录等。对于 C 语言代码，定义了动态链接库头部和符号表记录的结构体。
- `DL_HEAD` 定义了动态链接库的头部，包括魔数、文件大小和代码段偏移量，在 `DL_HEAD` 与 `DL_CODE` 之间的部分写入符号表.
- `DL_CODE` 定义了代码段的起始位置，`DL_END` 定义了代码段的结束位置。
- `LOAD` 用于加载动态链接库，`IMPORT` 导入符号，`EXPORT` 导出符号，`DSYM` 调用符号(表示出了符号的地址)

如下面的汇编代码所示：
```c
#include "dl.h"

DL_HEAD

LOAD("libc.dl")
LOAD("libhello.dl")
IMPORT(hello)
IMPORT(exit)
EXPORT(_start)

DL_CODE

main:
    call DSYM(hello)
    call DSYM(hello)
    call DSYM(hello)
    call DSYM(hello)
    movq $0, %rax
    ret

_start:
    call main
    jmp DSYM(exit)

DL_END
```

定义了 `dl.h` 结合 `dlbox.c` 来使用：
```c
// 定义全局符号表和库表
static struct symbol *libs[16], syms[128];

// 根据符号名查找符号地址
static void *dlsym(const char *name);

// 将符号名和地址导出到全局符号表
static void dlexport(const char *name, void *addr);

// 加载一个库，如果库中的符号未加载则递归加载
static void dlload(struct symbol *sym);

// 打开并加载一个动态链接库文件，返回库的句柄
static struct dlib *dlopen(const char *path) {
    struct dl_hdr hdr; // 库头部信息
    struct dlib *h; // 库句柄

    // 打开库文件
    int fd = open(path, O_RDONLY);
    if (fd < 0)
        goto bad;
    // 读取库头部信息
    if (read(fd, &hdr, sizeof(hdr)) < sizeof(hdr))
        goto bad;
    // 检查魔数是否匹配
    if (strncmp(hdr.magic, DL_MAGIC, strlen(DL_MAGIC)) != 0)
        goto bad;

    // 将库文件映射到内存
    h = mmap(NULL, hdr.file_sz, PROT_READ | PROT_WRITE | PROT_EXEC, MAP_PRIVATE, fd, 0);
    if (h == MAP_FAILED)
        goto bad;

    // 设置库的符号表和路径
    h->symtab = (struct symbol *)((char *)h + REC_SZ);
    h->path = path;

    // 遍历符号表，根据符号类型进行处理
    for (struct symbol *sym = h->symtab; sym->type; sym++) {
        switch (sym->type) {
        case '+': // 递归加载依赖的库
            dlload(sym);
            break;
        case '?': // 解析符号地址
            sym->offset = (uintptr_t)dlsym(sym->name);
            break;
        case '#': // 导出符号
            dlexport(sym->name, (char *)h + sym->offset);
            break;
        }
    }

    return h;

bad:
    // 错误处理，关闭文件描述符并返回NULL
    if (fd > 0)
        close(fd);
    return NULL;
}

// 查找符号地址，如果找到返回地址，否则断言失败
static void *dlsym(const char *name) {
    for (int i = 0; i < LENGTH(syms); i++)
        if (strcmp(syms[i].name, name) == 0)
            return (void *)syms[i].offset; // 返回符号地址
    assert(0);
}

// 导出符号到全局符号表，如果表满则断言失败
static void dlexport(const char *name, void *addr) {
    for (int i = 0; i < LENGTH(syms); i++)
        if (!syms[i].name[0]) {
            syms[i].offset = (uintptr_t)addr; // 设置符号地址
            strcpy(syms[i].name, name); // 记录符号名
            return;
        }
    assert(0);
}

// 加载库，如果库已加载则返回，否则递归加载依赖的库
static void dlload(struct symbol *sym) {
    for (int i = 0; i < LENGTH(libs); i++) {
        if (libs[i] && strcmp(libs[i]->name, sym->name) == 0)
            return; // 库已加载
        if (!libs[i]) {
            libs[i] = sym;
            dlopen(sym->name); // 递归加载库
            return;
        }
    }
    assert(0); // 如果所有库槽位都已使用，则断言失败
}
```
