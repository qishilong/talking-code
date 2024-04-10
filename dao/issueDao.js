// 引入模型
const issueModel = require("../models/issueModel");
const commentModel = require("../models/commentModel");
const mongoose = require("mongoose");

/**
 * 分页查找问答
 */
module.exports.findIssueByPageDao = async function (queryObj) {
  const pageObj = {
    currentPage: Number(queryObj.current),
    eachPage: Number(queryObj.pageSize)
  };

  const queryCondition = {};
  if (queryObj.issueTitle) {
    // 用户要按照书籍标题进行搜索
    queryCondition.issueTitle = new RegExp(queryObj.issueTitle, "i");
  }
  if (queryObj.typeId) {
    // 用户要按照分类进行搜索
    queryCondition.typeId = queryObj.typeId;
  }
  if (queryObj.issueStatus != undefined) {
    queryCondition.issueStatus = queryObj.issueStatus;
  }

  pageObj.count = await issueModel.countDocuments(queryCondition); // 数据总条数
  pageObj.totalPage = Math.ceil(pageObj.count / pageObj.eachPage); // 总页数
  pageObj.data = await issueModel
    .find(queryCondition)
    .skip((pageObj.currentPage - 1) * pageObj.eachPage) // 设置跳过的数据条数
    .sort({ issueDate: -1 })
    .limit(pageObj.eachPage); // 查询条数
  return pageObj;
};

/**
 * 根据 id 获取其中一个问答的详情
 */
module.exports.findIssueByIdDao = async function (id) {
  return issueModel
    .findOne({
      _id: id
    })
    .populate("userId");
};

/**
 * 新增问答
 */
module.exports.addIssueDao = async function (newIssueInfo) {
  return await issueModel.create(newIssueInfo);
};

/**
 * 根据 id 删除问答
 */
module.exports.deleteIssueDao = async function (id) {
  const session = mongoose.startSession();
  try {
    (await session).startTransaction();

    await commentModel.deleteMany({ issueId: id });
    const res = await issueModel.deleteOne({ _id: id });

    (await session).commitTransaction();

    return res;
  } catch (error) {
    (await session).abortTransaction();
    throw error;
  } finally {
    (await session).endSession();
  }
};

/**
 * 根据 id 修改问答
 */

module.exports.updateIssueDao = async function (id, newInfo) {
  return issueModel.updateOne({ _id: id }, newInfo);
};

/**
 * 根据 id 和 type 新增或减少对应文档的点赞人员或者点踩人员
 */
module.exports.updateIssueLikeOrDislikeDao = async function (id, type, user) {
  const res = await issueModel.findOne({ _id: id });
  if (type === "like") {
    res.issueLike.push(user);
    if (res.issueDislike.includes(user)) {
      res.issueDislike.splice(res.issueDislike.indexOf(user), 1);
    }
  } else {
    res.issueDislike.push(user);
    if (res.issueLike.includes(user)) {
      res.issueLike.splice(res.issueLike.indexOf(user), 1);
    }
  }
  return await res.save();
};
