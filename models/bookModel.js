const mongoose = require("mongoose");

// 定义对应的 Schema
const bookSchema = new mongoose.Schema(
  {
    // id: String, // mongodb 自动生成的 id
    bookTitle: {
      type: String,
      required: true,
      default: " "
    }, // 书籍标题
    bookPic: {
      type: String,
      required: true,
      default: " "
    }, // 书籍图片
    downloadLink: {
      type: String,
      required: true,
      default: " "
    }, // 下载链接
    bookIntro: {
      type: String,
      required: true,
      default: " "
    }, // 书籍介绍
    scanNumber: {
      type: Number,
      required: true,
      default: 0
    }, // 浏览数
    commentNumber: {
      type: Number,
      required: true,
      default: 0
    }, // 评论数
    onShelfDate: {
      type: String,
      required: true,
      default: String(Date.now())
    }, // 上架日期
    requirePoints: {
      type: Number,
      required: true,
      default: 100
    }, // 下载所需积分
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

mongoose.model("bookModel", bookSchema, "books");

// 将此模型进行导出
module.exports = mongoose.model("bookModel");
