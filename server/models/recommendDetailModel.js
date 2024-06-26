const mongoose = require("mongoose");

// 定义推荐详情的 Schema
const recommendDetailSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "默认推荐标题"
    }, // 推荐列表标题
    href: {
      type: String,
      required: true,
      default: "#"
    }, // 推荐列表链接
    curIndex: {
      type: Number,
      require: true
    } // 当前推荐列表的位置
  },
  {
    versionKey: false
  }
);

mongoose.model("recommendDetailModel", recommendDetailSchema, "recommendDetail");

// 将此模型进行导出
module.exports = mongoose.model("recommendDetailModel");
