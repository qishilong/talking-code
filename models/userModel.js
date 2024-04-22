const mongoose = require("mongoose");

// 定义对应的 Schema
const userSchema = new mongoose.Schema(
  {
    // id: String, // mongodb 自动生成的 id
    loginId: {
      type: String,
      required: true,
      default: " "
    }, // 账号
    loginPwd: {
      type: String,
      required: true,
      default: "123456"
    }, // 密码
    avatar: {
      type: String,
      required: true,
      default: " "
    }, // 头像
    nickname: {
      type: String,
      required: true,
      default: "新用户"
    }, // 昵称
    mail: {
      type: String,
      required: true,
      default: " "
    }, // 邮箱
    qq: {
      type: String,
      required: true,
      default: " "
    }, // QQ
    wechat: {
      type: String,
      required: true,
      default: " "
    }, // 微信号
    intro: {
      type: String,
      required: true,
      default: " "
    }, // 个人介绍
    registerDate: {
      type: String,
      required: true,
      default: String(Date.now())
    }, // 注册时间
    lastLoginDate: {
      type: String,
      required: true,
      default: String(Date.now())
    }, // 上次登录时间
    points: {
      type: Number,
      required: true,
      default: 100
    }, // 积分
    enabled: {
      type: Boolean,
      required: true,
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
