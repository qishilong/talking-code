const mongoose = require("mongoose");

// 定义推荐轮播图的 Schema
const recommendCarouselSchema = new mongoose.Schema(
  {
    id: String,
    imageUrl: {
      type: String,
      require: true,
      default:
        "https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6b4e5c26085400bba154fd522ad29ec~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1920&h=1080&s=624521&e=png&b=09152a"
    },
    href: {
      type: String,
      default: "#"
    }
  },
  {
    versionKey: false
  }
);

mongoose.model("recommendCarouselModel", recommendCarouselSchema, "recommendCarousel");

// 将此模型进行导出
module.exports = mongoose.model("recommendCarouselModel");
