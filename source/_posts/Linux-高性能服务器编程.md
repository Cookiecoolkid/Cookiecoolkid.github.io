---
title: Linux 高性能服务器编程
date: 2024-10-20 10:31:53
tags:
- Linux
- C++
- 网络编程
categories:
- Linux

mathjax: true
---

🌟 参考资料： Linux 高性能服务器编程 (游双著)

<!--more-->

## Linux 网络编程基础 API

#### Socket 地址 API

##### 主机字节序和网络字节序
- 大端字节序：高位字节存放在低位地址，通常为网络字节序
- 小端字节序：高位字节存放在高位地址，通常为主机字节序

##### Linux 字节序转换函数
```c++
#include <netinet/in.h>
uint32_t htonl(uint32_t hostlong); // 主机字节序转网络字节序
uint16_t htons(uint16_t hostshort); // 主机字节序转网络字节序
uint32_t ntohl(uint32_t netlong); // 网络字节序转主机字节序
uint16_t ntohs(uint16_t netshort); // 网络字节序转主机字节序
```

#### 通用 Socket 地址结构
```c++
struct sockaddr {
    sa_family_t sa_family; // 地址族
    char sa_data[14]; // 地址信息
};
```
以及更通用的 `sockaddr_storage` 结构体

```c++
struct sockaddr_storage {
    sa_family_t ss_family; // 地址族
    unsigned long __ss_align; // 对齐
    char __ss_padding[128 - sizeof(__ss_align)]; // 补齐
};
```

但上述结构体并不包含地址信息(还需要自行进行位操作)，因此 Linux 封装了更具体的结构体，如 `sockaddr_in` 和 `sockaddr_in6`

```c++
struct sockaddr_in {
    sa_family_t sin_family; // 地址族
    in_port_t sin_port; // 端口号
    struct in_addr sin_addr; // IPv4 地址
    char sin_zero[8]; // 补齐
};

struct addr_in {
    uint32_t s_addr; // IPv4 地址
};

struct sockaddr_in6 {
    sa_family_t sin6_family; // 地址族
    in_port_t sin6_port; // 端口号
    uint32_t sin6_flowinfo; // 流信息
    struct in6_addr sin6_addr; // IPv6 地址
    uint32_t sin6_scope_id; // 作用域 ID
};
```

##### 协议族
- AF_INET：IPv4
- AF_INET6：IPv6
- AF_UNIX：UNIX 域
- AF_* 与 PF_* 宏可以互换使用

#### IP 地址转换函数
```c++
#include <arpa/inet.h>
in_addr_t inet_addr(const char *str); // 点分十进制转换为网络字节序，失败返回 INADDR_NONE
int inet_aton(const char *str, struct in_addr *addr); // 点分十进制转换为网络字节序，成功返回 1，失败返回 0
const char *inet_ntoa(struct in_addr addr); // 网络字节序转换为点分十进制，返回静态内存地址(不可重入)

// @param af: AF_INET 或 AF_INET6
// @param src: 点分十进制字符串
// @param dst: 存放转换后的地址

int inet_pton(int af, const char *src, void *dst); // 点分十进制转换为网络字节序，成功返回 1，失败返回 0
const char *inet_ntop(int af, const void *src, char *dst, socklen_t size); // 网络字节序转换为点分十进制，成功返回 dst，失败返回 NULL 并设置 errno
```

#### 创建 Socket
- Everything is a file
  
```c++
#include <sys/types.h>
#include <sys/socket.h>

// @param domain: PF_INET, PF_INET6, PF_UNIX
// @param type: SOCK_STREAM(流服务TCP), SOCK_DGRAM(数据报服务UDP), SOCK_RAW(原始套接字)
// @param protocol: IPPROTO_TCP, IPPROTO_UDP, IPPROTO_SCTP(默认 0, 因为 domain 和 type 已经决定了协议)
int socket(int domain, int type, int protocol); // 创建一个套接字，成功返回文件描述符，失败返回 -1
```

#### 命名 Socket
```c++
// @param sockfd: 套接字文件描述符
// @param addr: 指向 sockaddr 结构体的指针
// @param addrlen: sockaddr 结构体的长度
int bind(int sockfd, const struct sockaddr *addr, socklen_t addrlen); // 绑定套接字和地址，成功返回 0，失败返回 -1
```
- 通常为 TCP 服务器绑定地址和端口(Server 端)
#### 监听 Socket
```c++
// @param sockfd: 套接字文件描述符
// @param backlog: 最大连接数
int listen(int sockfd, int backlog); // 监听套接字，成功返回 0，失败返回 -1
```

#### 接受连接
名为 accept 接受连接，但实际其并不关心连接，只是从监听队列中取出一个连接
```c++
// @param sockfd: 套接字文件描述符
// @param addr: 指向 sockaddr 结构体的指针
// @param addrlen: sockaddr 结构体的长度
int accept(int sockfd, struct sockaddr *addr, socklen_t *addrlen); // 接受连接，成功返回文件描述符，失败返回 -1
```

#### 连接 Socket
```c++
// @param sockfd: 套接字文件描述符
// @param addr: 指向 sockaddr 结构体的指针
// @param addrlen: sockaddr 结构体的长度
int connect(int sockfd, const struct sockaddr *addr, socklen_t addrlen); // 连接套接字，成功返回 0，失败返回 -1
```
- 通常为 TCP 客户端连接地址和端口(Client 端)
- 一旦连接成功，客户端和服务器端都可以通过读写 sockfd 进行通信

#### 关闭 Socket
```c++
// @param sockfd: 套接字文件描述符
int close(int sockfd); // 关闭套接字，成功返回 0，失败返回 -1
```
- close 实际上是将 sockfd 的引用计数减 1，只有当引用计数为 0 时才会真正关闭套接字(多进程共享套接字时)
- shutdown 可以立即关闭套接字

```c++
// @param sockfd: 套接字文件描述符
// @param how: SHUT_RD(关闭读端), SHUT_WR(关闭写端), SHUT_RDWR(关闭读写端)
int shutdown(int sockfd, int how); // 关闭套接字，成功返回 0，失败返回 -1
```

#### 数据读写

##### TCP 读写
```c++
// @param sockfd: 套接字文件描述符
// @param buf: 缓冲区
// @param len: 缓冲区长度
// @param flags: MSG_CONFIRM(数据完整性确认), MSG_DONTROUTE(数据不经过路由), MSG_DONTWAIT(非阻塞), MSG_OOB(紧急数据), MSG_PEEK(窥探数据), MSG_WAITALL(等待全部数据)...
ssize_t recv(int sockfd, void *buf, size_t len, int flags); // 读取数据，成功返回读取的字节数，失败返回 -1

ssize_t send(int sockfd, const void *buf, size_t len, int flags); // 发送数据，成功返回发送的字节数，失败返回 -1
```

##### UDP 读写
```c++
// @param sockfd: 套接字文件描述符
// @param buf: 缓冲区
// @param len: 缓冲区长度
// @param flags: ...
// @param src_addr: 发送端的 socket 地址信息
// @param addrlen: sockaddr 结构体的长度
ssize_t recvfrom(int sockfd, void *buf, size_t len, int flags, struct sockaddr *src_addr, socklen_t *addrlen); // 读取数据，成功返回读取的字节数，失败返回 -1


// @param dest_addr: 接收端的 socket 地址信息
ssize_t sendto(int sockfd, const void *buf, size_t len, int flags, const struct sockaddr *dest_addr, socklen_t addrlen); // 发送数据，成功返回发送的字节数，失败返回 -1
```

##### 通用读写
```c++
#include <sys/socket.h>
ssize_t recvmsg(int sockfd, struct msghdr *msg, int flags); // 读取数据，成功返回读取的字节数，失败返回 -1
ssize_t sendmsg(int sockfd, const struct msghdr *msg, int flags); // 发送数据，成功返回发送的字节数，失败返回 -1

// msghdr 结构体
struct msghdr {
    void *msg_name; // socket 地址信息
    socklen_t msg_namelen; // socket 地址信息长度
    struct iovec *msg_iov; // 缓冲区
    int msg_iovlen; // 缓冲区长度
    void *msg_control; // 控制信息
    socklen_t msg_controllen; // 控制信息长度
    int msg_flags; // 标志
};

// iovec 结构体
struct iovec {
    void *iov_base; // 内存缓冲区起始地址
    size_t iov_len; // 缓冲区长度
};
```

#### 带外数据
- TCP 有一个带外数据标志，可以通过 MSG_OOB 标志来发送和接收带外数据(紧急数据)

```c++
int sockatmark(int sockfd); // 判断 socket 是否有带外标记，是返回 1，否返回 0，失败返回 -1
```

#### 地址信息函数
```c++
#include <sys/socket.h>
int getsockname(int sockfd, struct sockaddr *addr, socklen_t *addrlen); // 获取套接字地址信息，成功返回 0，失败返回 -1
int getpeername(int sockfd, struct sockaddr *addr, socklen_t *addrlen); // 获取对端地址信息，成功返回 0，失败返回 -1
```

#### Socker 选项
```c++
#include <sys/socket.h>
// @param sockfd: 套接字文件描述符
// @param level: SOL_SOCKET(通用套接字选项), IPPROTO_TCP(协议套接字选项), IPPROTO_IP(IP 层套接字选项)
// @param optname: 选项名
// @param optval: 选项值
// @param optlen: 选项值长度
int getsockopt(int sockfd, int level, int optname, void *optval, socklen_t *optlen); // 获取套接字选项，成功返回 0，失败返回 -1
int setsockopt(int sockfd, int level, int optname, const void *optval, socklen_t optlen); // 设置套接字选项，成功返回 0，失败返回 -1
```

![socketOpt](socketOpt.png)

- SO_REUSEADDR
    TCP 服务器在关闭后，可能会有一段时间处于 TIME_WAIT 状态，此时再次启动服务器会导致 bind 失败，可以通过设置 SO_REUSEADDR 选项来强制绑定

- SO_RCVBUF 和 SO_SNDBUF
    设置接收和发送缓冲区大小

- SO_RCVLOWAT 和 SO_SNDLOWAT
    一般用于 io 复用相关 api 调用，设置接收和发送缓冲区低水位标记，当缓冲区中的数据量低于低水位标记时， select 和 poll 将返回可读或可写

- SO_LINGER
    设置关闭 socket 的行为，当设置 SO_LINGER 选项时，close 会阻塞直到所有数据发送完毕或超时
    ```c++
    struct linger {
        int l_onoff; // 0: 关闭，1: 开启
        int l_linger; // 超时时间
    };
    ```

#### 网络信息函数
```c++
#include <sys/socket.h>
// @param name: 主机名
struct hostent* gethostbyname(const char *name); // 获取主机信息，成功返回 0，失败返回 -1
// @param addr: IP 地址
struct hostent* gethostbyaddr(const char *addr, int len, int type); // 获取主机信息，成功返回 0，失败返回 -1

// hostent 结构体
struct hostent {
    char *h_name; // 主机名
    char **h_aliases; // 主机别名
    int h_addrtype; // 地址类型
    int h_length; // 地址长度
    char **h_addr_list; // 地址列表
};

struct servent* getservbyname(const char *name, const char *proto); // 获取服务信息，成功返回 0，失败返回 -1
struct servent* getservbyport(int port, const char *proto); // 获取服务信息，成功返回 0，失败返回 -1

// servent 结构体
struct servent {
    char *s_name; // 服务名
    char **s_aliases; // 服务别名
    int s_port; // 端口号
    char *s_proto; // 协议
};

// @param node: 主机名或 IP 地址
// @param service: 服务名或端口号
// @param hints: 对地址信息的限制
// @param res: 返回存储的地址信息
int getaddrinfo(const char *node, const char *service, const struct addrinfo *hints, struct addrinfo **res); // 获取地址信息，成功返回 0，失败返回 -1

// addrinfo 结构体
struct addrinfo {
    int ai_flags; // 标志
    int ai_family; // 地址族
    int ai_socktype; // 套接字类型
    int ai_protocol; // 协议
    socklen_t ai_addrlen; // 地址长度
    struct sockaddr *ai_addr; // 地址信息
    char *ai_canonname; // 主机名
    struct addrinfo *ai_next; // 下一个地址信息
};

// getaddrinfo 会隐式分配 addrinfo 结构体，需要通过 freeaddrinfo 释放
void freeaddrinfo(struct addrinfo *res); // 释放地址信息

// @param sockfd: 套接字文件描述符
// @param addr: 指向 sockaddr 结构体的指针
// @param addrlen: sockaddr 结构体的长度
int getnameinfo(const struct sockaddr *addr, socklen_t addrlen, char *host, socklen_t hostlen, char *serv, socklen_t servlen, int flags); // 获取地址信息，成功返回 0，失败返回 -1
```

## 高级 I/O 函数
主要分为三类：
- 用于创建文件描述符的函数：pipe, dup, dup2...
- 用于读写数据的函数:readv, writev, sendfile, mmap, munmap, splice, tee...
- 用于控制 I/O 行为的函数：fcntl, ioctl, fcntl64...

#### pipe
```c++
// 匿名管道
// @param pipefd: 用于存放管道的文件描述符，pipefd[0] 为读端，pipefd[1] 为写端
int pipe(int pipefd[2]); // 创建管道，成功返回 0，失败返回 -1

// 命名管道
int mkfifo(const char *pathname, mode_t mode); // 创建命名管道，成功返回 0，失败返回 -1
```

#### dup 和 dup2
```c++
// @param oldfd: 要复制的文件描述符
int dup(int oldfd); // 复制文件描述符，成功返回新的文件描述符，失败返回 -1

// @param oldfd: 要复制的文件描述符
// @param newfd: 新的文件描述符
int dup2(int oldfd, int newfd); // 复制文件描述符，成功返回新的文件描述符，失败返回 -1
```

#### readv 和 writev
```c++
#include <sys/uio.h>
// 分散读和集中写
// @param fd: 文件描述符
// @param iov: iovec 结构体数组
// @param iovcnt: iovec 结构体数组长度
ssize_t readv(int fd, const struct iovec *iov, int iovcnt); // 读取数据，成功返回读取的字节数，失败返回 -1

ssize_t writev(int fd, const struct iovec *iov, int iovcnt); // 发送数据，成功返回发送的字节数，失败返回 -1
```

#### sendfile
```c++
#include <sys/sendfile.h>
// 完全在内核中操作，不需要用户态和内核态之间的数据拷贝(零拷贝)
// @param out_fd: 输出文件描述符(必须是 socket)
// @param in_fd: 输入文件描述符(不是 socket 或 pipe)
// @param offset: 偏移量
// @param count: 传输字节数
ssize_t sendfile(int out_fd, int in_fd, off_t *offset, size_t count); // 传输文件，成功返回传输的字节数，失败返回 -1
```

#### mmap 和 munmap
```c++
#include <sys/mman.h>
// 内存映射
// @param addr: 映射地址
// @param length: 映射长度
// @param prot: 保护模式(PROT_READ, PROT_WRITE, PROT_EXEC, PROT_NONE)
// @param flags: 映射标志(MAP_SHARED, MAP_PRIVATE, MAP_ANONYMOUS, MAP_FIXED)
// @param fd: 文件描述符
// @param offset: 偏移量
void *mmap(void *addr, size_t length, int prot, int flags, int fd, off_t offset); // 映射内存，成功返回映射地址，失败返回 MAP_FAILED

// @param addr: 映射地址
// @param length: 映射长度
int munmap(void *addr, size_t length); // 解除映射，成功返回 0，失败返回 -1
```

#### splice 和 tee
```c++
#include <fcntl.h>
// splice 用于在两个文件描述符之间移动数据，不需要用户态和内核态之间的数据拷贝(零拷贝)
// splice 要求 fd_in 和 fd_out 其中一个必须是管道
// @param fd_in: 输入文件描述符(可以为管道，且若为管道，off_in 必须为 NULL)
// @param off_in: 输入文件描述符偏移量
// @param fd_out: 输出文件描述符
// @param off_out: 输出文件描述符偏移量
// @param len: 传输字节数
// @param flags: SPLICE_F_MOVE, SPLICE_F_NONBLOCK
ssize_t splice(int fd_in, loff_t *off_in, int fd_out, loff_t *off_out, size_t len, unsigned int flags); // 移动数据，成功返回传输的字节数，失败返回 -1

// tee 用于在两个管道之间移动数据，不需要用户态和内核态之间的数据拷贝(零拷贝)
// @param fd_in: 输入文件描述符
// @param fd_out: 输出文件描述符
// @param len: 传输字节数
// @param flags: SPLICE_F_MOVE, SPLICE_F_NONBLOCK
ssize_t tee(int fd_in, int fd_out, size_t len, unsigned int flags); // 移动数据，成功返回传输的字节数，失败返回 -1
```

#### fcntl
```c++
#include <fcntl.h>

// @param fd: 文件描述符
// @param cmd: F_GETFL(获取文件状态标志), F_SETFL(设置文件状态标志，通常在网络编程中设置非阻塞状态 O_NONBLOCK), F_GETFD(获取文件描述符标志), F_SETFD(设置文件描述符标志)...
// @param arg: 参数
int fcntl(int fd, int cmd, ...); // 控制文件描述符，成功返回 0，失败返回 -1
```

## Linux 服务器程序规范

#### 日志

![LinuxSysLog](LinuxSysLog.png)

##### syslog
```c++
#include <syslog.h>
// @param priority: 日志级别
// @param format: 日志格式
void syslog(int priority, const char *format, ...); // 写入日志

void openlog(const char *ident, int option, int facility); // 打开日志(进一步格式化)

int setlogmask(int maskpri); // 设置日志级别

void closelog(); // 关闭日志

// 日志级别
LOG_EMERG   // 系统不可用
LOG_ALERT   // 报警
LOG_CRIT    // 严重错误
LOG_ERR     // 一般错误
LOG_WARNING // 警告
LOG_NOTICE  // 通知
LOG_INFO    // 信息
LOG_DEBUG   // 调试
```
#### 用户信息

##### UID, EUID, GID, EGID

```c++
#include <unistd.h>

uid_t getuid(); // 获取用户 ID
uid_t geteuid(); // 获取有效用户 ID
gid_t getgid(); // 获取组 ID
gid_t getegid(); // 获取有效组 ID
void setuid(uid_t uid); // 设置用户 ID
void seteuid(uid_t euid); // 设置有效用户 ID
void setgid(gid_t gid); // 设置组 ID
void setegid(gid_t egid); // 设置有效组 ID
```

##### 切换用户

```c++
#include <unistd.h>

static bool switch_to_user(uid_t user_id, gid_t gp_id) {
    if ((user_id == 0) && (gp_id == 0)) {
        return false;
    }

    gid_t gid = getgid();
    uid_t uid = getuid();
    if (((gid != 0) || (uid != 0)) && ((gid != gp_id) || (uid != user_id))) {
        return false;
    }

    if ((uid != 0) && (uid == user_id)) {
        return true;
    }

    if (setgid(gp_id) < 0 || setuid(user_id) < 0) {
        return false;
    }

    return true;
}
```

#### 进程间关系

##### 进程组

Linux 中每个进程都属于一个进程组，进程组中的首领进程是组长，进程组 ID 与进程 ID 相同

```c++
#include <unistd.h>

pid_t getpgrp(); // 获取进程组 ID
pid_t getpgid(pid_t pid); // 获取进程 ID 的进程组 ID
int setpgid(pid_t pid, pid_t pgid); // 设置进程 ID 的进程组 ID
```

##### 会话

一些有关联的进程组可以组成一个会话

```c++
#include <unistd.h>
// 创建一个新会话, 进程组的首领进程不能调用 setsid
// 非首领进程调用 setsid 会创建一个新会话，且成为新会话的首领进程，且会新建一个进程组，其 PGID = PID = SID
pid_t setsid();
```

##### ps 命令    
```shell
ps -ef | grep xxx

ps -o pid,ppid,pgid,sid,comm | less
```

#### 系统资源限制

```c++
#include <sys/resource.h>

// @param resource: 资源类型
// @param rlim: 资源限制
int getrlimit(int resource, struct rlimit *rlim); // 获取资源限制，成功返回 0，失败返回 -1

int setrlimit(int resource, const struct rlimit *rlim); // 设置资源限制，成功返回 0，失败返回 -1

// rlimit 结构体
struct rlimit {
    rlim_t rlim_cur; // 软限制
    rlim_t rlim_max; // 硬限制
};

// 资源类型
RLIMIT_AS   // 进程地址空间大小
RLIMIT_CORE // core 文件大小
RLIMIT_CPU  // CPU 时间
RLIMIT_DATA // 数据段大小
RLIMIT_FSIZE // 文件大小
RLIMIT_MEMLOCK // 锁定内存大小
RLIMIT_MSGQUEUE // 消息队列大小
RLIMIT_NICE // 优先级
RLIMIT_NOFILE // 文件描述符数量
RLIMIT_NPROC // 进程数量
RLIMIT_RSS // 驻留内存大小
RLIMIT_RTPRIO // 实时优先级
RLIMIT_SIGPENDING // 信号队列大小
RLIMIT_STACK // 栈大小
```

#### 改变工作目录和根目录

```c++
#include <unistd.h>

char *getcwd(char *buf, size_t size); // 获取当前工作目录，成功返回 buf，失败返回 NULL

int chdir(const char *path); // 改变工作目录，成功返回 0，失败返回 -1

int chroot(const char *path); // 改变根目录，成功返回 0，失败返回 -1
```

#### 服务器程序后台化(守护进程daemon)

```c++
#include <unistd.h>

void daemonize() {
    // 创建子进程，父进程退出
    pid_t pid = fork();
    if (pid < 0) {
        exit(1);
    } else if (pid > 0) {
        exit(0);
    }

    // 创建新会话
    setsid();

    // 改变工作目录
    chdir("/");

    // 关闭文件描述符
    close(STDIN_FILENO);
    close(STDOUT_FILENO);
    close(STDERR_FILENO);

    // 重定向文件描述符
    open("/dev/null", O_RDONLY);
    open("/dev/null", O_RDWR);
    open("/dev/null", O_RDWR);
}

// Linux 也提供了 daemon 函数
// @param nochdir: 0: 改变工作目录，1: 不改变工作目录
// @param noclose: 0: 关闭文件描述符012(stdin,stdout,stderr)，1: 不关闭
int daemon(int nochdir, int noclose);
```


## 高性能服务器程序框架

主要分为三部分：
- I/O 处理单元：包含四种 I/O 模型以及两种高效的事件处理模型
- 逻辑单元：包含两种高效的并发模型以及高效的逻辑处理方式 —— 有限状态机(FSM)
- 存储单元：(略)

#### 服务器模型

##### C/S 模型 (Client/Server)

- 服务器先创建多个 socket，然后监听端口，等待客户端连接
![CS](CS.png)

##### P2P 模型 (Peer to Peer)
![P2P](P2P.png)
#### 服务器编程框架

![ServerFrame](ServerFrame.png)

- I/O 模块：等待并接受客户端连接，接收客户端数据(也可能在逻辑单元中，取决于事件处理模型)，实现负载均衡
- 逻辑单元：处理客户端请求，实现业务逻辑，通常是一个进程或者线程
- 存储单元：存储数据，通常是数据库服务器
- 请求队列：是各单元通信方式的抽象，是各服务器之间预先建立的、静态的、永久的 TCP 连接，通常被实现为池的一部分

#### I/O 模型

socket 默认是阻塞的，可以通过设置 O_NONBLOCK 选项来设置非阻塞，可能被阻塞的系统调用有：
- accept
- recv
- send
- connect

对于非阻塞的 socket，总是立即返回，可能返回 EAGAIN 或 EWOULDBLOCK 错误(非阻塞通常配合 IO 复用以及 SIGIO 信号使用)
![IOModel](IOModel.png)

#### 高效的事件处理模型

##### Reactor 模式

要求主线程(Reactor)负责且只负责监听文件描述符的事件，管理请求队列，除此之外，主线程不做任何实质性的工作，将读写的工作分配给工作线程(发出的是写就绪事件)

下面以同步 I/O 多路复用 ```epoll_wait``` 为例，实现 Reactor 模式框架


![Reactor](Reactor.png)

##### Proactor 模式

Proactor 模式要求主线程(Proactor)和内核负责处理所有的 I/O 事件，而工作线程只负责业务逻辑(发出的是写完成事件)

下面以异步 I/O ```aio_read, aio_write``` 为例，实现 Proactor 模式框架

![Proactor](Proactor.png)

#### 高效的并发模型

##### 半同步/半异步模型(Half Sync/Half Async)

在 I/O 模型中的同步与异步，是指 I/O 操作的同步与异步(以就绪事件还是完成事件以及谁来完成 I/O 读写为标准)，而在并发模型中的同步与异步不同，同步是指程序完全按照代码顺序执行，异步是指程序不按照代码顺序执行(需要系统事件触发驱动，如中断、信号等)

![HSHA](HSHA.png)

而半同步/半异步模型则是将同步和异步结合起来，异步线程负责 I/O 事件的处理并插入请求队列，同步线程负责业务逻辑的处理

![HSHAwork](HSHAwork.png)

如下是半同步/半反应堆模型的框架

![HSHR](HSHR.png)

##### 领导者/追随者模型(Leader/Follower)

领导者/追随者模型是一种高效的并发模型，领导者负责监听文件描述符的事件，追随者负责处理业务逻辑，领导者和追随者之间通过线程池进行通信，二者之间可以相互切换，以实现负载均衡

![LF1](LF1.png)

![LF2](LF2.png)

#### 有限状态机(FSM)

详情以及进一步拓展可以参考课程[Formal Language and Automata](https://fla24course.github.io/)


## I/O 复用

#### select 系统调用

##### select API
```c++
#include <sys/select.h>
// @return: 就绪(可读， 可写， 异常)文件描述符数
// @param nfds: 文件描述符最大值 + 1
// @param readfds: 读文件描述符集合
// @param writefds: 写文件描述符集合
// @param exceptfds: 异常文件描述符集合
// @param timeout: 超时时间
int select(int nfds, fd_set *readfds, fd_set *writefds, fd_set *exceptfds, struct timeval *timeout); // 多路复用，成功返回就绪文件描述符数，失败返回 -1

// fd_set 结构体
#include <typesizes.h>
#define __FD_SETSIZE 1024
typedef long int __fd_mask;
#define __NFDBITS (8 * (int)sizeof(__fd_mask))

typedef struct {
    __fd_mask __fds_bits[__FD_SETSIZE / __NFDBITS];
} fd_set;

FD_ZERO(fd_set *fdset); // 清空文件描述符集合
FD_SET(int fd, fd_set *fdset); // 添加文件描述符到集合
FD_CLR(int fd, fd_set *fdset); // 从集合中删除文件描述符
FD_ISSET(int fd, fd_set *fdset); // 判断文件描述符是否在集合中

struct timeval {
    long tv_sec; // 秒
    long tv_usec; // 微秒
};
```

![FDReadyCondition](FDReadyCondition.png)

#### poll 系统调用

- poll 与 select 类似，也是在指定时间内轮询一组文件描述符，以检测是否有就绪事件发生
- poll 与 select 的区别：
    - poll 没有文件描述符数量限制
    - poll 通过 pollfd 结构体传递文件描述符，而不是通过 fd_set
    - poll 通过事件类型来判断文件描述符是否就绪，而不是通过位图
    - poll 通过 pollfd 结构体的 revents 成员来判断文件描述符是否就绪，而不是通过返回值

```c++
#include <poll.h>
// @return: 就绪文件描述符数，与 select 一致
// @param fds: pollfd 结构体数组
// @param nfds: pollfd 结构体数组长度
// @param timeout: 超时时间
int poll(struct pollfd *fds, nfds_t nfds, int timeout); // 多路复用，成功返回就绪文件描述符数，失败返回 -1

// pollfd 结构体
struct pollfd {
    int fd; // 文件描述符
    short events; // 事件类型
    short revents; // 就绪事件
};

// 事件类型
POLLIN  // 可读
POLLRDNORM // 普通数据可读
POLLRDBAND // 优先级数据可读
POLLPRI // 高优先级数据可读
POLLOUT // 可写
POLLWRNORM // 普通数据可写
POLLWRBAND // 优先级数据可写
POLLERR // 异常
POLLHUP // 挂起
POLLNVAL // 无效
```


#### epoll 系统调用

##### 内核事件表

```c++
#include <sys/epoll.h>
// @return: 内核事件表的文件描述符
// @param size: 内核事件表的大小
int epoll_create(int size); // 创建内核事件表，成功返回内核事件表的文件描述符，失败返回 -1

// @param epfd: 内核事件表的文件描述符
// @param op: EPOLL_CTL_ADD(添加事件), EPOLL_CTL_MOD(修改事件), EPOLL_CTL_DEL(删除事件)
// @param fd: 要操作的文件描述符
// @param event: epoll_event 结构体
int epoll_ctl(int epfd, int op, int fd, struct epoll_event *event); // 控制内核事件表，成功返回 0，失败返回 -1

// epoll_event 结构体
struct epoll_event {
    uint32_t events; // 事件类型
    epoll_data_t data; // 用户数据
};

typedef union epoll_data {
    void *ptr;
    int fd;
    uint32_t u32;
    uint64_t u64;
} epoll_data_t;
```

##### epoll_wait API
```c++
#include <sys/epoll.h>
// @return: 就绪文件描述符数
// @param epfd: 内核事件表的文件描述符
// @param events: epoll_event 结构体数组
// @param maxevents: epoll_event 结构体数组长度
// @param timeout: 超时时间
int epoll_wait(int epfd, struct epoll_event *events, int maxevents, int timeout); // 多路复用，成功返回就绪文件描述符数，失败返回 -1
```

##### LT 模式和 ET 模式

epoll 默认启用 LT 模式，当向内核事件表注册 EPOLLET 事件时，启用 ET 模式(边缘触发模式)
```c++
events.events = EPOLLIN | EPOLLET;
```

##### EPOLLONESHOT

epoll 默认不启用 EPOLLONESHOT 事件，当向内核事件表注册 EPOLLONESHOT 事件时，表示只触发一次，需要重新注册
```c++
events.events = EPOLLIN | EPOLLONESHOT;
```

#### select, poll, epoll 性能比较
![IOCmp](IOCmp.png)


## 信号

#### Linux 信号概述

##### 发送信号
- kill 命令(一个进程向另一个进程发送信号)

```c++
#include <signal.h>
// @param pid: 进程 ID
// pid > 0: 发送信号给指定进程
// pid = 0: 发送信号给当前进程所在进程组中的所有进程
// pid = -1: 发送信号给所有有权限的进程(除了 init 进程)
// pid < -1: 发送信号给指定进程组(-pid)中的所有进程
// @param sig: 信号
int kill(pid_t pid, int sig); // 发送信号，成功返回 0，失败返回 -1
```

- ```kill``` 的 errno 如下：
- EPERM: 权限不足
- ESRCH: 进程不存在
- EINVAL: 信号不合法

##### 信号处理方式

```c++
#include <signal.h>
// @param int 指示信号类型
// 信号处理函数
typedef void (*sighandler_t)(int);
```

##### Linux 信号

<!--下面给出表格  信号|起源|默认行为|含义-->

| 信号 | 起源 | 默认行为 | 含义 |
| --- | --- | --- | --- |
| SIGHUP | POSIX | Term | 终端挂起或控制进程终止 |
| SIGINT | ANSI | Term | 中断信号 |
| SIGQUIT | POSIX | Core | 退出信号 |
| SIGILL | ANSI | Core | 非法指令 |
| SIGTRAP | POSIX | Core | 跟踪/断点陷阱 |
| SIGABRT | ANSI | Core | 异常终止 |
| SIGIOT | 4.2BSD | Core | IOT 指令 |
| SIGBUS | 4.2BSD | Core | 总线错误 |
| SIGFPE | ANSI | Core | 浮点异常 |
| SIGKILL | POSIX | Term | 强制终止 |
| SIGUSR1 | POSIX | Term | 用户自定义信号 1 |
| SIGSEGV | ANSI | Core | 段错误 |
| SIGUSR2 | POSIX | Term | 用户自定义信号 2 |
| SIGPIPE | POSIX | Term | 管道破裂 |
| SIGALRM | POSIX | Term | 闹钟信号 |
| SIGTERM | ANSI | Term | 终止信号 |
| SIGSTKFLT | Linux | Term | 协处理器栈错误 |
| SIGCHLD | POSIX | Ign | 子进程状态改变 |
| SIGCONT | POSIX | Cont | 继续执行 |
| SIGSTOP | POSIX | Stop | 停止进程 |
| SIGTSTP | POSIX | Stop | 终端停止信号 |
| SIGTTIN | POSIX | Stop | 后台进程请求输入 |
| SIGTTOU | POSIX | Stop | 后台进程请求输出 |
| SIGURG | 4.2BSD | Ign | 紧急条件 |
| SIGXCPU | 4.2BSD | Core | 超过 CPU 时间限制 |
| SIGXFSZ | 4.2BSD | Core | 超过文件大小限制 |
| SIGVTALRM | 4.2BSD | Term | 虚拟时钟信号 |
| SIGPROF | 4.2BSD | Term | 专用时钟信号 |
| SIGWINCH | 4.3BSD | Ign | 窗口大小改变 |
| SIGIO | 4.2BSD | Term | I/O 可用 |
| SIGPWR | System V | Term | 电源故障 |
| SIGSYS | 4.2BSD | Core | 非法系统调用 |
| SIGRTMIN | Linux | Term | 实时信号的最小值 |
| SIGRTMAX | Linux | Term | 实时信号的最大值 |
| SIGUNUSED | Linux | Term | 保留未使用 |


- 但目前网络编程主要关注的信号有 SIGHUP, SIGURG, SIGPIPE, SIGALRM, SIGCHID

#### 信号函数

##### signal 系统调用

```c++
#include <signal.h>
// @param signum: 信号
_sighandler_t signal(int signum, _sighandler_t handler); // 设置信号处理函数，成功返回原来的信号处理函数，失败返回 SIG_ERR

// signal 函数的返回值类型
typedef void (*_sighandler_t)(int);
```

##### sigaction 系统调用

```c++
#include <signal.h>
// @param signum: 信号
// @param act: 信号处理方式
// @param oldact: 旧的信号处理方式
int sigaction(int signum, const struct sigaction *act, struct sigaction *oldact); // 设置信号处理方式，成功返回 0，失败返回 -1

// sigaction 结构体
struct sigaction {
    void (*sa_handler)(int); // 信号处理函数
    void (*sa_sigaction)(int, siginfo_t *, void *); // 信号处理函数
    sigset_t sa_mask; // 信号屏蔽字
    int sa_flags; // 信号处理标志
};

// siginfo_t 结构体
struct siginfo_t {
    int si_signo; // 信号
    int si_errno; // 错误码
    int si_code; // 信号代码
    pid_t si_pid; // 发送信号的进程 ID
    uid_t si_uid; // 发送信号的用户 ID
    int si_status; // 退出状态
    void *si_addr; // 内存地址
    int si_band; // 通知信号
    int si_fd; // 文件描述符
};
```

#### 信号集

##### 信号集函数

```c++
#include <bits/sigset.h>
#include <signal.h>

#define SIGSET_NWORDS (1024 / (8 * sizeof(unsigned long int)))
typedef struct {
    unsigned long int __val[SIGSET_NWORDS];
} sigset_t;

int sigemptyset(sigset_t *set); // 清空信号集，成功返回 0，失败返回 -1
int sigfillset(sigset_t *set); // 填充信号集，成功返回 0，失败返回 -1
int sigaddset(sigset_t *set, int signum); // 添加信号到信号集，成功返回 0，失败返回 -1
int sigdelset(sigset_t *set, int signum); // 从信号集中删除信号，成功返回 0，失败返回 -1
int sigismember(const sigset_t *set, int signum); // 判断信号是否在信号集中，成功返回 1，失败返回 0
```

##### 信号掩码

```c++
#include <signal.h>

int sigprocmask(int how, const sigset_t *set, sigset_t *oldset); // 设置信号掩码，成功返回 0，失败返回 -1

// how 参数
SIG_BLOCK // 将 set 中的信号添加到当前信号掩码中
SIG_UNBLOCK // 将 set 中的信号从当前信号掩码中删除
SIG_SETMASK // 将当前信号掩码设置为 set
```

##### 被挂起的信号

```c++
#include <signal.h>
// 被掩码屏蔽的信号
int sigpending(sigset_t *set); // 获取被挂起的信号，成功返回 0，失败返回 -1
```

#### 统一事件源

统一事件源是指直接在主循环中统一处理信号和 I/O 事件，主要有两种方式：
- 信号处理函数中使用管道通知主循环
- 信号处理函数中使用信号量通知主循环


## 定时器

#### socket 选项 SO_RCVTIMEO 和 SO_SNDTIMEO

```c++
#include <sys/socket.h>

int timeout_connect(const char *ip, int port, int time) {
    struct sockaddr_in address;
    bzero(&address, sizeof(address));
    address.sin_family = AF_INET;
    inet_pton(AF_INET, ip, &address.sin_addr);
    address.sin_port = htons(port);

    int sockfd = socket(PF_INET, SOCK_STREAM, 0);
    struct timeval timeout;
    timeout.tv_sec = time;
    timeout.tv_usec = 0;
    socklen_t len = sizeof(timeout);
    int ret = setsockopt(sockfd, SOL_SOCKET, SO_SNDTIMEO,, &timeout, len);
    
    assert(ret != -1);

    ret = connect(sockfd, (struct sockaddr *)&address, sizeof(address));

    if (ret == -1) {
        if (errno == EINPROGRESS) {
            printf("connecting timeout, process timeout logic\n");
            // 处理超时逻辑
            // ...
            return -1;
        }
        printf("error occur when connecting to server\n");
        return -1;
    } 

    return sockfd;
}
```

#### 时间轮定时器

```c++
#include <time.h>
#include <sys/socket.h>
#include <netinet/in.h>

#define BUFFER_SIZE 64
#define FD_LIMIT 65535
#define MAX_EVENT_NUMBER 1024
#define TIMESLOT 5

static int pipefd[2];
static sort timer_lst;
static int epollfd = 0;

int setnonblocking(int fd) {
    int old_option = fcntl(fd, F_GETFL);
    int new_option = old_option | O_NONBLOCK;
    fcntl(fd, F_SETFL, new_option);
    return old_option;
}

void addfd(int epollfd, int fd) {
    epoll_event event;
    event.data.fd = fd;
    event.events = EPOLLIN | EPOLLET;
    epoll_ctl(epollfd, EPOLL_CTL_ADD, fd, &event);
    setnonblocking(fd);
}

void sig_handler(int sig) {
    int save_errno = errno;
    int msg = sig;
    send(pipefd[1], (char *)&msg, 1, 0);
    errno = save_errno;
}

void addsig(int sig) {
    struct sigaction sa;
    memset(&sa, '\0', sizeof(sa));
    sa.sa_handler = sig_handler;
    sa.sa_flags |= SA_RESTART;
    sigfillset(&sa.sa_mask);
    assert(sigaction(sig, &sa, NULL) != -1);
}

void timer_handler() {
    timer_lst.tick();
    alarm(TIMESLOT);
}

void cb_func(client_data *user_data) {
    epoll_ctl(epollfd, EPOLL_CTL_DEL, user_data->sockfd, 0);
    assert(user_data);
    close(user_data->sockfd);
    printf("close fd %d\n", user_data->sockfd);
}

int main(int argc, char *argv[]) {
    int port = atoi(argv[1]);

    int listenfd = socket(PF_INET, SOCK_STREAM, 0);
    assert(listenfd >= 0);

    struct sockaddr_in address;
    bzero(&address, sizeof(address));
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = htonl(INADDR_ANY);
    address.sin_port = htons(port);

    int ret = bind(listenfd, (struct sockaddr *)&address, sizeof(address));
    assert(ret != -1);

    ret = listen(listenfd, 5);
    assert(ret != -1);

    epoll_event events[MAX_EVENT_NUMBER];
    epollfd = epoll_create(5);
    assert(epollfd != -1);
    addfd(epollfd, listenfd);

    ret = socketpair(PF_UNIX, SOCK_STREAM, 0, pipefd);
    assert(ret != -1);
    setnonblocking(pipefd[1]);
    addfd(epollfd, pipefd[0]);

    addsig(SIGALRM);
    addsig(SIGTERM);

    client_data *users = new client_data[FD_LIMIT];
    bool stop_server = false;
    bool timeout = false;

    alarm(TIMESLOT);

    while (!stop_server) {
        int number = epoll_wait(epollfd, events, MAX_EVENT_NUMBER, -1);
        if ((number < 0) && (errno != EINTR)) {
            printf("epoll failure\n");
            break;
        }

        for (int i = 0; i < number; i++) {
            int sockfd = events[i].data.fd;
            if (sockfd == listenfd) {
                struct sockaddr_in client_address;
                socklen_t client_addrlength = sizeof(client_address);
                int connfd = accept(listenfd, (struct sockaddr *)&client_address, &client_addrlength);
                addfd(epollfd, connfd);
                users[connfd].address = client_address;
                users[connfd].sockfd = connfd;

                heap_timer *timer = new heap_timer(3 * TIMESLOT);
                timer->user_data = &users[connfd];
                timer->cb_func = cb_func;
                users[connfd].timer = timer;
                timer_lst.add_timer(timer);
            } else if ((sockfd == pipefd[0]) && (events[i].events & EPOLLIN)) {
                int sig;
                char signals[1024];
                ret = recv(pipefd[0], signals, sizeof(signals), 0);
                if (ret == -1) {
                    continue;
                } else if (ret == 0) {
                    continue;
                } else {
                    for (int i = 0; i < ret; i++) {
                        switch (signals[i]) {
                            case SIGALRM:
                                timeout = true;
                                break;
                            case SIGTERM:
                                stop_server = true;
                        }
                    }
                }
            } else if (events[i].events & EPOLLIN) {
                memset(users[sockfd].buf, '\0', BUFFER_SIZE);
                ret = recv(sockfd, users[sockfd].buf, BUFFER_SIZE - 1, 0);
                printf("get %d bytes of client data %s from %d\n", ret, users[sockfd].buf, sockfd);

                heap_timer *timer = users[sockfd].timer;
                if (ret < 0) {
                    if (errno != EAGAIN) {
                        cb_func(&users[sockfd]);
                        if (timer) {
                            timer_lst.del_timer(timer);
                        }
                    }
                } else if (ret == 0) {
                    cb_func(&users[sockfd]);
                    if (timer) {
                        timer_lst.del_timer(timer);
                    }
                } else {
                    if (timer) {
                        time_t cur = time(NULL);
                        timer->expire = cur + 3 * TIMESLOT;
                        printf("adjust timer once\n");
                        timer_lst.adjust_timer(timer);
                    }
                }
            } else {
                // other things
            }

            if (timeout) {
                timer_handler();
                timeout = false;
            }
        }
    }

    close(listenfd);
    close(pipefd[1]);
    close(pipefd[0]);
    delete [] users;
    return 0;
}
```

#### 时间堆

```c++
#include <time.h>
#include <netinet/in.h>
#include <stdio.h>
#include <string.h>
#include <assert.h>
#include <stdlib.h>
#include <errno.h>

#define BUFFER_SIZE 64
#define FD_LIMIT 65535
#define MAX_EVENT_NUMBER 1024
#define TIMESLOT 5

class heap_timer;

struct client_data {
    sockaddr_in address;
    int sockfd;
    char buf[BUFFER_SIZE];
    heap_timer *timer;
};

class heap_timer {
public:
    heap_timer(int delay) {
        expire = time(NULL) + delay;
    }

public:
    time_t expire;
    void (*cb_func)(client_data *);
    client_data *user_data;
};

class time_heap {
public:
    time_heap(int cap) : capacity(cap), cur_size(0) {
        array = new heap_timer*[capacity];
        if (!array) {
            perror("new error");
            exit(1);
        }
        for (int i = 0; i < capacity; i++) {
            array[i] = NULL;
        }
    }

    time_heap(heap_timer **init_array, int size, int capacity) : cur_size(size), capacity(capacity) {
        if (capacity < size) {
            perror("capacity error");
            exit(1);
        }
        array = new heap_timer*[capacity];
        if (!array) {
            perror("new error");
            exit(1);
        }
        for (int i = 0; i < capacity; i++) {
            array[i] = NULL;
        }
        if (size != 0) {
            for (int i = 0; i < size; i++) {
                array[i] = init_array[i];
            }
            for (int i = (cur_size - 1) / 2; i >= 0; i--) {
                percolate_down(i);
            }
        }
    }

    ~time_heap() {
        for (int i = 0; i < cur_size; i++) {
            delete array[i];
        }
        delete [] array;
    }

public:
    void add_timer(heap_timer *timer) {
        if (!timer) {
            return;
        }
        if (cur_size >= capacity) {
            resize();
        }
        int hole = cur_size++;
        int parent = 0;
        for (; hole > 0; hole = parent) {
            parent = (hole - 1) / 2;
            if (array[parent]->expire <= timer->expire) {
                break;
            }
            array[hole] = array[parent];
        }
        array[hole] = timer;
    }

    void del_timer(heap_timer *timer) {
        if (!timer) {
            return;
        }
        timer->cb_func = NULL;
    }

    heap_timer *top() const {
        if (empty()) {
            return NULL;
        }
        return array[0];
    }

    void pop_timer() {
        if (empty()) {
            return;
        }
        if (array[0]) {
            delete array[0];
            array[0] = array[--cur_size];
            percolate_down(0);
        }
    }

    void tick() {
        heap_timer *tmp = array[0];
        time_t cur = time(NULL);
        while (!empty()) {
            if (!tmp) {
                break;
            }
            if (tmp->expire > cur) {
                break;
            }
            if (array[0]->cb_func) {
                array[0]->cb_func(array[0]->user_data);
            }
            pop_timer();
            tmp = array[0];
        }
    }

    bool empty() const {
        return cur_size == 0;
    }

private:
    void percolate_down(int hole) {
        heap_timer *temp = array[hole];
        int child = 0;
        for (; ((hole * 2 + 1) <= (cur_size - 1)); hole = child) {
            child = hole * 2 + 1;
            if ((child < (cur_size - 1)) && (array[child + 1]->expire < array[child]->expire)) {
                ++child;
            }
            if (array[child]->expire < temp->expire) {
                array[hole] = array[child];
            } else {
                break;
            }
        }
        array[hole] = temp;
    }

    void resize() {
        heap_timer **temp = new heap_timer*[2 * capacity];
        for (int i = 0; i < 2 * capacity; i++) {
            temp[i] = NULL;
        }
        if (!temp) {
            perror("new error");
            exit(1);
        }
        capacity = 2 * capacity;
        for (int i = 0; i < cur_size; i++) {
            temp[i] = array[i];
        }
        delete [] array;
        array = temp;
    }

private:
    heap_timer **array;
    int capacity;
    int cur_size;
};

void cb_func(client_data *user_data) {
    epoll_ctl(epollfd, EPOLL_CTL_DEL, user_data->sockfd, 0);
    assert(user_data);
    close(user_data->sockfd);
    printf("close fd %d\n", user_data->sockfd);
}

int main(int argc, char *argv[]) {
    int port = atoi(argv[1]);

    int listenfd = socket(PF_INET, SOCK_STREAM, 0);
    assert(listenfd >= 0);

    struct sockaddr_in address;
    bzero(&address, sizeof(address));
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = htonl(INADDR_ANY);
    address.sin_port = htons(port);

    int ret = bind(listenfd, (struct sockaddr *)&address, sizeof(address));
    assert(ret != -1);

    ret = listen(listenfd, 5);
    assert(ret != -1);

    time_heap timer_lst(60);
    epoll_event events[MAX_EVENT_NUMBER];
    int epollfd = epoll_create(5);
    assert(epollfd != -1);
    addfd(epollfd, listenfd);

    while (1) {
        int number = epoll_wait(epollfd, events, MAX_EVENT_NUMBER, -1);
        if ((number < 0) && (errno != EINTR)) {
            printf("epoll failure\n");
            break;
        }

        for (int i = 0; i < number; i++) {
            int sockfd = events[i].data.fd;
            if (sockfd == listenfd) {
                struct sockaddr_in client_address;
                socklen_t client_addrlength = sizeof(client_address);
                int connfd = accept(listenfd, (struct sockaddr *)&client_address, &client_addrlength);
                addfd(epollfd, connfd);
                client_data *user_data = new client_data;
                user_data->address = client_address;
                user_data->sockfd = connfd;

                heap_timer *timer = new heap_timer(3 * TIMESLOT);
                timer->user_data = user_data;
                timer->cb_func = cb_func;
                user_data->timer = timer;
                timer_lst.add_timer(timer);
            } else if (events[i].events & EPOLLIN) {
                memset(users[sockfd].buf, '\0', BUFFER_SIZE);
                ret = recv(sockfd, users[sockfd].buf, BUFFER_SIZE - 1, 0);
                printf("get %d bytes of client data %s from %d\n", ret, users[sockfd].buf, sockfd);

                heap_timer *timer = users[sockfd].timer;
                if (ret < 0) {
                    if (errno != EAGAIN) {
                        cb_func(&users[sockfd]);
                        if (timer) {
                            timer_lst.del_timer(timer);
                        }
                    }
                } else if (ret == 0) {
                    cb_func(&users[sockfd]);
                    if (timer) {
                        timer_lst.del_timer(timer);
                    }
                } else {
                    if (timer) {
                        time_t cur = time(NULL);
                        timer->expire = cur + 3 * TIMESLOT;
                        printf("adjust timer once\n");
                        timer_lst.adjust_timer(timer);
                    }
                }
            } else {
                // other things
            }
        }

        timer_lst.tick();
    }

    close(listenfd);
    return 0;
}
```

## 高性能 I/O 框架库 Libevent

[libevent.org](https://libevent.org/)

#### 事件多路分发器 Event Demultiplexer

![EventDemult](EventDemult.png)

![Libeventgraph](Libeventgraph.png)