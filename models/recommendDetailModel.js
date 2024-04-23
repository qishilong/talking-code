const mongoose = require("mongoose");

// 定义推荐详情的 Schema
const recommendDetailSchema = new mongoose.Schema(
  {
    // id: String,
    title: {
      type: String,
      required: true,
      default: "默认推荐标题"
      // default: "探索 JWT：安全、可扩展的身份验证方案"
    }, // 推荐详情标题
    href: {
      type: String,
      required: true,
      default: "#"
      // default: "https://juejin.cn/post/7343243744479395891"
    } // 推荐详情链接
  },
  {
    versionKey: false
  }
);

mongoose.model("recommendDetailModel", recommendDetailSchema, "recommendDetail");

// 将此模型进行导出
module.exports = mongoose.model("recommendDetailModel");
