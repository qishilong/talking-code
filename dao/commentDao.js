// 引入模型
const commentModel = require("../models/commentModel");
const issueModel = require("../models/issueModel");
const mongoose = require("mongoose");

/**
 * 根据分页查找问答评论或者书籍评论
 */

module.exports.findCommentByPageAndTypeDao = async function (commentType, queryObj) {
  const pageObj = {
    currentPage: Number(queryObj.current),
    eachPage: Number(queryObj.pageSize)
  };

  const queryCondition = {};

  if (queryObj.typeId) {
    // 用户要按照分类进行搜索
    queryCondition.typeId = queryObj.typeId;
  }
  // 按照评论内容进行查询
  if (queryObj.commentContent) {
    queryCondition.commentContent = new RegExp(queryObj.commentContent, "i");
  }

  pageObj.count = await commentModel.countDocuments({
    commentType,
    $or: [queryCondition]
  }); // 数据总条数
  pageObj.totalPage = Math.ceil(pageObj.count / pageObj.eachPage); // 总页数
  pageObj.data = await commentModel
    .find({
      commentType,
      $or: [queryCondition]
    })
    .skip((pageObj.currentPage - 1) * pageObj.eachPage) // 设置跳过的数据条数
    .sort({ commentDate: -1 })
    .limit(pageObj.eachPage); // 查询条数

  return pageObj;
};

/**
 * 按照分页获取问答模块某一问题对应的评论
 */
module.exports.findIssueCommentByIdDao = async function (issueId, pager) {
  // 如果没有传递 pager 对象，那就是要查询该 issueId 对应的所有评论
  if (!pager) {
    return await commentModel.find({
      issueId
    });
  }

  const pageObj = {
    currentPage: Number(pager.current),
    eachPage: Number(pager.pageSize)
  };
  pageObj.count = await commentModel.countDocuments({
    issueId
  }); // 数据总条数
  pageObj.totalPage = Math.ceil(pageObj.count / pageObj.eachPage); // 总页数
  pageObj.data = await commentModel
    .find({
      issueId
    })
    .skip((pageObj.currentPage - 1) * pageObj.eachPage) // 设置跳过的数据条数
    .sort({ commentDate: -1 })
    .limit(pageObj.eachPage); // 查询条数

  try {
    pageObj.data = await commentModel
      .find({
        issueId
      })
      .populate("userId")
      .skip((pageObj.currentPage - 1) * pageObj.eachPage) // 设置跳过的数据条数
      .sort({ commentDate: -1 })
      .limit(pageObj.eachPage); // 查询条数;
  } catch (error) {
    return error;
  }

  return pageObj;
};

/**
 * 按照分页获取书籍模块某一本书对应的评论
 */
module.exports.findBookCommentByIdDao = async function (bookId, pager) {
  // 如果没有传递 pager 对象，那就是要查询该 bookId 对应的所有评论
  if (!pager) {
    return await commentModel.find({
      bookId
    });
  }

  const pageObj = {
    currentPage: Number(pager.current),
    eachPage: Number(pager.pageSize)
  };
  pageObj.count = await commentModel.countDocuments({
    bookId
  }); // 数据总条数
  pageObj.totalPage = Math.ceil(pageObj.count / pageObj.eachPage); // 总页数
  pageObj.data = await commentModel
    .find({
      bookId
    })
    .skip((pageObj.currentPage - 1) * pageObj.eachPage) // 设置跳过的数据条数
    .sort({ commentDate: -1 })
    .limit(pageObj.eachPage); // 查询条数

  try {
    pageObj.userInfo = await commentModel
      .find({
        bookId
      })
      .populate("userId")
      .skip((pageObj.currentPage - 1) * pageObj.eachPage) // 设置跳过的数据条数
      .sort({ commentDate: -1 })
      .limit(pageObj.eachPage); // 查询条数;
  } catch (error) {
    throw error;
  }

  return pageObj;
};

/**
 * 新增一条评论
 */
module.exports.addCommentDao = async function (newCommentInfo) {
  if (!newCommentInfo.issueId) {
    newCommentInfo.issueId = null;
  } else {
    newCommentInfo.bookId = null;
  }
  return await commentModel.create(newCommentInfo);
};

/**
 * 根据 id 删除一条评论
 */
module.exports.deleteCommentDao = async function (id) {
  const session = mongoose.startSession();
  try {
    (await session).startTransaction();

    const res = await commentModel.findOneAndDelete({
      _id: id
    });

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
 * 根据 id 修改评论
 */
module.exports.updateCommentDao = async function (id, newInfo) {
  return commentModel.updateOne({ _id: id }, newInfo);
};

/**
 * 根据 id 和 type 新增或减少对应评论的点赞人员或者点踩人员
 */
module.exports.updateCommentLikeOrDislikeDao = async function (id, params) {
  let session = await mongoose.startSession();
  try {
    session.startTransaction();
    let comment = await commentModel.findOne({ _id: id });

    switch (params.type) {
      case "like":
        comment.commentLike.push(params.user);
        if (comment.commentDislike.includes(params.user)) {
          comment.commentDislike.splice(comment.commentDislike.indexOf(params.user), 1);
        }
        break;
      case "dislike":
        comment.commentDislike.push(params.user);
        if (comment.commentLike.includes(params.user)) {
          comment.commentLike.splice(comment.commentLike.indexOf(params.user), 1);
        }
        break;
      case "cancelLike":
        comment.commentLike.splice(comment.commentLike.indexOf(params.user), 1);
        break;
      case "cancelDislike":
        comment.commentDislike.splice(comment.commentDislike.indexOf(params.user), 1);
        break;
      default:
        break;
    }

    comment.commentLike = comment.commentLike.filter(
      (item, index, arr) => arr.indexOf(item) === index
    );

    comment.commentDislike = comment.commentDislike.filter(
      (item, index, arr) => arr.indexOf(item) === index
    );

    await session.commitTransaction();
    return await comment.save();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};
