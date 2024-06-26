/**
 * 文章模块对应二级路由
 */

const express = require("express");
const router = express.Router();

const {
  findArticleByPageService,
  findArticleTitleByTypeService,
  findArticleByIdService,
  addArticleService,
  deleteArticleService,
  updateArticleService,
  htmlToDocxService,
  htmlToMarkdownService
} = require("../services/articleService");

const { formatResponse } = require("../utils/tools");

/**
 * 根据分页获取文章
 */
router.get("/", async function (req, res) {
  const result = await findArticleByPageService(req.query);
  return res.send(formatResponse(0, "", result));
});

/**
 * 获取所有分类的文章标题
 */
router.get("/articleTitle", async function (req, res) {
  const result = await findArticleTitleByTypeService();
  return res.send(formatResponse(0, "", result));
});

/**
 * 根据 id 获取文章
 */
router.get("/:id", async function (req, res) {
  const result = await findArticleByIdService(req.params.id);
  return res.send(formatResponse(0, "", result));
});

/**
 * 新增文章
 */
router.post("/", async function (req, res, next) {
  const result = await addArticleService(req.body);
  if (result && result._id) {
    return res.send(formatResponse(0, "", result));
  } else {
    next(result);
  }
});

/**
 * 删除文章
 */
router.delete("/:id", async function (req, res) {
  const result = await deleteArticleService(req.params.id);
  return res.send(formatResponse(0, "", result));
});

/**
 * 修改文章
 */
router.patch("/:id", async function (req, res) {
  const result = await updateArticleService(req.params.id, req.body);
  return res.send(formatResponse(0, "", result));
});

/**
 * 根据 id 将文章转换成 Word 文件
 */
router.get("/word/:id", async function (req, res) {
  try {
    // 调用业务逻辑层定义的方法
    const result = await htmlToDocxService(req.params.id);
    // 设置响应头，告诉浏览器，这是个文件流
    res.set({
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": "attachment; filename=article.docx"
    });
    // 返回文件流
    return res.send(result);
  } catch (error) {
    console.error("Error converting HTML to DOCX:", error);
    res.status(500).send("Error exporting article to Word file");
  }
});

/**
 * 根据 id 将文章转换成 Markdown 文件
 */
router.get("/markdown/:id", async function (req, res) {
  try {
    const result = await htmlToMarkdownService(req.params.id);
    res.set({
      "Content-Type": "text/markdown",
      "Content-Disposition": "attachment; filename=article.md"
    });
    return res.send(result);
  } catch (error) {
    console.error("Error converting HTML to DOCX:", error);
    res.status(500).send("Error exporting article to Word file");
  }
});

module.exports = router;
