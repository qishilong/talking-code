const mongoose = require("mongoose");

// 定义推荐轮播图的 Schema
const recommendCarouselSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
      default: "#"
    }, // 轮播图图片地址
    href: {
      type: String,
      required: true,
      default: "#"
    }, // 轮播图跳转链接
    curIndex: {
      type: Number,
      require: true
    } // 当前轮播图的位置
  },
  {
    versionKey: false
  }
);

mongoose.model("recommendCarouselModel", recommendCarouselSchema, "recommendCarousel");

// 将此模型进行导出
module.exports = mongoose.model("recommendCarouselModel");
