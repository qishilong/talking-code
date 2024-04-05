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
  updateArticleService
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

module.exports = router;
