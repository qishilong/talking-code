const mongoose = require("mongoose");

// 定义对应的 Schema
const userSchema = new mongoose.Schema(
  {
    loginId: {
      type: String,
      required: true
    }, // 账号
    loginPwd: {
      type: String
    }, // 密码
    avatar: {
      type: String
    }, // 头像
    nickname: {
      type: String
    }, // 昵称
    mail: {
      type: String
    }, // 邮箱
    qq: {
      type: String
    }, // QQ
    wechat: {
      type: String
    }, // 微信号
    intro: {
      type: String
    }, // 个人介绍
    registerDate: {
      type: String,
      default: String(Date.now())
    }, // 注册时间
    lastLoginDate: {
      type: String,
      default: String(Date.now())
    }, // 上次登录时间
    points: {
      type: Number,
      default: 100
    }, // 积分
    enabled: {
      type: Boolean,
      default: true
    } // 是否可用
  },
  {
    versionKey: false
  }
);

// 通过 Schema 来创建相应的数据模型
// 创建数据模型的方法为 mongoose.model，只传一个名字，代表查找到对应名字的模型
// 如果传入 Schema，代表创建模型 (1) 给模型取一个名字 （2）对应的 Schema （3）对应的集合

mongoose.model("userModel", userSchema, "users");

// 将此模型进行导出
module.exports = mongoose.model("userModel");
