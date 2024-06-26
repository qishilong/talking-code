const {
  findArticleByPageDao,
  findArticleTitleByTypeDao,
  findArticleByIdDao,
  addArticleDao,
  deleteArticleDao,
  updateArticleDao
} = require("../daos/articleDao");

const { validate } = require("validate.js");
const { articleRule } = require("./rules");
const { ValidationError } = require("../utils/errors");
const htmlToDocx = require("html-to-docx");
const TurndownService = require("turndown");

/**
 * 按照分页查询文章
 */
module.exports.findArticleByPageService = async function (queryObj) {
  return await findArticleByPageDao(queryObj);
};

/**
 * 获取所有分类的文章标题
 */
module.exports.findArticleTitleByTypeService = async function () {
  return await findArticleTitleByTypeDao();
};

/**
 * 根据 id 查找某一道文章
 */
module.exports.findArticleByIdService = async function (id) {
  return await findArticleByIdDao(id);
};

/**
 * 新增文章
 */
module.exports.addArticleService = async function (newArticleInfo) {
  // 首先进行同步的数据验证
  const validateResult = validate.validate(newArticleInfo, articleRule);
  if (!validateResult) {
    if (!newArticleInfo.onShelfDate) {
      // 上架日期
      newArticleInfo.onShelfDate = String(new Date().getTime());
    }
    // 验证通过
    return await addArticleDao(newArticleInfo);
  } else {
    // 数据验证失败
    return new ValidationError("数据验证失败");
  }
};

/**
 * 删除文章
 */
module.exports.deleteArticleService = async function (id) {
  // 接下来再删除该书籍
  return await deleteArticleDao(id);
};

/**
 * 修改文章
 */
module.exports.updateArticleService = async function (id, newInfo) {
  return await updateArticleDao(id, newInfo);
};

/**
 * 根据 id 将文章转换成 Word 文件
 * @param {*} id
 * @returns
 */
module.exports.htmlToDocxService = async function (id) {
  const article = await findArticleByIdDao(id);
  return await htmlToDocx(article.articleContent, null, {
    title: article.articleTitle,
    table: { row: { cantSplit: true } },
    footer: true,
    pageNumber: true
  });
};

/**
 * 根据 id 将文章转换成 Markdown 文件
 * @param {*} id
 * @returns
 */
module.exports.htmlToMarkdownService = async function (id) {
  const article = await findArticleByIdDao(id);
  const turndownService = new TurndownService();
  return await turndownService.turndown(article.articleContent);
};
