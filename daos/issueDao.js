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
    // 用户要按照问题标题进行搜索
    queryCondition.issueTitle = new RegExp(queryObj.issueTitle, "i");
  }
  if (queryObj.typeId) {
    // 用户要按照分类进行搜索
    queryCondition.typeId = queryObj.typeId;
  }
  if (queryObj.issueStatus !== undefined) {
    queryCondition.issueStatus = queryObj.issueStatus;
  }

  pageObj.count = await issueModel.countDocuments(queryCondition); // 数据总条数
  pageObj.totalPage = Math.ceil(pageObj.count / pageObj.eachPage); // 总页数
  pageObj.data = await issueModel
    .find(queryCondition)
    .populate({
      path: "userId",
      select: "loginId nickname"
    })
    .skip((pageObj.currentPage - 1) * pageObj.eachPage) // 设置跳过的数据条数
    .sort({ issueDate: -1 })
    .limit(pageObj.eachPage); // 查询条数

  pageObj.allData = await issueModel.find().populate({
    path: "userId",
    select: "loginId nickname"
  });

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
  try {
    await commentModel.deleteMany({ issueId: id });
    const res = await issueModel.deleteOne({ _id: id });
    return res;
  } catch (error) {
    throw error;
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
module.exports.updateIssueLikeOrDislikeDao = async function (id, params) {
  // 根据 id 查找文档
  const res = await issueModel.findOne({ _id: id });
  // 判断是什么类型的事件
  switch (params.type) {
    case "like":
      res.issueLike.push(params.user);
      if (res.issueDislike.includes(params.user)) {
        res.issueDislike.splice(res.issueDislike.indexOf(params.user), 1);
      }
      break;
    case "dislike":
      res.issueDislike.push(params.user);
      if (res.issueLike.includes(params.user)) {
        res.issueLike.splice(res.issueLike.indexOf(params.user), 1);
      }
      break;
    case "cancelLike":
      res.issueLike.splice(res.issueLike.indexOf(params.user), 1);
      break;
    case "cancelDislike":
      res.issueDislike.splice(res.issueDislike.indexOf(params.user), 1);
      break;
    default:
      break;
  }

  // 去重逻辑
  res.issueLike = res.issueLike.filter((item, index, arr) => arr.indexOf(item) === index);
  res.issueDislike = res.issueDislike.filter((item, index, arr) => arr.indexOf(item) === index);

  // 更新后保存文档
  return await res.save();
};
