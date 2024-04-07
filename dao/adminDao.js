// 引入模型
const adminModel = require("../models/adminModel");

/**
 * 查询所有的管理员
 */
module.exports.findAllAdminDao = async function (queryObj) {
  if (!queryObj) {
    return await adminModel.find();
  }

  const pageObj = {
    current: Number(queryObj.current),
    pageSize: Number(queryObj.pageSize)
  };

  const queryCondition = {};
  if (queryObj.loginId) {
    // 用户要按照loginId进行搜索
    queryCondition.loginId = new RegExp(queryObj.loginId, "i");
  }
  if (queryObj.nickname) {
    // 用户要按照nickname进行搜索
    queryCondition.nickname = new RegExp(queryObj.nickname, "i");
  }

  pageObj.count = await adminModel.countDocuments(queryCondition); // 数据总条数
  pageObj.totalPage = Math.ceil(pageObj.count / pageObj.pageSize); // 总页数
  pageObj.data = await adminModel
    .find(queryCondition)
    .skip((pageObj.current - 1) * pageObj.pageSize)
    .limit(pageObj.pageSize);
  return pageObj;
};

/**
 * 登录
 * @param {*} 用户输入的账号密码
 * @returns 返回查询到的数据
 */
module.exports.loginDao = async function ({ loginId, loginPwd }) {
  return await adminModel.findOne({ loginId, loginPwd });
};

/**
 * 添加新的管理员
 * @param {*} newAdminInfo 新管理员信息
 * @returns
 */
module.exports.addAdminDao = async function (newAdminInfo) {
  return await adminModel.create(newAdminInfo);
};

/**
 * 根据 id 删除管理员
 * @param {*} id
 */
module.exports.deleteAdminDao = async function (id) {
  return adminModel.deleteOne({
    _id: id
  });
};

/**
 * 根据 id 查找管理员
 * @param {*} id 要查找的管理员 id
 * @returns
 */
module.exports.findAdminByIdDao = async function (id) {
  return adminModel.findOne({
    _id: id
  });
};

/**
 * 根据 id 修改某一位管理员的某一项信息
 * @param {*} id 要修改的管理员 id
 * @param {*} newInfo 要修改的信息
 */
module.exports.updateAdminDao = async function (id, newInfo) {
  return adminModel.updateOne({ _id: id }, newInfo);
};

/**
 * 根据 loginId 查找管理员
 * @param {*} loginId
 * @returns
 */
module.exports.findAdminByLoginId = async function (loginId) {
  return await adminModel.find({ loginId });
};
