---
title: os-code-persistence
date: 2024-06-28 16:19:41
tags: Operation System
categories: Operation System
mathjax: true
---

**All code is taken from NJU-2024-operation-system by jyy.**
please check [https://jyywiki.cn/OS/2024/](https://jyywiki.cn/OS/2024/)


forked-code：
[https://github.com/Cookiecoolkid/jyyos/tree/master/persistence](https://github.com/Cookiecoolkid/jyyos/tree/master/persistence)

<!--more-->

## launcher ⭐️⭐️⭐️

- 设备驱动程序
> Everything is a file.

- 实现设备驱动程序本质上就是提供一组文件操作接口(`read`,`write`...)，这些接口可以被用户态程序调用，从而实现对设备的控制。

即最重要的是实现下面的接口：
```c
static ssize_t launcher_read(struct file *, char __user *, size_t, loff_t *);
static ssize_t launcher_write(struct file *, const char __user *, size_t, loff_t *);
```

完整代码：


```c
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/cdev.h>
#include <linux/device.h>
#include <linux/fs.h>
#include <linux/uaccess.h>

#define NUM_DEV 2

static int dev_major = 0;
static struct class *launcher_class = NULL;
static struct cdev cdev;

static ssize_t launcher_read(struct file *, char __user *, size_t, loff_t *);
static ssize_t launcher_write(struct file *, const char __user *, size_t, loff_t *);

static struct file_operations fops = {
    .owner = THIS_MODULE,
    .read = launcher_read,
    .write = launcher_write,
};

static struct nuke {
    struct cdev cdev;
} devs[NUM_DEV];

static int __init launcher_init(void) {
    int i;
    dev_t dev;

    // allocate device range
    alloc_chrdev_region(&dev, 0, 1, "nuke");

    // create device major number
    dev_major = MAJOR(dev);

    // create class
    launcher_class = class_create(THIS_MODULE, "nuke");
    cdev.owner = THIS_MODULE;

    for (i = 0; i < NUM_DEV; i++) {
        // register device
        cdev_init(&devs[i].cdev, &fops);
        cdev_add(&devs[i].cdev, MKDEV(dev_major, i), 1);
        device_create(launcher_class, NULL, MKDEV(dev_major, i), NULL, "nuke%d", i);
    }
    return 0;
}

static void __exit launcher_exit(void) {
    device_destroy(launcher_class, MKDEV(dev_major, 0));
    unregister_chrdev_region(MKDEV(dev_major, 0), MINORMASK);
    class_unregister(launcher_class);
    class_destroy(launcher_class);
}

static ssize_t launcher_read(struct file *file, char __user *buf, size_t count, loff_t *offset) {
    if (*offset != 0) {
        return 0;
    } else {
        uint8_t *data = "This is dangerous!\n";
        size_t datalen = strlen(data);
        if (count > datalen) {
          count = datalen;
        }
        if (copy_to_user(buf, data, count)) {
          return -EFAULT;
        }
        *offset += count;
        return count;
    }
}

static ssize_t launcher_write(struct file *file, const char __user *buf, size_t count, loff_t *offset) {
    char databuf[4] = "\0\0\0\0";
    if (count > 4) {
        count = 4;
    }

    copy_from_user(databuf, buf, count);
    if (strncmp(databuf, "\x01\x14\x05\x14", 4) == 0) {
        const char *EXPLODE[] = {
          "    ⠀⠀⠀⠀⠀⠀⠀⠀⣀⣠⣀⣀⠀⠀⣀⣤⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
          "    ⠀⠀⠀⣀⣠⣤⣤⣾⣿⣿⣿⣿⣷⣾⣿⣿⣿⣿⣿⣶⣿⣿⣿⣶⣤⡀⠀⠀⠀⠀",
          "    ⠀⢠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀⠀⠀⠀",
          "    ⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⡀⠀",
          "    ⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀",
          "    ⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠁⠀",
          "    ⠀⠀⠻⢿⡿⢿⣿⣿⣿⣿⠟⠛⠛⠋⣀⣀⠙⠻⠿⠿⠋⠻⢿⣿⣿⠟⠀⠀⠀⠀",
          "    ⠀⠀⠀⠀⠀⠀⠈⠉⣉⣠⣴⣷⣶⣿⣿⣿⣿⣶⣶⣶⣾⣶⠀⠀⠀⠀⠀⠀⠀⠀",
          "    ⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠋⠈⠛⠿⠟⠉⠻⠿⠋⠉⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀",
          "    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣶⣷⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
          "    ⠀⠀⠀⠀⠀⠀⢀⣀⣠⣤⣤⣤⣤⣶⣿⣿⣷⣦⣤⣤⣤⣤⣀⣀⠀⠀⠀⠀⠀⠀",
          "    ⠀⠀⠀⠀⢰⣿⠛⠉⠉⠁⠀⠀⠀⢸⣿⣿⣧⠀⠀⠀⠀⠉⠉⠙⢻⣷⠀⠀⠀⠀",
          "    ⠀⠀⠀⠀⠀⠙⠻⠷⠶⣶⣤⣤⣤⣿⣿⣿⣿⣦⣤⣤⣴⡶⠶⠟⠛⠁⠀⠀⠀⠀",
          "    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
          "    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠒⠛⠛⠛⠛⠛⠛⠛⠛⠛⠛⠓⠀⠀⠀⠀⠀⠀⠀⠀⠀",
        };
        int i;

        for (i = 0; i < sizeof(EXPLODE) / sizeof(EXPLODE[0]); i++) {
          printk("\033[01;31m%s\033[0m\n", EXPLODE[i]);
      }
    } else {
      printk("nuke: incorrect secret, cannot lanuch.\n");
    }
    return count;
}

module_init(launcher_init);
module_exit(launcher_exit);
MODULE_LICENSE("GPL");
MODULE_AUTHOR("jyy");
```


## readfat ⭐️⭐️⭐️⭐️⭐️⭐️

- To Be Continued (目前尚未学习该文档)
- 具体最好详细阅读 [Microsoft FAT Specification](https://jyywiki.cn/OS/manuals/MSFAT-spec.pdf)
- 文档和该项目代码可以对照阅读，会有新的体验

- fat32.h

```c
#include <stdint.h>

typedef uint8_t u8;
typedef uint16_t u16;
typedef uint32_t u32;

// Copied from the manual

struct fat32hdr {
    u8  BS_jmpBoot[3];
    u8  BS_OEMName[8];
    u16 BPB_BytsPerSec;
    u8  BPB_SecPerClus;
    u16 BPB_RsvdSecCnt;
    u8  BPB_NumFATs;
    u16 BPB_RootEntCnt;
    u16 BPB_TotSec16;
    u8  BPB_Media;
    u16 BPB_FATSz16;
    u16 BPB_SecPerTrk;
    u16 BPB_NumHeads;
    u32 BPB_HiddSec;
    u32 BPB_TotSec32;
    u32 BPB_FATSz32;
    u16 BPB_ExtFlags;
    u16 BPB_FSVer;
    u32 BPB_RootClus;
    u16 BPB_FSInfo;
    u16 BPB_BkBootSec;
    u8  BPB_Reserved[12];
    u8  BS_DrvNum;
    u8  BS_Reserved1;
    u8  BS_BootSig;
    u32 BS_VolID;
    u8  BS_VolLab[11];
    u8  BS_FilSysType[8];
    u8  __padding_1[420];
    u16 Signature_word;
} __attribute__((packed));

struct fat32dent {
    u8  DIR_Name[11];
    u8  DIR_Attr;
    u8  DIR_NTRes;
    u8  DIR_CrtTimeTenth;
    u16 DIR_CrtTime;
    u16 DIR_CrtDate;
    u16 DIR_LastAccDate;
    u16 DIR_FstClusHI;
    u16 DIR_WrtTime;
    u16 DIR_WrtDate;
    u16 DIR_FstClusLO;
    u32 DIR_FileSize;
} __attribute__((packed));

#define CLUS_INVALID   0xffffff7

#define ATTR_READ_ONLY 0x01
#define ATTR_HIDDEN    0x02
#define ATTR_SYSTEM    0x04
#define ATTR_VOLUME_ID 0x08
#define ATTR_DIRECTORY 0x10
#define ATTR_ARCHIVE   0x20

```

- readfat.c


```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>
#include <fcntl.h>  
#include <unistd.h>
#include <sys/mman.h>
#include "fat32.h"

struct fat32hdr *hdr;

void *mmap_disk(const char *fname);
void dfs_scan(u32 clusId, int depth, int is_dir);

int main(int argc, char *argv[]) {

    if (argc < 2) {
        fprintf(stderr, "Usage: %s fs-image\n", argv[0]);
        exit(1);
    }

    setbuf(stdout, NULL);

    assert(sizeof(struct fat32hdr) == 512);
    assert(sizeof(struct fat32dent) == 32);

    // Map disk image to memory.
    // The file system is a in-memory data structure now.
    hdr = mmap_disk(argv[1]);

    // File system traversal.
    dfs_scan(hdr->BPB_RootClus, 0, 1);

    munmap(hdr, hdr->BPB_TotSec32 * hdr->BPB_BytsPerSec);
}

void *mmap_disk(const char *fname) {
    int fd = open(fname, O_RDWR);

    if (fd < 0) {
        goto release;
    }

    off_t size = lseek(fd, 0, SEEK_END);
    if (size < 0) {
        goto release;
    }

    struct fat32hdr *hdr = mmap(NULL, size, PROT_READ | PROT_WRITE, MAP_PRIVATE, fd, 0);
    if (hdr == MAP_FAILED) {
        goto release;
    }

    close(fd);

    assert(hdr->Signature_word == 0xaa55); // this is an MBR
    assert(hdr->BPB_TotSec32 * hdr->BPB_BytsPerSec == size);

    printf("%s: DOS/MBR boot sector, ", fname);
    printf("OEM-ID \"%s\", ", hdr->BS_OEMName);
    printf("sectors/cluster %d, ", hdr->BPB_SecPerClus);
    printf("sectors %d, ", hdr->BPB_TotSec32);
    printf("sectors %d, ", hdr->BPB_TotSec32);
    printf("sectors/FAT %d, ", hdr->BPB_FATSz32);
    printf("serial number 0x%x\n", hdr->BS_VolID);
    return hdr;

release:
    perror("map disk");
    if (fd > 0) {
        close(fd);
    }
    exit(1);
}

u32 next_cluster(int n) {
    // RTFM: Sec 4.1

    u32 off = hdr->BPB_RsvdSecCnt * hdr->BPB_BytsPerSec;
    u32 *fat = (u32 *)((u8 *)hdr + off);
    return fat[n];
}

void *cluster_to_sec(int n) {
    // RTFM: Sec 3.5 and 4 (TRICKY)
    // Don't copy code. Write your own.

    u32 DataSec = hdr->BPB_RsvdSecCnt + hdr->BPB_NumFATs * hdr->BPB_FATSz32;
    DataSec += (n - 2) * hdr->BPB_SecPerClus;
    return ((char *)hdr) + DataSec * hdr->BPB_BytsPerSec;
}

void get_filename(struct fat32dent *dent, char *buf) {
    // RTFM: Sec 6.1

    int len = 0;
    for (int i = 0; i < sizeof(dent->DIR_Name); i++) {
        if (dent->DIR_Name[i] != ' ') {
            if (i == 8)
                buf[len++] = '.';
            buf[len++] = dent->DIR_Name[i];
        }
    }
    buf[len] = '\0';
}

void dfs_scan(u32 clusId, int depth, int is_dir) {
    // RTFM: Sec 6

    for (; clusId < CLUS_INVALID; clusId = next_cluster(clusId)) {

        if (is_dir) {
            int ndents = hdr->BPB_BytsPerSec * hdr->BPB_SecPerClus / sizeof(struct fat32dent);

            for (int d = 0; d < ndents; d++) {
                struct fat32dent *dent = (struct fat32dent *)cluster_to_sec(clusId) + d;
                if (dent->DIR_Name[0] == 0x00 ||
                    dent->DIR_Name[0] == 0xe5 ||
                    dent->DIR_Attr & ATTR_HIDDEN)
                    continue;

                char fname[32];
                get_filename(dent, fname);

                for (int i = 0; i < 4 * depth; i++)
                    putchar(' ');
                printf("[%-12s] %6.1lf KiB    ", fname, dent->DIR_FileSize / 1024.0);

                u32 dataClus = dent->DIR_FstClusLO | (dent->DIR_FstClusHI << 16);
                if (dent->DIR_Attr & ATTR_DIRECTORY) {
                    printf("\n");
                    if (dent->DIR_Name[0] != '.') {
                        dfs_scan(dataClus, depth + 1, 1);
                    }
                } else {
                    dfs_scan(dataClus, depth + 1, 0);
                    printf("\n");
                }
            }
        } else {
            printf("#%d ", clusId);
        }
    }
}

```

