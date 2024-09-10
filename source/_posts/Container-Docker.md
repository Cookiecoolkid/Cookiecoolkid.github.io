---
title: Container-Docker
date: 2024-07-03 10:04:30
tags: Docker
categories: Docker
mathjax: true
---

云原生 - Docker

<!--more-->

# Dockerfile

Dockerfile 是一个文本文件，其内包含了一条条的指令（Instruction），每条指令构建一层，因此每条指令的内容，就是描述该层应当如何构建。

## Dockerfile 指令

- `FROM`：指定基础镜像
- `MAINTAINER`：指定镜像作者
- `RUN`：执行命令
- `CMD`：容器启动命令
- `EXPOSE`：指定容器监听端口
- `ENV`：设置环境变量
- `COPY`：复制文件
- `ENTRYPOINT`：容器启动命令
- `VOLUME`：挂载目录
- `WORKDIR`：设置工作目录
- `USER`：设置用户
- `ONBUILD`：触发器指令
- `LABEL`：为镜像添加元数据
- `STOPSIGNAL`：设置停止容器信号
- `ARG`：构建参数
- ...

# Docker Commands
- `docker load -i image.tar`：导入镜像
- `docker save -o image.tar image:tag`：导出镜像
- `docker run --name [name] -p [port]:[port] image:tag`：启动容器
- `docker exec -it container bash`：进入容器
- `docker ps -a`：查看所有容器
- `docker images`：查看所有镜像
- `docker rmi image:tag`：删除镜像
- `docker rm container`：删除容器
- `docker stop container`：停止容器
- `docker start container`：启动容器
- `docker logs container`：查看容器日志
- `docker inspect container`：查看容器详细信息
- `docker cp container:/path/to/file /host/path`：从容器拷贝文件到主机
- `docker cp /host/path container:/path/to/file`：从主机拷贝文件到容器