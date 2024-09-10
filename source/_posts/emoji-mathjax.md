---
title: emoji & mathjax
date: 2024-06-26 18:33:01
tags: hexo
categories: hexo
mathjax: true
---

最近希望在 hexo 上加上支持渲染 emoji 的功能，但是此时发现 mathjax 无法正常渲染了.

<!--more-->

- align 环境下的换行需要转变用四个斜杠 `\\\\` 代替两个斜杠 `\\`，否则会出现渲染错误
- ...问题太多了，遂暂时放弃 emoji

:joy: :joy: :joy: 十分钟后

- 还是想用 emoji

> 取自博客网站 [https://spacefan.github.io/](https://spacefan.github.io/)

解决方案：

使用以下命令安装 hexo-filter-github-emojis 插件：

```bash
$ npm install hexo-filter-github-emojis --save
```

并在 `_config.yml` 中添加以下配置：

```yaml
githubEmojis:
  enable: true
  className: github-emoji
  unicode: true
  styles:
    display: inline
    vertical-align: middle # Freemind适用
  localEmojis:
```

此时就可以用`:joy:`来渲染为 :joy:

- 似乎也可以直接复制 emoji 😂😂😂
- 直接复制更省事(💩😰😭😭😭)