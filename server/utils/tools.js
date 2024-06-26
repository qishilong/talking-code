const jwt = require("jsonwebtoken");
const md5 = require("md5");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { UnknownError } = require("./errors");
const { Workbook } = require("exceljs");

// 格式化要响应的数据
/* `module.exports.formatResponse`
函数用于以标准化方式格式化响应数据。它需要三个参数：“code”、“msg”和“data”。它创建一个具有“code”、“msg”和“data”属性的对象，并将参数值分配给这些属性。最后，它返回创建的对象。该函数可用于在将数据发送回客户端时创建一致的响应结构。 */
module.exports.formatResponse = function (code, msg, data) {
  return {
    code,
    msg,
    data
  };
};

// 解析客户端传递过来的 token
module.exports.analysisToken = function (token) {
  return jwt.verify(token.split(" ")[1], md5(process.env.JWT_SECRET), function (err, decode) {
    return decode;
  });
};

/**
 * 读取一个目录下有多少个文件
 * @param {*} dir 目录地址
 */
async function readDirLength(dir) {
  return new Promise((resolve) => {
    fs.readdir(dir, (err, files) => {
      if (err) throw new UnknownError();
      resolve(files);
    });
  });
}

/**
 * 生成一个随机头像的路径
 */
module.exports.randomAvatar = async function () {
  const files = await readDirLength("./public/static/avatar");
  const randomIndex = Math.floor(Math.random() * files.length);
  return "/static/avatar/" + files[randomIndex];
};

// 设置上传文件的引擎
const storage = multer.diskStorage({
  // 文件存储的位置
  destination: function (req, file, cb) {
    cb(null, __dirname + "/../public/static/uploads");
  },
  // 上传到服务器的文件，文件名要做单独处理
  filename: function (req, file, cb) {
    // 获取文件名
    const basename = path.basename(file.originalname, path.extname(file.originalname));
    // 获取后缀名
    const extname = path.extname(file.originalname);
    // 构建新的名字
    const newName =
      basename + new Date().getTime() + Math.floor(Math.random() * 9000 + 1000) + extname;
    cb(null, newName);
  }
});

// 文件上传
module.exports.uploading = multer({
  storage: storage,
  limits: {
    fileSize: 2000000,
    files: 1
  }
});

/**
 * 根据文件名，sheet名，columns数据，data数据生成表格
 * @param {*} name
 * @param {*} sheetName
 * @param {*} columns
 * @param {*} data
 */
module.exports.createXlsx = async (filename, sheetName, columns, data) => {
  const basePath = path.resolve(__dirname, "../public/static/xlsx");
  const filePath = path.join(basePath, filename);
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet(sheetName);
  worksheet.columns = [...columns];
  worksheet.addRows(data);
  await workbook.xlsx.writeFile(filePath);
};
