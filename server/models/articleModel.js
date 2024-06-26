const mongoose = require("mongoose");

// 定义对应的 Schema
const articleSchema = new mongoose.Schema(
  {
    articleTitle: {
      type: String,
      required: true
    }, // 文章标题
    articleContent: {
      type: String,
      required: true
    }, // 文章内容
    onShelfDate: {
      type: String,
      default: String(Date.now())
    }, // 发布日期
    typeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "typeModel" // 关联的模型
    } //  所属分类
  },
  {
    versionKey: false
  }
);

// 通过 Schema 来创建相应的数据模型
// 创建数据模型的方法为 mongoose.model，只传一个名字，代表查找到对应名字的模型
// 如果传入 Schema，代表创建模型 (1) 给模型取一个名字 （2）对应的 Schema （3）对应的集合

mongoose.model("articleModel", articleSchema, "articles");

// 将此模型进行导出
module.exports = mongoose.model("articleModel");
