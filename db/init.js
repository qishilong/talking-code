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
          "https://qiniucloud.qishilong.space/images/80cb65bb679e483ebf95da332cb5091d~tplv-k3u1fbpfcp-jj:216:144:0:0:q75.avis",
        href: "https://juejin.cn/post/7331980540208414729"
      },
      {
        imageUrl:
          "https://qiniucloud.qishilong.space/images/56f5993107184eff8272281c60d18028~tplv-k3u1fbpfcp-jj:216:144:0:0:q75.avis",
        href: "https://juejin.cn/post/7304539174040223779"
      },
      {
        imageUrl:
          "https://qiniucloud.qishilong.space/images/479371129a34468d9a83c0d81c33a230~tplv-k3u1fbpfcp-jj:216:144:0:0:q75.avis",
        href: "https://juejin.cn/post/7324253082615152691"
      },
      {
        imageUrl:
          "https://qiniucloud.qishilong.space/images/b5e67699e22e45609ce429af2424189a~tplv-k3u1fbpfcp-jj:216:144:0:0:q75.avis",
        href: "https://juejin.cn/post/7352879991301013542"
      }
    );
    console.log("初始化推荐轮播图数据完毕...");
  }

  const recommendDetailCount = await recommendDetailModel.countDocuments();
  if (!recommendDetailCount) {
    await recommendDetailModel.create(
      {
        title: "轻松瘦身：揭秘 Docker 镜像优化之旅",
        href: "https://juejin.cn/post/7351662722906013736"
      },
      {
        title: "JavaScript 的基本术语大全",
        href: "https://juejin.cn/post/7340531314884771878"
      },
      {
        title: "分支管理：master，release，hotfix，sit，dev等等，听着都麻烦。",
        href: "https://juejin.cn/post/7352075703859150899"
      },
      {
        title: "Rust 笔记｜用 Rust 过程宏魔法简化 SQL 函数实现",
        href: "https://juejin.cn/post/7325719278676901927"
      }
    );
    console.log("初始化推荐详情数据完毕...");
  }
})();
