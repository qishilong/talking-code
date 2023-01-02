const {
  findArticleByPageDao,
  findArticleTitleByTypeDao,
  findArticleByIdDao,
  addArticleDao,
  deleteArticleDao,
  updateArticleDao,
} = require("../dao/articleDao");

const { validate } = require("validate.js");
const { articleRule } = require("./rules");
const { ValidationError } = require("../utils/errors");

/**
 * 按照分页查询面试题
 */
module.exports.findArticleByPageService = async function (queryObj) {
  return await findArticleByPageDao(queryObj);
};

/**
 * 获取所有分类的面试题标题
 */
module.exports.findArticleTitleByTypeService = async function () {
  return await findArticleTitleByTypeDao();
};

/**
 * 根据 id 查找某一道面试题
 */
module.exports.findArticleByIdService = async function (id) {
  return await findArticleByIdDao(id);
};

/**
 * 新增面试题
 */
module.exports.addArticleService = async function (newArticleInfo) {
  // 首先进行同步的数据验证
  const validateResult = validate.validate(newArticleInfo, articleRule);
  if (!validateResult) {
    // 上架日期
    newArticleInfo.onShelfDate = new Date().getTime().toString();
    // 验证通过
    return await addArticleDao(newArticleInfo);
  } else {
    // 数据验证失败
    return new ValidationError("数据验证失败");
  }
};

/**
 * 删除面试题
 */
module.exports.deleteArticleService = async function (id) {
  // 接下来再删除该书籍
  return await deleteArticleDao(id);
};


/**
 * 修改面试题
 */
module.exports.updateArticleService = async function (id, newInfo) {
  return await updateArticleDao(id, newInfo);
};
