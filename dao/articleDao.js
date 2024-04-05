// 引入模型
const articleModel = require("../models/articleModel");
const { findAllTypeDao } = require("./typeDao");

/**
 * 分页查找文章
 */
module.exports.findArticleByPageDao = async function (queryObj) {
  const pageObj = {
    currentPage: Number(queryObj.current),
    eachPage: Number(queryObj.pageSize)
  };

  const queryCondition = {};
  if (queryObj.articleTitle) {
    // 用户要按照书籍标题进行搜索
    queryCondition.articleTitle = new RegExp(queryObj.articleTitle, "i");
  }
  if (queryObj.typeId) {
    // 用户要按照分类进行搜索
    queryCondition.typeId = queryObj.typeId;
  }
  if (queryObj.onShelfDate) {
    const time = Number(queryObj.onShelfDate);
    const day = new Date(time).toLocaleDateString();
    // 用户要按照上架时间进行搜索
    queryCondition.onShelfDate = {
      $gt: `${new Date(day).getTime()}`,
      $lt: `${new Date(day).getTime() + 24 * 60 * 60 * 1000}`
    };
  }

  pageObj.count = await articleModel.countDocuments(queryCondition); // 数据总条数
  pageObj.totalPage = Math.ceil(pageObj.count / pageObj.eachPage); // 总页数
  pageObj.data = await articleModel
    .find(queryCondition)
    .skip((pageObj.currentPage - 1) * pageObj.eachPage) // 设置跳过的数据条数
    .sort({ onShelfDate: -1 })
    .limit(pageObj.eachPage); // 查询条数

  return pageObj;
};

/**
 * 获取所有分类的文章标题
 */
module.exports.findArticleTitleByTypeDao = async function () {
  // 1. 获取所有分类
  const typeData = await findAllTypeDao();

  const articleTitleData = [];
  for (let i = 0; i < typeData.length; i++) {
    // 查询对应 typeId 的文章，只需要题目即可
    // 因此后面添加了 { articleTitle: 1 }
    const data = await articleModel.find(
      {
        typeId: typeData[i]._id
      },
      { articleTitle: 1 }
    );
    articleTitleData.push(data);
  }
  return articleTitleData;
};

/**
 * 根据 id 返回文章
 */
module.exports.findArticleByIdDao = async function (id) {
  return articleModel.findOne({
    _id: id
  });
};

/**
 * 新增文章
 */
module.exports.addArticleDao = async function (newArticleInfo) {
  return await articleModel.create(newArticleInfo);
};

/**
 * 根据 id 删除文章
 */
module.exports.deleteArticleDao = async function (id) {
  return articleModel.deleteOne({
    _id: id
  });
};

/**
 * 根据 id 修改文章
 */
module.exports.updateArticleDao = async function (id, newInfo) {
  return articleModel.updateOne({ _id: id }, newInfo);
};
