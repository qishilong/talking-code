/**
 * 该文件负责初始化数据
 */

// 首先连接数据库
require("./connect");

// 引入数据模型
const adminModel = require("../models/adminModel");
const recommendDetailModel = require("../models/recommendDetailModel");
const recommendCarouselModel = require("../models/recommendCarouselModel");

// 密码要进行 md5 加密
const md5 = require("md5");

// 接下来开始做数据初始化操作
(async function () {
  // admin 管理员表初始化
  const adminCount = await adminModel.countDocuments();
  if (!adminCount) {
    // 进入此 if，说明该表没有数据，我们进行一个初始化
    await adminModel.create({
      loginId: "admin",
      nickname: "超级管理员",
      loginPwd: md5("123456"),
      avatar: "/static/imgs/qishilong.jpg",
      permission: 1,
      enabled: true
    });
    console.log("初始化管理员数据完毕...");
  }

  const recommendCarouselCount = await recommendCarouselModel.countDocuments();
  if (!recommendCarouselCount) {
    await recommendCarouselModel.create(
      {
        imageUrl:
          "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6b4e5c26085400bba154fd522ad29ec~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1920&h=1080&s=624521&e=png&b=09152a",
        href: "https://juejin.cn/post/7356816927670452239"
      },
      {
        imageUrl:
          "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6b4e5c26085400bba154fd522ad29ec~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1920&h=1080&s=624521&e=png&b=09152a",
        href: "https://juejin.cn/post/7356816927670452239"
      }
    );
    console.log("初始化推荐轮播图数据完毕...");
  }

  const recommendDetailCount = await recommendDetailModel.countDocuments();
  if (!recommendDetailCount) {
    await recommendDetailModel.create({
      title: "探索 JWT：安全、可扩展的身份验证方案",
      href: "https://juejin.cn/post/7343243744479395891"
    });
  }

  console.log("初始化推荐详情数据完毕...");
})();
