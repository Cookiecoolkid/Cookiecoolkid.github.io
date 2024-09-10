---
title: MySQL
date: 2024-10-14 10:49:39
tags:
- MySQL
categories:
- MySQL

mathjax: true

---

# 启动MySQL服务
```shell
sudo service mysql start
mysql -u root -p
```

<!--more-->

# MySQL 基本操作

## MySQL 语句分类
- DDL(Data Definition Language)：数据定义语言，用来定义数据库对象：数据库、表、列等。关键字：create、drop、alter等
- DML(Data Manipulation Language)：数据操作语言，用来对数据库中表的数据进行增删改。关键字：insert、delete、update等
- DQL(Data Query Language)：数据查询语言，用来查询数据库中表的记录。关键字：select、where等
- DCL(Data Control Language)：数据控制语言，用来定义访问权限和安全级别。关键字：grant、revoke等
- TCL(Transaction Control Language)：事务控制语言，用来控制事务。关键字：commit、rollback等

## 创建数据库
```sql
create database test;
```

## 导入数据
```shell
mysql -u root -p
use test;
source /home/xxx/xxx.sql;
```

## 查看数据
```sql
show databases;             // 查看所有数据库
show tables;                // 查看所有表
desc table_name;            // 查看表结构
select version();           // 查看MySQL版本
select database();          // 查看当前数据库
```

### select 语句
- 关键字顺序
```sql
select distinct ... from ... where ... group by ... having ... order by ... limit ...;
```

- 查询字段，字段之间用逗号隔开，用 ```as``` 关键字为字段取别名，并且可以使用数学运算符
- 条件查询，使用 ```where``` 关键字，可以使用 ```=```、```!=```、```<```、```>```、```<=```、```>=```、```between```、```like```、```in```、```is null```、```is not null``` 等条件
- 逻辑查询，使用 ```and```、```or```、```not```等逻辑关键字
```sql
select * from table_name where field1 = 'value1' and field2 = 'value2';
```
- 排序查询，使用 ```order by``` 关键字，可以使用 ```asc```、```desc``` 关键字
```sql
select * from table_name order by field1 asc;
```
- 分组查询，使用 ```group by``` 关键字
```sql
select field1, count(*) from table_name group by field1;
```

- 单行处理函数
  - ```concat()```：连接字符串
  - ```substring()```：截取字符串
  - ```instr()```：查找字符串
  - ```length()```：字符串长度
  - ```trim()```：去除字符串两端空格
  - ```ltrim()```：去除字符串左端空格
  - ```rtrim()```：去除字符串右端空格
  - ```lower()```：转换为小写
  - ```upper()```：转换为大写
- 多行处理函数
  - ```count()```：统计行数
  - ```sum()```：求和
  - ```avg()```：平均值
  - ```max()```：最大值
  - ```min()```：最小值
  - ```group_concat()```：将组中值连接为字符串
- ```group by``` 可以配合 ```having``` 使用
```sql
select field1, count(*) from table_name group by field1 having count(*) > 1;
```
### insert 语句
```sql
insert into table_name (field1, field2) values ('value1', 'value2');
```

### update 语句
```sql
update table_name set field1 = 'value1' where field2 = 'value2';
```

### delete 语句
```sql
delete from table_name where field1 = 'value1';
```
