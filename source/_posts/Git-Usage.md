---
title: Git-Usage
date : 2024-09-20 10:31:37
tags : 
- git

hidden: true
mathjax: true
---

- Barfoo

<!--more-->

## Git 连接远程仓库

- 配置 ssh key
```bash
ssh-keygen -t rsa -C "
```

- 查看 ssh key
```bash
cat ~/.ssh/id_rsa.pub
```

- 复制 ssh key 到 github
- 测试 ssh key 是否配置成功
```bash
ssh -T
```

- 配置 git 用户名和邮箱
```bash
git config --global user.name "yourname"
git config --global user.email "youremail"
```

- 本地初始化 git 仓库
```bash
git init
```

- 添加远程仓库(注意不是 https)
```bash
git remote set-url origin git@github.com:Cookiecoolkid/NJU-git.git
```

- 若创建仓库时添加了 README.md or LISENCE，需要先 pull 解决冲突
```bash
git pull origin master --allow-unrelated-histories
```

- push 本地仓库到远程仓库
```bash
git push -u origin master
```

