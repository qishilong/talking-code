# talking-code
技术交流社区平台。Technology exchange community platform.

## 说明

> 数据库：MongoDB 7
>
> 用户模块代码文件：web
>
> 管理员模块代码文件：manage
>
> 后端服务代码文件：server

数据库恢复命令：

```sh
mongorestore -h localhost:27017 -d talkingcode --dir /database/talkingcode 
```

用户模块启动命令：

```sh
yarn
yarn dev
```

管理员模块启动命令：

```sh
yarn
yarn dev
```

后端服务启动命令：

```sh
pnpm i
pnpm dev
```

超级管理员账号：
账号：admin
密码：123123

普通管理员账号：
账号：putong
密码：123123

用户账号：
账号：newUser
密码：123456
