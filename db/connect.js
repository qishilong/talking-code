/**
 * 该文件负责连接数据库
 */

const mongoose = require("mongoose");

// 定义链接数据库字符串
const dbURI = "mongodb://" + process.env.DB_HOST + "/" + process.env.DB_NAME;

// 连接
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

// 监听
mongoose.connection.on("connected", function () {
  console.log(`${process.env.DB_NAME} 数据库已经连接...`);
});

mongoose.connection.on("disconnected", function () {
  console.log(`${process.env.DB_NAME} 数据库断开链接`);
});
